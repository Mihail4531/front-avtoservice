'use client';

import { Controller, type UseFormReturn } from 'react-hook-form';
import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/shared/lib/cn';
import { previewSlug } from '@/entities/article/api/api';
import { RichTextEditor } from './RichTextEditor';
import type { CategoryEditorSchema } from '../model/use-category-editor';

interface Props {
    form: UseFormReturn<CategoryEditorSchema>;
    disabled?: boolean;
    initialSlug?: string;
}

const MAX_TITLE = 150;

export const EditorMain = ({ form, disabled, initialSlug }: Props) => {
    const {
        register,
        watch,
        control,
        formState: { errors },
    } = form;

    const title = watch('title');

    const [slugPreview, setSlugPreview] = useState(initialSlug ?? '');
    const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);

    // ✅ стабилизируем render editor (важно для Controller + Tiptap)
    const renderDescription = useCallback(
        ({ field }: any) => (
            <RichTextEditor
                content={field.value || ''}
                onChange={field.onChange}
                disabled={disabled}
                error={!!errors.description}
            />
        ),
        [disabled, errors.description],
    );

    // slug generator
    useEffect(() => {
        if (!title || title.length < 3) {
            setSlugPreview('');
            return;
        }

        setIsGeneratingSlug(true);

        const timeoutId = setTimeout(async () => {
            try {
                const response = await previewSlug(title);
                setSlugPreview(response.slug);
            } catch (err) {
                console.error('Ошибка генерации:', err);
            } finally {
                setIsGeneratingSlug(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [title]);

    return (
        <div className="bg-card border border-border rounded-xl p-6 space-y-8">

            {/* TITLE */}
            <Field
                label="Название категории"
                required
                count={`${(title || '').length} / ${MAX_TITLE}`}
                error={errors.title?.message}
            >
                <input
                    {...register('title')}
                    placeholder="Например: Техническое обслуживание"
                    maxLength={MAX_TITLE}
                    disabled={disabled}
                    className={cn(
                        'w-full px-4 py-3 text-lg font-semibold bg-card border rounded-xl outline-none transition-colors',
                        errors.title
                            ? 'border-red-500'
                            : 'border-border focus:border-[var(--red)]',
                    )}
                />

                {(slugPreview || isGeneratingSlug) && (
                    <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-muted/30 border border-border rounded-lg">
                        <div
                            className={cn(
                                'w-2 h-2 rounded-full shrink-0',
                                isGeneratingSlug
                                    ? 'bg-yellow-500 animate-pulse'
                                    : 'bg-green-500',
                            )}
                        />

                        <span className="text-xs text-muted-foreground font-mono">
                            /categories/
                        </span>

                        <span className="text-xs font-mono font-semibold truncate text-green-600 dark:text-green-400">
                            {isGeneratingSlug ? 'генерация...' : slugPreview}
                        </span>
                    </div>
                )}
            </Field>

            {/* DESCRIPTION */}
            <Field
                label="Описание категории"
                required
                error={errors.description?.message}
                hint="Введите подробное описание категории с форматированием."
            >
                <Controller
                    name="description"
                    control={control}
                    render={renderDescription}
                />
            </Field>
        </div>
    );
};

function Field({ label, required, count, hint, error, children }: any) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-foreground">
                    {label}{' '}
                    {required && <span className="text-[var(--red)]">*</span>}
                </label>

                {count && (
                    <span className="text-xs text-muted-foreground font-medium">
                        {count}
                    </span>
                )}
            </div>

            {children}

            {error && (
                <p className="text-xs text-red-500 font-medium">{error}</p>
            )}

            {hint && !error && (
                <p className="text-xs text-muted-foreground">{hint}</p>
            )}
        </div>
    );
}