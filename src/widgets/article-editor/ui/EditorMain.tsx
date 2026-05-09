'use client';

import { Controller, type UseFormReturn } from 'react-hook-form';
import { RichTextEditor } from './RichTextEditor';
import { cn } from '@/shared/lib/cn';
import type { ArticleEditorSchema } from '../model/use-article-editor';

interface Props {
    form: UseFormReturn<ArticleEditorSchema>;
    disabled?: boolean;
}

const MAX_TITLE = 150;
const MAX_DESCRIPTION = 500;

export const EditorMain = ({ form, disabled }: Props) => {
    const { register, watch, control, formState: { errors } } = form;

    const title = watch('title');
    const description = watch('description');
    const content = watch('content');

    return (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <Field label="Заголовок" required count={`${(title || '').length} / ${MAX_TITLE}`} error={errors.title?.message}>
                <input
                    {...register('title')}
                    placeholder="Например: Замена ремня ГРМ на VW Polo"
                    maxLength={MAX_TITLE}
                    disabled={disabled}
                    className={cn(
                        'w-full px-4 py-3 text-lg font-semibold bg-card border rounded-xl outline-none transition-colors',
                        errors.title ? 'border-red-500' : 'border-border focus:border-[var(--red)]'
                    )}
                />
            </Field>

            <Field
                label="Краткое описание"
                required
                count={`${(description || '').length} / ${MAX_DESCRIPTION}`}
                hint="Используется как мета-описание для SEO и превью в социальных сетях."
                error={errors.description?.message}
            >
                <textarea
                    {...register('description')}
                    placeholder="Короткий анонс — 1–2 предложения, отображается в карточках на сайте и в выдаче поиска."
                    rows={3}
                    maxLength={MAX_DESCRIPTION}
                    disabled={disabled}
                    className={cn(
                        'w-full px-4 py-3 text-sm bg-card border rounded-xl outline-none transition-colors resize-none',
                        errors.description ? 'border-red-500' : 'border-border focus:border-[var(--red)]'
                    )}
                />
            </Field>

            <Field label="Содержание" required count={`${countSymbols(content)} симв.`} error={errors.content?.message}>
                <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                        <RichTextEditor
                            value={field.value || ''}
                            onChange={field.onChange}
                            placeholder="Когда нужно менять ремень ГРМ..."
                            error={!!errors.content}
                            disabled={disabled}
                        />
                    )}
                />
            </Field>
        </div>
    );
};

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
                    {label} {required && <span className="text-[var(--red)]">*</span>}
                </label>
                {count && <span className="text-xs text-muted-foreground font-medium">{count}</span>}
            </div>
            {children}
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
            {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}

function countSymbols(html: string | undefined): number {
    if (!html) return 0;
    const div = document.createElement('div');
    div.innerHTML = html;
    return (div.textContent || '').length;
}