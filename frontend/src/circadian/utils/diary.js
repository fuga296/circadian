export const removeDuplicate = (array, flag) => {
    const seen = new Set();
    return array.filter(item => {
        if(seen.has(item[flag])) return false;
        seen.add(item[flag]);
        return true;
    });
};

export const sortDiaries = diaries => {
    const result = diaries;
    result.sort((a, b) => b.date.localeCompare(a.date));
    return result;
}

export const diaryBlockHeight = (isHistory) => {
    return isHistory ? 500 : 650;
};


// filterDiariesList 関数：diariesList と searchText を引数に、DSL に従ってフィルタリングしたリストを返す
export function filterDiariesList(diariesList, searchText, isCommand = false) {
    if (!searchText.trim()) return diariesList;
    let tokens;
    if (isCommand) {
        tokens = tokenize(searchText);
    } else {
        // 通常モード：単純に空白で分割
        tokens = searchText.split(/\s+/);
    }

    const parser = new DSLParser(tokens, isCommand);
    const expression = parser.parseExpression();

    return diariesList.filter(diary => evaluateExpression(expression, diary));
}

// tokenize: DSL文字列を括弧や論理演算子などのトークンに分割する関数
function tokenize(input) {
    // 括弧、AND, OR, NOT を個別トークン、それ以外は連続する非空白文字として抽出
    const regex = /\(|\)|\bAND\b|\bOR\b|\bNOT\b|[^\s()]+/gi;
    return input.match(regex);
}

// DSLParser クラス（再帰下降パーサーの簡易実装）
class DSLParser {
    constructor(tokens, isCommand = false) {
        this.tokens = tokens;
        this.pos = 0;
        this.isCommand = isCommand;
    }

    currentToken() {
        return this.pos < this.tokens.length ? this.tokens[this.pos] : null;
    }

    consume(expected) {
        const token = this.currentToken();
        if (expected && token.toUpperCase() !== expected.toUpperCase()) {
            throw new Error(`Expected ${expected}, got ${token}`);
        }
        this.pos++;
        return token;
    }

    // DSLモードの場合は、expression（ORで結合された条件）を解析
    parseExpression() {
        if (!this.isCommand) {
            // DSLモードでない場合、各トークンを text の部分一致条件として AND 結合する
            let qObj = { type: 'AND', conditions: [] };
            for (const token of this.tokens) {
                // op を 'icontains' として明示的に設定する
                qObj.conditions.push({ type: 'CONDITION', field: 'text', op: 'icontains', value: token });
            }
            return qObj;
        }
        // DSLモードの場合の処理…
        let left = this.parseTerm();
        while (this.currentToken() && this.currentToken().toUpperCase() === "OR") {
            this.consume("OR");
            let right = this.parseTerm();
            left = { type: 'OR', left: left, right: right };
        }
        return left;
    }

    // term ::= factor ( "AND" factor )*
    parseTerm() {
        let left = this.parseFactor();
        while (this.currentToken() && this.currentToken().toUpperCase() === "AND") {
            this.consume("AND");
            let right = this.parseFactor();
            left = { type: 'AND', left: left, right: right };
        }
        return left;
    }

    // factor ::= [NOT] ( condition | '(' expression ')' )
    parseFactor() {
        if (this.currentToken() && (this.currentToken().toUpperCase() === "NOT" || this.currentToken() === "~")) {
            this.consume(); // consume NOT or ~
            return { type: 'NOT', expr: this.parseFactor() };
        }
        if (this.currentToken() === "(") {
            this.consume("(");
            const expr = this.parseExpression();
            if (this.currentToken() !== ")") {
                throw new Error("Closing parenthesis expected");
            }
            this.consume(")");
            return expr;
        }
        return this.parseCondition();
    }

    // parseCondition: 単一条件を解析
    // 例：username="john"  progress>=50  date:2024-01-01~2024-02-01  text:*会議*  memo:~^週次報告$/i
    parseCondition() {
        const token = this.consume();
        // 範囲指定： field:val1~val2
        let m = token.match(/^([^:]+):([^~]+)~(.+)$/);
        if (m) {
            const [, field, start, end] = m;
            return { type: 'CONDITION', field: field, op: 'range', value: [start, end] };
        }
         // 比較演算子： >=, >, <=, < （ここはシンプルに、先頭の演算子をチェック）
        for (let [op, lookup] of [["<=", "lte"], [">=", "gte"], ["<", "lt"], [">", "gt"]]) {
            if ((token.indexOf(op) !== -1 && token.indexOf(op) < token.indexOf(":")) || token.indexOf(op) > token.indexOf(":")) {
                // 例: progress>=50
                let parts = token.split(op);
                if (parts.length === 2) {
                    const field = parts[0];
                    const value = parts[1];
                    return { type: 'CONDITION', field: field, op: lookup, value: value };
                }
            }
        }
        // 完全一致： field="value" or field='value'
        m = token.match(/^([^:=<>]+)=["'](.+?)["']$/);
        if (m) {
            const [, field, value] = m;
            return { type: 'CONDITION', field: field, op: 'exact', value: value };
        }
        // 部分一致： field:*value*
        m = token.match(/^([^:]+):\*([^*]+)\*$/);
        if (m) {
            const [, field, value] = m;
            return { type: 'CONDITION', field: field, op: 'icontains', value: value };
        }
        // 先頭一致： field:^value
        m = token.match(/^([^:]+):\^(.+)$/);
        if (m) {
            const [, field, value] = m;
            return { type: 'CONDITION', field: field, op: 'istartswith', value: value };
        }
        // 末尾一致： field:value$
        m = token.match(/^([^:]+):(.+)\$$/);
        if (m) {
            const [, field, value] = m;
            return { type: 'CONDITION', field: field, op: 'iendswith', value: value };
        }
        // 正規表現： field:~regex (例：memo:~^週次報告$/i)
        m = token.match(/^([^:]+):~(.+)$/);
        if (m) {
            const [, field, rest] = m;
            let op = 'regex';
            let pattern = rest;

            // パターンがスラッシュで囲まれている場合、先頭と末尾のスラッシュを取り除く
            if (pattern.startsWith("/")) {
                if (pattern.endsWith("/i") && pattern.length > 3) {
                    // 例："text:~/\\d/i" → パターン部分は "/\\d/i" → "\\d" に変更し、フラグ i を適用
                    pattern = pattern.slice(1, -2);
                    op = 'iregex';
                } else if (pattern.endsWith("/") && pattern.length > 2) {
                    // 例："text:~/\\d/" → パターン部分は "/\\d/" → "\\d" に変更
                    pattern = pattern.slice(1, -1);
                }
            }
            return { type: 'CONDITION', field: field, op: op, value: pattern };
        }
        // もし上記に該当しない場合は、単純な文字列として扱う（ここでは完全一致）
        return { type: 'CONDITION', field: 'text', op: 'icontains', value: token };
    }
}

// evaluateExpression と evaluateCondition は DSLParser で作成した条件の「木」を元に、各オブジェクトが条件を満たすか評価する関数
function evaluateExpression(expr, diary) {
    // conditions プロパティが存在する場合は、すべての条件をANDで評価
    if (expr && expr.conditions && Array.isArray(expr.conditions)) {
        return expr.conditions.every(condition => evaluateExpression(condition, diary));
    }

    switch (expr.type) {
        case 'CONDITION':
            return evaluateCondition(expr.field, expr.op, expr.value, diary);
        case 'AND':
            return evaluateExpression(expr.left, diary) && evaluateExpression(expr.right, diary);
        case 'OR':
            return evaluateExpression(expr.left, diary) || evaluateExpression(expr.right, diary);
        case 'NOT':
            return !evaluateExpression(expr.expr, diary);
        default:
            return true;
    }
}

function evaluateCondition(field, op, value, diary) {
    // op が未定義なら 'icontains' として扱う
    if (!op) op = 'icontains';
    const fieldValue = diary[field];
    if (fieldValue === undefined || fieldValue === null) return false;
    const strField = fieldValue.toString().toLowerCase();
    const strValue = value.toString().toLowerCase();

    switch(op) {
        case 'range':
            return fieldValue >= value[0] && fieldValue <= value[1];
        case 'gt':
            return fieldValue > value;
        case 'gte':
            return fieldValue >= value;
        case 'lt':
            return fieldValue < value;
        case 'lte':
            return fieldValue <= value;
        case 'exact':
            return fieldValue === value;
        case 'icontains':
            return strField.indexOf(strValue) !== -1;
        case 'istartswith':
            return strField.startsWith(strValue);
        case 'iendswith':
            return strField.endsWith(strValue);
        case 'regex':
        case 'iregex':
            try {
                const flags = op === 'iregex' ? 'i' : '';
                const regex = new RegExp(value, flags);
                return regex.test(fieldValue);
            } catch(e) {
                return false;
            }
        default:
            return false;
    }
}
