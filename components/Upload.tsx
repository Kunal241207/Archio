import { useCallback, useEffect, useRef, useState } from 'react';
import { useOutletContext } from "react-router";
import { CheckCircle2, ImageIcon, CloudUpload } from "lucide-react";
import { PROGRESS_INCREMENT, REDIRECT_DELAY_MS, PROGRESS_INTERVAL_MS } from "../lib/constants";

interface UploadProps {
    onComplete?: (base64Data: string) => void;
}

const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const Upload = ({ onComplete }: UploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const progressRef = useRef(0);
    const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { isSignedIn } = useOutletContext<AuthContext>();

    const clearUploadInterval = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const clearRedirectTimeout = useCallback(() => {
        if (redirectTimeoutRef.current) {
            clearTimeout(redirectTimeoutRef.current);
            redirectTimeoutRef.current = null;
        }
    }, []);

    useEffect(() => () => {
        clearUploadInterval();
        clearRedirectTimeout();
    }, [clearUploadInterval, clearRedirectTimeout]);

    const processFile = useCallback((file: File) => {
        if (!isSignedIn) return;
        if (!SUPPORTED_MIME_TYPES.includes(file.type)) return;
        if (file.size > MAX_FILE_SIZE_BYTES) return;

        clearUploadInterval();
        clearRedirectTimeout();

        setFile(file);
        setProgress(0);
        progressRef.current = 0;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result as string;
            intervalRef.current = setInterval(() => {
                const nextProgress = Math.min(progressRef.current + PROGRESS_INCREMENT, 100);
                progressRef.current = nextProgress;
                setProgress(nextProgress);

                if (nextProgress >= 100) {
                    clearUploadInterval();
                    redirectTimeoutRef.current = setTimeout(() => onComplete?.(base64Data), REDIRECT_DELAY_MS);
                }
            }, PROGRESS_INTERVAL_MS);
        };
        reader.readAsDataURL(file);
    }, [isSignedIn, onComplete, clearUploadInterval, clearRedirectTimeout]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (isSignedIn) setIsDragging(true);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (!isSignedIn) return;

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) processFile(droppedFile);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && isSignedIn) processFile(selectedFile);
    };

    return (
        <div className="upload">
            {!file ? (
                <div
                    className={`dropzone ${isDragging ? 'is-dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        className="drop-input"
                        accept=".jpg,.jpeg,.png,.webp"
                        disabled={!isSignedIn}
                        onChange={handleChange}
                    />
                    <div className="drop-content">
                        <div className="drop-icon">
                            <CloudUpload />
                        </div>
                        <p>{isSignedIn ? "Click to upload or just drag and drop" : "Please sign in to upload"}</p>
                        <p className="help">Maximum file size 10 MB</p>
                    </div>
                </div>
            ) : (
                <div className="upload-status">
                    <div className="status-content">
                        <div className="status-icon">
                            {progress === 100 ? <CheckCircle2 className="check" /> : <ImageIcon className="image" />}
                        </div>
                        <h3>{file.name}</h3>
                        <div className='progress'>
                            <div className="bar" style={{ width: `${progress}%` }} />
                            <p className="status-text">
                                {progress < 100 ? `Uploading... ${progress}%` : 'Redirecting...'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Upload;
