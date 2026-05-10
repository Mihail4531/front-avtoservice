'use client';

import { Controller, type UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Edit3, Lock } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/cn';
import { FileUpload } from '@/shared/ui/file-upload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

interface SidebarCardProps {
    title: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}

interface EditorSidebarProps<T extends { is_active?: boolean; image_path: string | File }> {
    form: UseFormReturn<T>;
    isEdit: boolean;
    isPending: boolean;
    error: any;
    onSubmit: () => void;
    showCategorySelect?: boolean;
    categories?: Array<{ id: number; title: string }>;
    onCategoryChange?: (id: number) => void;
    labels: {
        publishStatusActive: string;
        publishStatusInactive: string;
        publishStatusActiveDesc: string;
        publishStatusInactiveDesc: string;
        submitButtonCreate: string;
        submitButtonEdit: string;
        submitButtonDraft?: string;
        cancelButtonText: string;
        cancelPath: string;
        categoryTitle?: string;
        categoryPlaceholder?: string;
        coverTitle: string;
    };
}

export const EditorSidebar = <T extends { is_active?: boolean; image_path: string | File }>({
    form,
    isEdit,
    isPending,
    error,
    onSubmit,
    showCategorySelect = false,
    categories,
    onCategoryChange,
    labels,
}: EditorSidebarProps<T>) => {
    const navigate = useNavigate();
    const { control, watch, formState: { errors } } = form;

    const isActive = watch('is_active');

    return (
        <div className="space-y-4">
            {/* Публикация */}
            <SidebarCard title={labels.publishStatusActive || 'Публикация'}>
                <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                        <p className="text-sm font-bold text-foreground">
                            {isActive ? labels.publishStatusActive : labels.publishStatusInactive}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {isActive ? labels.publishStatusActiveDesc : labels.publishStatusInactiveDesc}
                        </p>
                    </div>

                    {isEdit ? (
                        <Controller
                            name="is_active" as keyof T
                            control={control}
                            render={({ field }) => (
                                <Toggle
                                    checked={field.value as boolean}
                                    onChange={field.onChange}
                                    disabled={isPending}
                                />
                            )}
                        />
                    ) : (
                        <div title="Доступно после создания" className="p-2 bg-muted rounded-full">
                            <Lock className="w-4 h-4 text-muted-foreground" />
                        </div>
                    )}
                </div>

                <Button
                    onClick={onSubmit}
                    disabled={isPending}
                    className="w-full bg-[var(--red)] hover:bg-red-700 mb-2"
                >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {isPending
                        ? 'Сохранение...'
                        : isEdit
                            ? labels.submitButtonEdit
                            : (isActive ? labels.submitButtonDraft : labels.submitButtonCreate)}
                </Button>

                <Button
                    variant="outline"
                    onClick={() => navigate(labels.cancelPath)}
                    disabled={isPending}
                    className="w-full"
                >
                    × {labels.cancelButtonText}
                </Button>

                {error && (
                    <div className="mt-3 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-600 font-medium">
                            {error?.response?.data?.message || 'Ошибка сохранения'}
                        </p>
                    </div>
                )}
            </SidebarCard>

            {/* Категория */}
            {showCategorySelect && categories && (
                <SidebarCard 
                    title={labels.categoryTitle || 'Категория'} 
                    required 
                    error={(errors.category_id as any)?.message}
                >
                    <Controller
                        name="category_id" as keyof T
                        control={control}
                        render={({ field }) => (
                            <Select
                                onValueChange={(val) => {
                                    const numId = Number(val);
                                    field.onChange(numId);
                                    onCategoryChange?.(numId);
                                }}
                                value={field.value ? String(field.value) : ''}
                            >
                                <SelectTrigger className={cn('w-full', errors.category_id && 'border-red-500')}>
                                    <SelectValue placeholder={labels.categoryPlaceholder || '— выберите —'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                            {cat.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </SidebarCard>
            )}

            {/* Обложка */}
            <SidebarCard title={labels.coverTitle} required error={(errors.image_path as any)?.message}>
                <Controller
                    name="image_path" as keyof T
                    control={control}
                    render={({ field }) => (
                        <FileUpload
                            value={field.value}
                            onChange={field.onChange}
                            error={!!errors.image_path}
                            disabled={isPending}
                        />
                    )}
                />
            </SidebarCard>
        </div>
    );
};

export const SidebarCard = ({
    title,
    required,
    error,
    children,
}: SidebarCardProps) => {
    return (
        <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                {title} {required && <span className="text-[var(--red)]">*</span>}
            </div>
            {children}
            {error && <p className="text-xs text-red-500 font-medium mt-2">{error}</p>}
        </div>
    );
};

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
    return (
        <button
            type="button"
            onClick={() => !disabled && onChange(!checked)}
            className={cn(
                'relative w-11 h-6 rounded-full transition-all duration-200',
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                checked ? 'bg-[var(--red)]' : 'bg-gray-300 dark:bg-gray-600'
            )}
        >
            <div
                className={cn(
                    'absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 shadow-sm',
                    checked ? 'left-[22px]' : 'left-0.5'
                )}
            />
        </button>
    );
}
