import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { UPLOAD_SAVE_DESCRIPTION } from '../constants';
import useCurrentChecklistStore from '../hooks/useCurrentChecklistStore';
import useSaveParser from '../hooks/useSaveParser';
import useUiStore from '../stores/uiStore';
import Button from './Button';

const UploadeSaveWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    & input {
        display: none;
    }
`;

const SaveUploader: React.FC = () => {
    const uploadRef = useRef<HTMLInputElement>(null);
    const [uploadButtonText, setUploadButtonText] =
        useState('Upload save file');
    const { isLoading, error, result, isWasmReady, parseSaveFile } =
        useSaveParser();

    const setTooltipText = useUiStore(state => state.setTooltipText);
    const openTooltip = useUiStore(state => state.openTooltip);
    const setFromSaveFile = useCurrentChecklistStore()(
        state => state.setFromSaveFile
    );

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadButtonText(`Uploaded: ${file.name}`);
            parseSaveFile(file);
        }
    };

    useEffect(() => {
        if (result) {
            setFromSaveFile(result);
        }
    }, [result, isLoading, setFromSaveFile]);

    return (
        <>
            <UploadeSaveWrapper>
                <Button
                    onClick={() => uploadRef.current?.click()}
                    label={uploadButtonText}
                />
                <Button
                    onClick={() => {
                        setTooltipText(UPLOAD_SAVE_DESCRIPTION);
                        openTooltip();
                    }}
                    label='How to upload a save?'
                    size='small'
                />
                <input
                    ref={uploadRef}
                    type='file'
                    accept='.dat'
                    onChange={handleFileChange}
                    disabled={isLoading}
                />
            </UploadeSaveWrapper>
            {!isWasmReady && <p>Loading WebAssembly module...</p>}
            {isLoading && <p>Parsing save file...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </>
    );
};

export default SaveUploader;
