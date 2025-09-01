import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import useChecklistStore from '../../stores/checklistStore';
import useUiStore from '../../stores/uiStore';
import { useSaveParser } from '../../hooks/useSaveParser';
import Button from '../Button';
import { UPLOAD_SAVE_DESCRIPTION } from '../../constants';

export const UploadeSaveWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    & input {
        display: none;
    }
`;

export const SaveUploader: React.FC = () => {
    const uploadRef = useRef<HTMLInputElement>(null);
    const [uploadButtonText, setUploadButtonText] =
        useState('Upload save file');
    const { isLoading, error, result, isWasmReady, parseSaveFile } =
        useSaveParser();

    const setTooltipText = useUiStore(state => state.setTooltipText);
    const openTooltip = useUiStore(state => state.openTooltip);
    const setFromSaveFile = useChecklistStore(state => state.setFromSaveFile);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log(file);
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
            {!isWasmReady && <p>Loading WebAssembly module...</p>}
            <div>
                {/* TODO: remove, this is just to debug! :) */}
                {/* {result && (
                    <div>
                        <h3>Parse Results:</h3>
                        <ul>
                            {Object.entries(result).map(
                                ([sectionName, section]) => (
                                    <>
                                        <li>{sectionName}</li>
                                        <ul>
                                            {Array.from(section.entries()).map(
                                                ([key, value]) => (
                                                    <li key={key}>
                                                        {key}:
                                                        {value ? '✓' : '✗'}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </>
                                )
                            )}
                        </ul>
                    </div>
                )} */}
            </div>
            <UploadeSaveWrapper>
                <Button
                    onClick={() => {
                        uploadRef.current?.click();
                    }}
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
            {isLoading && <p>Parsing save file...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </>
    );
};
