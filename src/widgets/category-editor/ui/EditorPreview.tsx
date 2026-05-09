'use client';

import { type UseFormReturn } from 'react-hook-form';
import type { CategoryEditorSchema } from '../model/use-category-editor';

interface Props {
    form: UseFormReturn<CategoryEditorSchema>;
}

export const EditorPreview = ({ form }: Props) => {
    const title = form.watch('title');
    const description = form.watch('description');
    const image_path = form.watch('image_path');
    const is_active = form.watch('is_active');

    // Преобразуем File в URL для предпросмотра
    const imageUrl = typeof image_path === 'string' && image_path
        ? `https://autoleader.by/uploads/${image_path}`
        : image_path instanceof File
            ? URL.createObjectURL(image_path)
            : '';

    return (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Предпросмотр категории</h2>

            {/* Карточка превью */}
            <div className="border border-border rounded-xl overflow-hidden">
                {/* Изображение */}
                {imageUrl ? (
                    <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                        <img
                            src={imageUrl}
                            alt={title || 'Превью'}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">Нет изображения</span>
                    </div>
                )}

                {/* Контент */}
                <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border",
                            is_active
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                                : "bg-muted text-muted-foreground border-border"
                        )}>
                            {is_active ? 'Активна' : 'Неактивна'}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground">
                        {title || 'Название категории'}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {description || 'Описание категории...'}
                    </p>
                </div>
            </div>

            {/* Подсказка */}
            <div className="bg-muted/50 border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground font-medium">
                    <strong>Обратите внимание:</strong> Это предварительный просмотр. 
                    Фактическое отображение может незначительно отличаться в зависимости от темы и устройства.
                </p>
            </div>
        </div>
    );
};

function cn(...classes: (string | boolean | undefined | null)[]) {
    return classes.filter(Boolean).join(' ');
}
