'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseEditorOptions<T extends z.ZodSchema> {
    schema: T;
    defaultValues: any;
    entity?: any | null;
    onCreate: (data: any) => void;
    onUpdate: (data: { id: number; data: any }) => void;
    onUploadFile?: (file: File, folder: string) => Promise<{ path: string }>;
    uploadFolder?: string;
    successPath: string;
    isEdit: boolean;
}

export function useEditor<T extends z.ZodSchema>({
    schema,
    defaultValues,
    entity,
    onCreate,
    onUpdate,
    onUploadFile,
    uploadFolder = 'uploads',
    successPath,
    isEdit,
}: UseEditorOptions<T>) {
    const navigate = useNavigate();
    
    const [isUploading, setIsUploading] = useState(false);
    const [pendingError, setPendingError] = useState<any>(null);

    const form = useForm<z.infer<T>>({
        resolver: zodResolver(schema),
        defaultValues,
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

        const dataToSubmit = { ...values, image_path: imagePath };
        delete dataToSubmit.version; // version не отправляем в API

        if (isEdit && entity) {
            onUpdate({
                id: entity.id,
                data: {
                    ...dataToSubmit,
                    version: values.version,
                },
            });
        } else {
            onCreate(dataToSubmit);
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
