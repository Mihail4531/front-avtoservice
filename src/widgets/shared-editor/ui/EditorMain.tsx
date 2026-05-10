'use client';

import { Controller, type UseFormReturn } from 'react-hook-form';
import { useEffect, useState, useCallback, useMemo } from 'react';

import { RichTextEditor } from './RichTextEditor';
import { previewSlug } from '@/entities/article/api/api';
import { cn } from '@/shared/lib/cn';

interface FieldProps {
    label: string;
    required?: boolean;
    count?: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}

interface EditorMainProps<T extends { title: string; description?: string; content?: string }> {
    form: UseFormReturn<T>;
    disabled?: boolean;
    initialSlug?: string;
    showContent?: boolean;
    showDescriptionRichText?: boolean;
    labels: {
        title: string;
        titlePlaceholder: string;
        description?: string;
        descriptionHint?: string;
        content?: string;
        slugPrefix: string;
    };
}

const MAX_TITLE = 150;
const MAX_DESCRIPTION = 500;

export const EditorMain = <T extends { title: string; description?: string; content?: string }>({
    form,
    disabled,
    initialSlug,
    showContent = true,
    showDescriptionRichText = false,
    labels,
}: EditorMainProps<T>) => {
    const {
        register,
        watch,
        control,
        formState: { errors },
    } = form;

    const title = watch('title');
    const description = watch('description' as keyof T) as string | undefined;
    const content = watch('content' as keyof T) as string | undefined;

    const [slugPreview, setSlugPreview] = useState(initialSlug ?? '');
    const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);

    const renderContent = useCallback(
        ({ field }: any) => (
            <RichTextEditor
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Когда нужно менять ремень ГРМ..."
                error={!!errors.content}
                disabled={disabled}
            />
        ),
        [disabled, errors.content],
    );

    const renderDescriptionRichText = useCallback(
        ({ field }: any) => (
            <RichTextEditor
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Описание категории..."
                error={!!errors.description}
                disabled={disabled}
                minHeight="300px"
            />
        ),
        [disabled, errors.description],
    );

    useEffect(() => {
        if (!title || title.length < 3) {
            setSlugPreview(initialSlug ?? '');
            return;
        }

        setIsGeneratingSlug(true);

        const timeoutId = setTimeout(async () => {
            try {
                const response = await previewSlug(title);
                setSlugPreview(response.slug);
            } catch (err) {
                console.error('Ошибка генерации slug:', err);
                setSlugPreview('');
            } finally {
                setIsGeneratingSlug(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [title, initialSlug]);

    const contentLength = useMemo(() => {
        if (!content) return 0;
        const div = document.createElement('div');
        div.innerHTML = content;
        return (div.textContent || '').length;
    }, [content]);

    return (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            {/* TITLE */}
            <Field
                label={labels.title}
                required
                count={`${(title || '').length} / ${MAX_TITLE}`}
                error={(errors.title as any)?.message}
            >
                <input
                    {...register('title' as keyof T)}
                    placeholder={labels.titlePlaceholder}
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
                        <span className="text-xs text-muted-foreground font-mono shrink-0">
                            {labels.slugPrefix}
                        </span>
                        <span className="text-xs font-mono font-semibold truncate text-green-600 dark:text-green-400">
                            {isGeneratingSlug ? 'генерация...' : slugPreview}
                        </span>
                    </div>
                )}
            </Field>

            {/* DESCRIPTION */}
            {showDescriptionRichText ? (
                <Field
                    label={labels.description || 'Описание'}
                    required
                    error={(errors.description as any)?.message}
                    hint={labels.descriptionHint}
                >
                    <Controller
                        name="description" as keyof T
                        control={control}
                        render={renderDescriptionRichText}
                    />
                </Field>
            ) : (
                description !== undefined && (
                    <Field
                        label={labels.description || 'Краткое описание'}
                        required
                        count={`${(description || '').length} / ${MAX_DESCRIPTION}`}
                        hint={labels.descriptionHint}
                        error={(errors.description as any)?.message}
                    >
                        <textarea
                            {...register('description' as keyof T)}
                            rows={3}
                            maxLength={MAX_DESCRIPTION}
                            disabled={disabled}
                            className={cn(
                                'w-full px-4 py-3 text-sm bg-card border rounded-xl outline-none resize-none transition-colors',
                                errors.description
                                    ? 'border-red-500'
                                    : 'border-border focus:border-[var(--red)]',
                            )}
                        />
                    </Field>
                )
            )}

            {/* CONTENT */}
            {showContent && (
                <Field
                    label={labels.content || 'Содержание'}
                    required
                    count={`${contentLength} симв.`}
                    error={(errors.content as any)?.message}
                >
                    <Controller
                        name="content" as keyof T
                        control={control}
                        render={renderContent}
                    />
                </Field>
            )}
        </div>
    );
};

/* ---------------- FIELD ---------------- */

export const Field = ({
    label,
    required,
    count,
    hint,
    error,
    children,
}: FieldProps) => {
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
};
