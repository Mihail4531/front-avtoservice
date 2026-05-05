'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { uploadFile } from '@/entities/category-article/api/api';

interface FileUploadProps {
    value?: string;
    onChange: (value: string) => void;
    error?: boolean;
    disabled?: boolean;
}

/**
 * Утилита для формирования пути.
 * ВАЖНО: Мы используем порт 8080, так как твой сервер стартует на нем.
 */
const getImageUrl = (path?: string) => {
    if (!path) return '';
    if (path.startsWith('blob:') || path.startsWith('http')) return path;

    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    // Очищаем от начальных слэшей и от слова uploads/ в начале, чтобы склеить вручную
    const cleanPath = path.replace(/^\/+/, '').replace(/^uploads\//, '');

    return `${BASE_URL}/uploads/${cleanPath}`;
};

export const FileUpload = ({ value, onChange, error, disabled }: FileUploadProps) => {
    const [preview, setPreview] = useState<string | undefined>(value);
    const [isUploading, setIsUploading] = useState(false);
    const blobUrlRef = useRef<string | null>(null);

    // Синхронизация внешнего значения
    useEffect(() => {
        // Если пришло новое значение сверху, и это НЕ загрузка, 
        // и у нас сейчас НЕ активен локальный blob
        if (value && !isUploading && !preview?.startsWith('blob:')) {
            setPreview(value);
        } else if (!value && !isUploading) {
            setPreview(undefined);
        }
    }, [value, isUploading, preview]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0 || disabled) return;

        const file = acceptedFiles[0];
        if (!file.type.startsWith('image/')) return;

        setIsUploading(true);

        // Создаем временную ссылку
        if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
        const objectUrl = URL.createObjectURL(file);
        blobUrlRef.current = objectUrl;

        // Сразу ставим превью как blob
        setPreview(objectUrl);

        try {
            const response = await uploadFile(file, 'categories/articles');
            // Сообщаем родителю путь (напр. "categories/articles/uuid.jpg")
            onChange(response.path);

            // ВАЖНО: Мы НЕ вызываем setPreview(response.path) здесь.
            // Мы оставляем blobUrl, чтобы картинка не "мигнула" при замене URL на серверный.
        } catch (err) {
            console.error('Upload error:', err);
            setPreview(undefined);
            onChange('');
        } finally {
            setIsUploading(false);
        }
    }, [onChange, disabled]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
        maxFiles: 1,
        disabled: disabled || isUploading
    });

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
        }
        setPreview(undefined);
        onChange('');
    };

    useEffect(() => {
        return () => {
            if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
        };
    }, []);

    return (
        <div className="space-y-2">
            {!preview ? (
                <div
                    {...getRootProps()}
                    className={cn(
                        "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
                        isDragActive ? "border-red-500 bg-red-50" : error ? "border-red-500" : "border-border",
                        (disabled || isUploading) && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <input {...getInputProps()} />
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm">Загрузка...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <Upload className="w-6 h-6 text-muted-foreground" />
                            <p className="text-sm font-medium">Загрузить фото</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="relative group w-full">
                    <div className="relative rounded-xl overflow-hidden border border-border bg-muted">
                        <img
                            src={getImageUrl(preview)}
                            alt="Preview"
                            className={cn(
                                "w-full h-48 object-cover transition-opacity",
                                isUploading ? "opacity-50" : "opacity-100"
                            )}
                        />

                        {isUploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}

                        {!disabled && !isUploading && (
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