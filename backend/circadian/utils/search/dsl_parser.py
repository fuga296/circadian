import re
from django.db.models import Q
from django.utils.dateparse import parse_date

def parse_dsl(query_str):
    """
    DSL文字列を「フィルタ部分」と「SORT BY」以降のソート指定に分割し、
    フィルタ部分は DSLParser により Q オブジェクトに、ソート部分はフィールドリストに変換する。
    """
    if not query_str.strip():
        return Q(), []  # 空文字なら全件検索とする
    # 大文字小文字を無視して "SORT BY" で分割
    parts = re.split(r'\s+SORT\s+BY\s+', query_str, flags=re.IGNORECASE)
    filter_part = parts[0].strip()
    sort_part = parts[1].strip() if len(parts) > 1 else ""

    parser = DSLParser(filter_part)
    q_obj = parser.parse_expression()

    sort_fields = [s.strip() for s in sort_part.split(",")] if sort_part else []
    return q_obj, sort_fields

def tokenize(text):
    """
    トークン：括弧、AND/OR/NOT（大文字小文字無視）、およびその他連続する非空白文字
    """
    token_pattern = r'\(|\)|\bAND\b|\bOR\b|\bNOT\b|[^\s()]+'
    tokens = re.findall(token_pattern, text, flags=re.IGNORECASE)
    return tokens

class DSLParser:
    def __init__(self, text):
        self.tokens = tokenize(text)
        self.pos = 0

    def current_token(self):
        return self.tokens[self.pos] if self.pos < len(self.tokens) else None

    def consume(self, expected_token=None):
        token = self.current_token()
        if expected_token and token.upper() != expected_token.upper():
            raise Exception(f"Expected '{expected_token}', got '{token}'")
        self.pos += 1
        return token

    def parse_expression(self):
        # expression ::= term ( OR term )*
        left = self.parse_term()
        while self.current_token() and self.current_token().upper() == "OR":
            self.consume("OR")
            right = self.parse_term()
            left = left | right
        return left

    def parse_term(self):
        # term ::= factor ( AND factor )*
        left = self.parse_factor()
        # ANDは明示されているか、空白で区切られて連続している場合も AND とみなす
        while self.current_token() and self.current_token().upper() == "AND":
            self.consume("AND")
            right = self.parse_factor()
            left = left & right
        # 空白区切りで連続している場合も AND と解釈する（ここではトークンが条件であれば）
        while self.current_token() and self.current_token() not in (")", "OR"):
            # もし次が論理演算子でなければ AND とみなす
            right = self.parse_factor()
            left = left & right
        return left

    def parse_factor(self):
        # factor ::= [NOT] ( condition | '(' expression ')' )
        if self.current_token() and self.current_token().upper() in ("NOT", "~"):
            self.consume()  # NOTまたは~
            return ~self.parse_factor()
        token = self.current_token()
        if token == "(":
            self.consume("(")
            expr = self.parse_expression()
            if self.current_token() != ")":
                raise Exception("閉じ括弧がありません。")
            self.consume(")")
            return expr
        return self.parse_condition()

    def parse_condition(self):
        """
        条件の形式は、フィールド名と比較演算子、値の組み合わせです。
        各種形式に対応するため、以下のパターンを順にチェックします。
        """
        token = self.consume()
        # token 例:  username="john"
        # token 例:  text:*会議*
        # token 例:  title:^Hello
        # token 例:  title:World$
        # token 例:  memo:~^週次報告$/i
        # token 例:  progress>=50, progress<80, progress:10~20
        # token 例:  created_at.year=2024  (datetimeのルックアップ)
        # まず、フィールド名部分を抽出
        # 分割記号として = または >=, >, <=, <, またはコロン (:) を用いる

        # パターン①：フィールドに続いて "=" で始まる（完全一致）場合
        m = re.match(r'^([^:=<>]+)=["\']?(.+?)["\']?$', token)
        if m:
            field, value = m.groups()
            # datetimeフィールドでルックアップ（ドット付きの場合）
            if '.' in field:
                base, lookup = field.split('.', 1)
                field = f"{base}__{lookup}"
            return Q(**{field: value})

        # パターン②：数値や日時の比較： >=, >, <=, < の場合
        for op, lookup_suffix in [(">=", "__gte"), (">", "__gt"), ("<=", "__lte"), ("<", "__lt")]:
            if op in token:
                parts = token.split(op)
                if len(parts) != 2:
                    raise Exception("無効な比較条件: " + token)
                field, value = parts
                # ルックアップのドット付き対応
                if '.' in field:
                    base, lookup = field.split('.', 1)
                    field = f"{base}__{lookup}"
                try:
                    num_value = float(value) if '.' in value else int(value)
                except:
                    num_value = value
                return Q(**{f"{field}{lookup_suffix}": num_value})

        # パターン③：範囲指定（数値または日時）： フィールド名 ":" <start> "~" <end>
        m = re.match(r'^([^:]+):([^~]+)~(.+)$', token)
        if m:
            field, start, end = m.groups()
            # ルックアップのドット付き対応
            if '.' in field:
                base, lookup = field.split('.', 1)
                field = f"{base}__{lookup}"
            # 日付の場合は parse_date を試す
            start_val = parse_date(start) or start
            end_val = parse_date(end) or end
            return Q(**{f"{field}__range": (start_val, end_val)})

        # パターン④：文字列の部分一致（前後にアスタリスク）
        m = re.match(r'^([^:]+):\*([^*]+)\*$', token)
        if m:
            field, value = m.groups()
            return Q(**{f"{field}__icontains": value})

        # パターン⑤：先頭一致（":" の後に "^" がある）
        m = re.match(r'^([^:]+):\^(.+)$', token)
        if m:
            field, value = m.groups()
            return Q(**{f"{field}__istartswith": value})

        # パターン⑥：末尾一致（":" の後に文字列が続き、最後が "$"）
        m = re.match(r'^([^:]+):(.+)\$$', token)
        if m:
            field, value = m.groups()
            return Q(**{f"{field}__iendswith": value})

        # パターン⑦：正規表現（":" の後に "~" がある）
        m = re.match(r'^([^:]+):~(.+)$', token)
        if m:
            field, rest = m.groups()
            # 末尾に "/i" があれば大文字小文字無視
            if rest.endswith("/i"):
                pattern = rest[:-2]
                lookup = f"{field}__iregex"
            else:
                pattern = rest
                lookup = f"{field}__regex"
            return Q(**{lookup: pattern})

        # もし上記どれにもマッチしなければエラー
        raise Exception("無効な条件トークン: " + token)