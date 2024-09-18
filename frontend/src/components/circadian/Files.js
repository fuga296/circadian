import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import './Files.css'

const File = () => {
    const { path } = useParams();
    const [fileInfo, setFileInfo] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const iframeRef = useRef(null);

    useEffect(() => {
        async function fetchFile() {
            try {
                const response = await axiosInstance.get(`/circadian/api/file/${path}`);
                if (response.data.error) {
                    if (response.data.error === 'NotFound') {
                        setError("ファイルが存在しません。");
                    }
                } else {
                    setFileInfo(response.data);
                }
            } catch (error) {
                setError("ファイルが取得できませんでした。");
            }
            setIsLoading(false);
        }
        fetchFile();
    }, [path]);

    const displayBinaryDataAsImage = (binaryData, fileType) => {
        if (!binaryData) {
            return '';
        }
        return `data:${fileType};base64,${binaryData}`;
    };

    const displayBinaryDataAsBlob = (binaryData, fileType) => {
        if (!binaryData) {
            return '';
        }
        const byteCharacters = atob(binaryData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: fileType });
        return URL.createObjectURL(blob);
    };

    const renderFile = () => {
        if (!fileInfo || !fileInfo.binaryData) {
            return <p>メディアデータがありません。</p>;
        }

        const blobUrl = displayBinaryDataAsBlob(fileInfo.binaryData, fileInfo.fileType);
        const fileType = fileInfo.fileType.split('/')[0];

        switch (fileType) {
            case 'image':
                return <img src={blobUrl} alt={fileInfo.fileName} />;
            case 'video':
                return <video src={blobUrl} controls>お使いのブラウザはビデオタグをサポートしていません。</video>;
            case 'audio':
                return <audio src={blobUrl} controls>お使いのブラウザはオーディオタグをサポートしていません。</audio>;
            case 'application':
                if (fileInfo.fileType === 'application/pdf') {
                    return <embed src={blobUrl} type="application/pdf" width="100%" height="600px" />;
                }
                break;
            case 'text':
                return <iframe ref={iframeRef} src={blobUrl} width="100%" height="600px" title={`テキストファイル: ${fileInfo.fileName}`}></iframe>;
            default:
                return <p>このファイル形式は直接表示できません。ダウンロードしてご覧ください。</p>;
        }
    };

    useEffect(() => {
        if (iframeRef.current && fileInfo && fileInfo.fileType.startsWith('text/')) {
            iframeRef.current.onload = () => {
                const iframeDocument = iframeRef.current.contentDocument;
                if (iframeDocument) {
                    iframeDocument.body.style.fontFamily = 'monospace';
                    iframeDocument.body.style.whiteSpace = 'pre-wrap';
                    iframeDocument.body.style.wordWrap = 'break-word';
                }
            };
        }
    }, [fileInfo]);

    return (
        <div id="contentContainer">
            <header>
                {fileInfo ? <h1 id="fileName">{fileInfo.fileName}</h1> : null}
            </header>

            {error ? <main id='errorMessage'>{error}</main> :
            isLoading ?  <main id='loadingMessage'>Loading…</main> :
            <main>
                {fileInfo ? (
                    <>
                        <div>ファイルタイプ: {fileInfo.fileType}</div>
                        <div>URLパス: {fileInfo.url}</div>
                        <a href={displayBinaryDataAsImage(fileInfo.binaryData, fileInfo.fileType)} download>{fileInfo.fileName}をダウンロードする</a>
                        {renderFile()}
                    </>
                ) : (
                    <p>メディア情報が利用できません。</p>
                )}
            </main>}
        </div>
    )
}

export default File;