'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Eye } from 'lucide-react';
import { useArticleById } from '@/entities/article/hooks/use-get-by-id';
import { useArticleEditor } from '../model/use-article-editor';
import { cn } from '@/shared/lib/cn';
import { EditorMain, EditorSidebar, EditorPreview } from '@/widgets/shared-editor/ui';

interface Props {
    articleId?: number;
}

type Tab = 'editor' | 'preview';

export const ArticleEditor = ({ articleId }: Props) => {
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>('editor');
    const isEdit = articleId !== undefined;

    const { data: article, isLoading } = useArticleById(articleId ?? null);
    const { form, isPending, error, onSubmit, categories } = useArticleEditor(article);

    if (isEdit && isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--red)]" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
                <div className="flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard/admin/articles')}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-card border border-border rounded-lg hover:border-ring transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            К списку
                        </button>
                    
                    </div>

                    <div className="flex bg-muted/50 p-1 rounded-lg border border-border">
                        <ModeIndicator active={!isEdit}>Создание</ModeIndicator>
                        <ModeIndicator active={isEdit}>Редактирование</ModeIndicator>
                    </div>
                </div>

                <div className="flex items-center gap-1 px-6 -mb-px">
                    <TabButton active={tab === 'editor'} onClick={() => setTab('editor')}>
                        <Edit3 className="w-4 h-4" />
                        Редактор
                    </TabButton>
                    <TabButton active={tab === 'preview'} onClick={() => setTab('preview')}>
                        <Eye className="w-4 h-4" />
                        Предпросмотр
                    </TabButton>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 p-6">
                <div>
                    {tab === 'editor' ? (
                        <EditorMain
                            form={form}
                            disabled={isPending}
                            initialSlug={article?.slug}
                            showContent={true}
                            showDescriptionRichText={false}
                            labels={{
                                title: 'Заголовок',
                                titlePlaceholder: 'Например: Замена ремня ГРМ на VW Polo',
                                description: 'Краткое описание',
                                descriptionHint: 'Используется как мета-описание для SEO',
                                content: 'Содержание',
                                slugPrefix: '/articles/',
                            }}
                        />
                    ) : (
                        <EditorPreview
                            form={form}
                            showContent={true}
                            labels={{
                                titlePlaceholder: 'Заголовок статьи',
                                contentPlaceholder: 'Содержание статьи появится здесь...',
                            }}
                        />
                    )}
                </div>

                <EditorSidebar
                    form={form}
                    isEdit={isEdit}
                    isPending={isPending}
                    error={error}
                    onSubmit={onSubmit}
                    showCategorySelect={true}
                    categories={categories}
                    labels={{
                        publishStatusActive: 'Опубликовано',
                        publishStatusInactive: 'Черновик',
                        publishStatusActiveDesc: 'Видна посетителям',
                        publishStatusInactiveDesc: 'Не видна посетителям',
                        submitButtonCreate: 'Создать черновик',
                        submitButtonEdit: 'Сохранить',
                        submitButtonDraft: 'Опубликовать',
                        cancelButtonText: 'Отмена',
                        cancelPath: '/dashboard/admin/articles',
                        categoryTitle: 'Категория',
                        categoryPlaceholder: '— выберите —',
                        coverTitle: 'Обложка',
                    }}
                />
            </div>
        </div>
    );
};

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
                active
                    ? 'border-[var(--red)] text-[var(--red)]'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
        >
            {children}
        </button>
    );
}

function ModeIndicator({ active, children }: { active: boolean; children: React.ReactNode }) {
    return (
        <div
            className={cn(
                'px-3 py-1 text-xs font-bold rounded-md transition-colors',
                active ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            )}
        >
            {children}
        </div>
    );
}