'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';

interface FileUploadProps {
    value?: File | string;  // File — новый файл, string — путь существующей картинки
    onChange: (value: File | string | undefined) => void;
    error?: boolean;
    disabled?: boolean;
}

const getImageUrl = (path: string) => {
    if (path.startsWith('blob:') || path.startsWith('http')) return path;
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const cleanPath = path.replace(/^\/+/, '').replace(/^uploads\//, '');
    return `${BASE_URL}/uploads/${cleanPath}`;
};

export const FileUpload = ({ value, onChange, error, disabled }: FileUploadProps) => {
    const [preview, setPreview] = useState<string | undefined>();
    const blobUrlRef = useRef<string | null>(null);

    // Синхронизация preview с value
    useEffect(() => {
        // Чистим старый blob, если был
        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
        }

        if (!value) {
            setPreview(undefined);
            return;
        }

        if (value instanceof File) {
            // Новый файл — создаём blob URL для превью
            const url = URL.createObjectURL(value);
            blobUrlRef.current = url;
            setPreview(url);
        } else {
            // Строка — путь существующей картинки
            setPreview(getImageUrl(value));
        }
    }, [value]);

    // Очистка blob при unmount
    useEffect(() => {
        return () => {
            if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
        };
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0 || disabled) return;
        const file = acceptedFiles[0];

        if (!file.type.startsWith('image/')) {
            alert('Только изображения');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Размер файла не должен превышать 5 МБ');
            return;
        }

        // Просто отдаём File родителю — никакой загрузки
        onChange(file);
    }, [onChange, disabled]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
        maxFiles: 1,
        disabled,
    });

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(undefined);
    };

    return (
        <div className="space-y-2">
            {!preview ? (
                <div
                    {...getRootProps()}
                    className={cn(
                        "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
                        isDragActive ? "border-red-500 bg-red-50" : error ? "border-red-500" : "border-border",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-3">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                        <p className="text-sm font-medium">Загрузить фото</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, WEBP до 5 МБ</p>
                    </div>
                </div>
            ) : (
                <div className="relative group w-full">
                    <div className="relative rounded-xl overflow-hidden border border-border bg-muted">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                        />

                        {!disabled && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleRemove}
                                >
                                    Заменить фото
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};