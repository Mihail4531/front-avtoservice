'use client';

import { Controller, type UseFormReturn } from 'react-hook-form';
import { cn } from '@/shared/lib/cn';
import { FileUpload } from '@/shared/ui/file-upload';
import type { CategoryEditorSchema } from '../model/use-category-editor';

interface Props {
    form: UseFormReturn<CategoryEditorSchema>;
    disabled?: boolean;
}

const MAX_TITLE = 150;
const MAX_DESCRIPTION = 500;

export const EditorMain = ({ form, disabled }: Props) => {
    const { register, watch, formState: { errors } } = form;

    const title = watch('title');
    const description = watch('description');

    return (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <Field label="Название категории" required count={`${(title || '').length} / ${MAX_TITLE}`} error={errors.title?.message}>
                <input
                    {...register('title')}
                    placeholder="Например: Техническое обслуживание"
                    maxLength={MAX_TITLE}
                    disabled={disabled}
                    className={cn(
                        'w-full px-4 py-3 text-lg font-semibold bg-card border rounded-xl outline-none transition-colors',
                        errors.title ? 'border-red-500' : 'border-border focus:border-[var(--red)]'
                    )}
                />
            </Field>

            <Field
                label="Описание"
                required
                count={`${(description || '').length} / ${MAX_DESCRIPTION}`}
                hint="Краткое описание категории для отображения в списке."
                error={errors.description?.message}
            >
                <textarea
                    {...register('description')}
                    placeholder="Краткое описание категории..."
                    rows={4}
                    maxLength={MAX_DESCRIPTION}
                    disabled={disabled}
                    className={cn(
                        'w-full px-4 py-3 text-sm bg-card border rounded-xl outline-none transition-colors resize-none',
                        errors.description ? 'border-red-500' : 'border-border focus:border-[var(--red)]'
                    )}
                />
            </Field>

            <Field label="Изображение категории" required error={errors.image_path?.message as string}>
                <Controller
                    name="image_path"
                    control={form.control}
                    render={({ field }) => (
                        <FileUpload
                            value={field.value}
                            onChange={field.onChange}
                            error={!!errors.image_path}
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
