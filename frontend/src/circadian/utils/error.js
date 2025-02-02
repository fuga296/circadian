import axios from "axios";

/**
 * Axiosエラー統合ハンドラー
 * @param {Error} error - axiosのエラーオブジェクト
 * @param {Object} [options] - カスタムオプション
 * @param {Object} [options.messages] - カスタムエラーメッセージ
 * @param {Function} [options.onError] - エラー発生時のコールバック
 * @param {boolean} [options.logDetails=true] - エラーの詳細をコンソールに出力
 * @returns {string} ユーザー向けエラーメッセージ
 */

export const handleError = (error, options = {}) => {
    const defaultMessages = {
        network: 'ネットワーク接続に問題があります。インターネット接続を確認してください',
        timeout: 'サーバーからの応答がありません。時間をおいて再度お試しください',
        client: 'リクエストの形式に誤りがあります',
        server: 'サーバーで問題が発生しました。しばらくしてから再試行してください',
        default: '予期せぬエラーが発生しました'
    };

    const {
        messages = {},
        onError,
        logDetails = true
    } = options;

    const mergedMessages = { ...defaultMessages, ...messages };

    const errorType = (() => {
        if (axios.isCancel(error)) return 'canceled';
        if (error.response) return 'response';
        if (error.request) return 'request';
        return 'client';
    })();

    const errorDetails = {
        type: errorType,
        code: error.code,
        status: error.response?.status,
        method: error.config?.method?.toUpperCase(),
        url: error.config?.url,
        timestamp: new Date().toISOString()
    };

    if (logDetails) {
        console.error('API Error:', {
            ...errorDetails,
            config: error.config,
            stack: error.stack
        });
    }

    let userMessage = mergedMessages.default;

    switch (errorType) {
        case 'request':
            userMessage = error.code === 'ECONNABORTED'
            ? mergedMessages.timeout
            : mergedMessages.network;
            break;

        case 'response':
            userMessage = mergedMessages[`status_${errorDetails.status}`]
            || error.response.data?.message
            || mergedMessages.server;
            break;

        case 'client':
            userMessage = mergedMessages.client;
            break;

        case 'canceled':
            return ''; // キャンセル時はメッセージ表示しない

        default:
            break;
    }

    // ステータスコード別ハンドリング
    if (errorDetails.status) {
        switch (errorDetails.status) {
            case 401:
                // 認証エラーの場合の追加処理
                localStorage.removeItem('authToken');
                window.location.reload();
                break;

            case 429:
                userMessage = 'リクエストが集中しています。しばらく待ってから再試行してください';
                break;

            case 503:
                userMessage = 'サーバーメンテナンス中です。30分後にお試しください';
                break;

            default:
                break;
        }
    }

    // コールバック実行
    if (typeof onError === 'function') {
        onError({
            error,
            details: errorDetails,
            message: userMessage
        });
    }

    return userMessage;
};