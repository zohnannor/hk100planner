import init, { Parser } from 'hollow-knight-save-parser';
import { useCallback, useEffect, useState } from 'react';

import { SaveFile } from '../types/checklist';

export const useSaveParser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<SaveFile | null>(null);
    const [isWasmReady, setIsWasmReady] = useState(false);

    useEffect(() => {
        const initializeWasm = async () => {
            try {
                await init();
                setIsWasmReady(true);
            } catch (err) {
                setError('Failed to initialize WebAssembly module');
                console.error('WASM initialization error:', err);
            }
        };

        initializeWasm();
    }, []);

    const parseSaveFile = useCallback(
        async (file: File) => {
            if (!isWasmReady) {
                setError('WebAssembly module is not ready yet');
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const bytes = new Uint8Array(await file.arrayBuffer());
                const parser = new Parser();
                parser.parse_save_file(bytes);
                const map = parser.get_map();
                setResult(map);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Unknown error occurred'
                );
                console.error('Parsing error:', err);
            } finally {
                setIsLoading(false);
            }
        },
        [isWasmReady]
    );

    return {
        isLoading,
        error,
        result,
        isWasmReady,
        parseSaveFile,
    };
};
