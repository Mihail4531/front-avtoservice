'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseEditorOptions<T extends z.ZodSchema, TEntity extends { id: number; version: number }> {
    schema: T;
    defaultValues: z.infer<T>;
    entity?: TEntity | null;
    onCreate: (data: Omit<z.infer<T>, 'version'>) => void;
    onUpdate: (params: { id: number; data: z.infer<T> }) => void;
    onUploadFile?: (file: File, folder: string) => Promise<{ path: string }>;
    uploadFolder?: string;
    successPath: string;
    isEdit: boolean;
}

export function useEditor<T extends z.ZodSchema, TEntity extends { id: number; version: number }>({
    schema,
    defaultValues,
    entity,
    onCreate,
    onUpdate,
    onUploadFile,
    uploadFolder = 'uploads',
    successPath,
    isEdit,
}: UseEditorOptions<T, TEntity>) {
    const navigate = useNavigate();
    
    const [isUploading, setIsUploading] = useState(false);
    const [pendingError, setPendingError] = useState<Error | null>(null);

    const form = useForm<z.infer<T>>({
        resolver: zodResolver(schema),
        defaultValues,
        mode: 'onChange', // Валидация при изменении полей
    });

    // Синхронизация формы при загрузке данных
    useEffect(() => {
        if (entity) {
            form.reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entity]);

    const submit = async (values: z.infer<T>) => {
        let imagePath: string | undefined;

        // Загружаем картинку если File
        if (values.image_path instanceof File) {
            if (!onUploadFile) {
                console.error('onUploadFile не предоставлен');
                return;
            }
            
            setIsUploading(true);
            try {
                const response = await onUploadFile(values.image_path, uploadFolder);
                imagePath = response.path;
            } catch (err) {
                console.error('Ошибка загрузки картинки:', err);
                setIsUploading(false);
                return;
            }
            setIsUploading(false);
        } else {
            imagePath = values.image_path as string;
        }

        // Формируем данные для отправки
        const dataToSubmit = { ...values, image_path: imagePath };
        
        if (isEdit && entity) {
            // При обновлении отправляем version (он нужен для оптимистичной блокировки)
            onUpdate({
                id: entity.id,
                data: dataToSubmit as z.infer<T>,
            });
        } else {
            // При создании НЕ отправляем version (бэкенд сам установит 1)
            const { version, ...createData } = dataToSubmit as z.infer<T> & { version?: number };
            onCreate(createData as Omit<z.infer<T>, 'version'>);
        }
    };

    const onSubmit = form.handleSubmit((values) => {
        submit(values);
    });

    return {
        form,
        isEdit,
        isPending: isUploading,
        error: pendingError,
        onSubmit,
        navigate,
    };
}

/**
 * Утилита для извлечения относительного пути из URL
 */
export function extractRelativePath(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('http')) {
        const match = url.match(/\/uploads\/(.+)$/);
        return match ? match[1] : '';
    }
    return url;
}
