'use client';

import { Controller, type UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Edit3, Lock } from 'lucide-react'; // Добавил иконку замка для наглядности
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/cn';
import { FileUpload } from '@/shared/ui/file-upload';
import type { CategoryEditorSchema } from '../model/use-category-editor';

interface Props {
    form: UseFormReturn<CategoryEditorSchema>;
    isEdit: boolean;
    isPending: boolean;
    error: any;
    onSubmit: () => void;
}

export const EditorSidebar = ({
    form,
    isEdit,
    isPending,
    error,
    onSubmit,
}: Props) => {
    const navigate = useNavigate();
    const { control, watch, formState: { errors } } = form;

    const isActive = watch('is_active');

    return (
        <div className="space-y-4">
            {/* Блок: Публикация */}
            <Card title="Публикация">
                <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                        <p className="text-sm font-bold text-foreground">
                            {isActive ? 'Опубликовано' : 'Черновик'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {isActive ? 'Видна посетителям' : 'Не видна посетителям'}
                        </p>
                    </div>

                    {/* Тогл показываем ТОЛЬКО при редактировании */}
                    {isEdit ? (
                        <Controller
                            name="is_active"
                            control={control}
                            render={({ field }) => (
                                <Toggle
                                    checked={field.value}
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
                            ? 'Сохранить изменения'
                            : 'Создать категорию'}
                </Button>

                <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard/admin/categories/articles')}
                    disabled={isPending}
                    className="w-full"
                >
                    × Отмена
                </Button>

                {error && (
                    <div className="mt-3 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-600 font-medium">
                            {error?.response?.data?.message || 'Ошибка сохранения'}
                        </p>
                    </div>
                )}
            </Card>

            {/* Блок: Обложка */}
            <Card title="Обложка категории" required error={errors.image_path?.message as string}>
                <Controller
                    name="image_path"
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
            </Card>
        </div>
    );
};

// Вспомогательные компоненты без изменений
function Card({ title, required, error, children }: any) {
    return (
        <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                {title} {required && <span className="text-[var(--red)]">*</span>}
            </div>
            {children}
            {error && <p className="text-xs text-red-500 font-medium mt-2">{error}</p>}
        </div>
    );
}

function Toggle({ checked, onChange, disabled }: any) {
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