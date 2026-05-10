'use client';

import { Controller, type UseFormReturn } from 'react-hook-form';
import { useEffect, useState, useCallback, useMemo } from 'react';

import { RichTextEditor } from './RichTextEditor';
import { previewSlug } from '@/entities/article/api/api';
import { cn } from '@/shared/lib/cn';
import type { ArticleEditorSchema } from '../model/use-article-editor';

interface Props {
    form: UseFormReturn<ArticleEditorSchema>;
    disabled?: boolean;
    initialSlug?: string;
}

const MAX_TITLE = 150;
const MAX_DESCRIPTION = 500;

export const EditorMain = ({ form, disabled, initialSlug }: Props) => {
    const {
        register,
        watch,
        control,
        formState: { errors },
    } = form;

    const title = watch('title');
    const description = watch('description');
    const content = watch('content');

    const [slugPreview, setSlugPreview] = useState(initialSlug ?? '');
    const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);

    // ✅ стабилизированный renderer (ВАЖНО для Tiptap + RHF)
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

    // slug logic (fixed)
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
                label="Заголовок"
                required
                count={`${(title || '').length} / ${MAX_TITLE}`}
                error={errors.title?.message}
            >
                <input
                    {...register('title')}
                    placeholder="Например: Замена ремня ГРМ на VW Polo"
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
                            /articles/
                        </span>
                        <span className="text-xs font-mono font-semibold truncate text-green-600 dark:text-green-400">
                            {isGeneratingSlug ? 'генерация...' : slugPreview}
                        </span>
                    </div>
                )}
            </Field>

            {/* DESCRIPTION */}
            <Field
                label="Краткое описание"
                required
                count={`${(description || '').length} / ${MAX_DESCRIPTION}`}
                hint="Используется как мета-описание для SEO"
                error={errors.description?.message}
            >
                <textarea
                    {...register('description')}
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

            {/* CONTENT */}
            <Field
                label="Содержание"
                required
                count={`${contentLength} симв.`}
                error={errors.content?.message}
            >
                <Controller
                    name="content"
                    control={control}
                    render={renderContent}
                />
            </Field>
        </div>
    );
};

/* ---------------- FIELD ---------------- */

function Field({
    label,
    required,
    count,
    hint,
    error,
    children,
}: {
    label: string;
    required?: boolean;
    count?: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}) {
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