'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';

interface FileUploadProps {
    value?: string;
    onChange: (value: string) => void;
    error?: boolean;
    disabled?: boolean;
}

export const FileUpload = ({ value, onChange, error, disabled }: FileUploadProps) => {
    const [preview, setPreview] = useState<string | undefined>(value);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0 || disabled) return;

        const file = acceptedFiles[0];
        
        // Проверка типа файла
        if (!file.type.startsWith('image/')) {
            alert('Пожалуйста, загрузите изображение');
            return;
        }

        // Проверка размера (макс 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Размер файла не должен превышать 5MB');
            return;
        }

        setIsUploading(true);

        // Создаем URL для предпросмотра
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Имитация загрузки на сервер
        // В реальном проекте здесь будет отправка файла на сервер
        setTimeout(() => {
            // Для демонстрации используем base64 или путь
            // В реальности здесь будет ответ сервера с путем к файлу
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                onChange(base64String);
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        }, 500);
    }, [onChange, disabled]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024,
        disabled: disabled || isUploading
    });

    const handleRemove = () => {
        if (preview && preview.startsWith('blob:')) {
            URL.revokeObjectURL(preview);
        }
        setPreview(undefined);
        onChange('');
    };

    return (
        <div className="space-y-2">
            {!preview ? (
                <div
                    {...getRootProps()}
                    className={cn(
                        "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
                        isDragActive
                            ? "border-[var(--red)] bg-red-50 dark:bg-red-900/10"
                            : error
                                ? "border-red-500 hover:border-red-400"
                                : "border-border hover:border-[var(--red)]",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <input {...getInputProps()} />
                    
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-[var(--red)] border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-muted-foreground font-medium">Загрузка...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center",
                                isDragActive
                                    ? "bg-red-100 dark:bg-red-900/30"
                                    : "bg-muted"
                            )}>
                                <Upload className={cn(
                                    "w-6 h-6",
                                    isDragActive
                                        ? "text-[var(--red)]"
                                        : "text-muted-foreground"
                                )} />
                            </div>
                            
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-foreground">
                                    {isDragActive
                                        ? "Отпустите файл здесь"
                                        : "Перетащите изображение сюда"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    или нажмите для выбора файла
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>PNG, JPG, GIF, WEBP</span>
                                <span>•</span>
                                <span>до 5MB</span>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="relative group">
                    <div className="relative rounded-xl overflow-hidden border border-border">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                        />
                        
                        {!disabled && (
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleRemove}
                                    className="bg-red-500 hover:bg-red-600"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Удалить
                                </Button>
                            </div>
                        )}
                        
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <p className="text-white text-sm font-medium">Загрузка...</p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <ImageIcon className="w-3 h-3" />
                        <span>Изображение загружено</span>
                    </div>
                </div>
            )}
            
            {error && (
                <p className="text-red-500 text-[10px] font-bold uppercase ml-1">
                    Изображение обязательно
                </p>
            )}
        </div>
    );
};
