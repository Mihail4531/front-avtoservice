import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Edit, Archive, Copy, Trash2, History, Calendar, Link as LinkIcon, Clock, Check, Folder, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useArticleById } from '@/entities/article/hooks/use-get-by-id';
import { cn } from '@/shared/lib/cn';
import { useState } from 'react';

export default function ArticleViewPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [heroVariant, setHeroVariant] = useState<'tall' | 'standard' | 'compact'>('standard');
    const [showSide, setShowSide] = useState(true);

    const { data: article, isLoading } = useArticleById(id ? Number(id) : null);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--red)]" />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Статья не найдена</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/dashboard/admin/articles')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    К списку статей
                </Button>
            </div>
        );
    }

    const status = article.is_active
        ? { dot: 'var(--green)', label: 'Опубликовано', desc: 'Статья видна на сайте' }
        : { dot: 'var(--text-muted)', label: 'Черновик', desc: 'Не опубликована' };

    const formatDate = (iso: string) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatDateTime = (iso: string) => {
        if (!iso) return '—';
        const d = new Date(iso);
        return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    };

    const handleCopyUrl = () => {
        const url = `/blog/${article.category.slug}/${article.slug}`;
        navigator.clipboard.writeText(url);
    };

    return (
        <main className="p-6">
            {/* Back + actions row */}
            <div className="flex items-center gap-3 mb-4">
                <Button variant="outline" onClick={() => navigate('/dashboard/admin/articles')}>
                    <ArrowLeft className="w-4 h-4" />
                    К списку
                </Button>
                <h1 className="font-bold text-[19px] truncate text-foreground">
                    Просмотр статьи
                </h1>
            </div>

            {/* Status Bar */}
            <div className="card flex items-center gap-4 px-5 py-3.5 bg-card rounded-xl border border-border shadow-sm">
                <div className="flex items-center gap-2.5">
                    <span className="relative flex w-2.5 h-2.5">
                        <span className="absolute inset-0 rounded-full animate-ping opacity-60" style={{ background: status.dot }}></span>
                        <span className="absolute inset-0 rounded-full" style={{ background: status.dot }}></span>
                    </span>
                    <div>
                        <div className="text-[13px] font-semibold">{status.label}</div>
                        <div className="text-[11px] text-muted-foreground">{status.desc}</div>
                    </div>
                </div>
                <div className="h-7 w-px bg-border"></div>
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                    <History className="w-3.5 h-3.5" />
                    <span>Версия <span className="font-semibold text-foreground">v{article.version}</span></span>
                </div>
                <div className="h-7 w-px bg-border"></div>
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Опубликовано <span className="font-semibold text-foreground">{formatDate(article.published_at || article.created_at)}</span></span>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                    <Button variant="ghost" size="sm">
                        <Copy className="w-3.5 h-3.5" />
                        Дублировать
                    </Button>
                    <Button variant="outline" size="sm">
                        <Archive className="w-3.5 h-3.5" />
                        {article.is_active ? 'Снять с публикации' : 'Опубликовать'}
                    </Button>
                    <Button variant="default" size="sm" onClick={() => navigate(`/dashboard/admin/articles/${article.id}/edit`)}>
                        <Edit className="w-3.5 h-3.5" />
                        Редактировать
                    </Button>
                </div>
            </div>

            <div className={`mt-5 grid gap-5 ${showSide ? 'grid-cols-[1fr_320px]' : 'grid-cols-1'}`}>
                <div className="flex flex-col gap-5 min-w-0">
                    {/* Hero */}
                    <div className="card overflow-hidden bg-card rounded-xl border border-border shadow-sm">
                        {heroVariant !== 'compact' && (
                            <div className={cn(
                                "img-placeholder relative",
                                heroVariant === 'tall' ? 'h-[340px]' : 'h-[220px]',
                                !article.image_url ? 'bg-gradient-br' : ''
                            )}>
                                {article.image_url ? (
                                    <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 pattern-grid opacity-40"></div>
                                )}
                                <div className="absolute inset-0 flex items-end p-6">
                                    <div className="flex items-center gap-2 text-white/90 text-[12px]">
                                        <ImageIcon className="w-3.5 h-3.5" />
                                        <span>{article.image_url ? article.image_url.split('/').pop() : 'hero-image.jpg'}</span>
                                    </div>
                                </div>
                                <div className="absolute top-4 left-4 flex gap-1.5">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/92 text-red-600">
                                        <Folder className="w-2.5 h-2.5" />
                                        {article.category?.title || 'Без категории'}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/35 text-white">
                                        <Clock className="w-2.5 h-2.5" />
                                        7 мин чтения
                                    </span>
                                </div>
                            </div>
                        )}
                        <div className="px-7 py-6">
                            {heroVariant === 'compact' && (
                                <div className="flex gap-1.5 mb-3">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-600">
                                        <Folder className="w-2.5 h-2.5" />
                                        {article.category?.title || 'Без категории'}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600">
                                        <Clock className="w-2.5 h-2.5" />
                                        7 мин чтения
                                    </span>
                                </div>
                            )}
                            <h1 className="font-extrabold text-[28px] leading-[1.2] tracking-[-0.015em]" style={{ textWrap: 'balance' }}>
                                {article.title}
                            </h1>
                            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                                {article.description}
                            </p>
                            <div className="mt-5 flex items-center gap-3 pt-4 border-t border-border/50">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0 bg-blue-500">
                                    {article.category?.title?.charAt(0) || 'A'}
                                </div>
                                <div className="flex-1">
                                    <div className="text-[13px] font-semibold">Автор</div>
                                    <div className="text-[12px] text-muted-foreground">Администратор</div>
                                </div>
                                <div className="text-right text-[12px] text-muted-foreground">
                                    <div>Создано: <span className="text-foreground">{formatDate(article.created_at)}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="card px-7 py-6 bg-card rounded-xl border border-border shadow-sm">
                        <div className="prose text-foreground text-[15px] leading-7">
                            {article.content ? (
                                <div dangerouslySetInnerHTML={{ __html: article.content }} />
                            ) : (
                                <p className="text-muted-foreground">Содержимое отсутствует</p>
                            )}
                        </div>
                        <div className="mt-8 pt-5 border-t border-border/50 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                                <Check className="w-3.5 h-3.5 text-green-500" />
                                Статья проверена редактором
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Button variant="ghost" size="sm">
                                    <Copy className="w-3.5 h-3.5" />
                                    Скопировать содержимое
                                </Button>
                                <Button variant="outline" size="sm">
                                    Открыть на сайте
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side Meta */}
                {showSide && (
                    <div className="flex flex-col gap-4 sticky top-6">
                        {/* Metadata */}
                        <div className="card p-5 bg-card rounded-xl border border-border shadow-sm">
                            <div className="text-[10px] font-semibold tracking-[0.08em] uppercase mb-2 text-muted-foreground">Метаданные</div>
                            <div>
                                <MetaRow keyText="ID" valEl={<span className="font-mono">#{article.id}</span>} />
                                <MetaRow keyText="Версия" valEl={<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-600">v{article.version}</span>} />
                                <MetaRow keyText="Slug" valEl={<span className="font-mono text-[12px]">{article.slug}</span>} />
                                <MetaRow keyText="Категория" valEl={
                                    <span className="inline-flex items-center gap-1.5 text-red-600 cursor-pointer hover:underline">
                                        {article.category?.title || 'Без категории'}
                                    </span>
                                } />
                                <MetaRow keyText="Статус" valEl={
                                    <span className={cn(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold",
                                        article.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                    )}>
                                        {article.is_active ? 'Активна' : 'Неактивна'}
                                    </span>
                                } />
                                <MetaRow keyText="Опубликовано" valEl={formatDateTime(article.published_at || article.created_at)} />
                                <MetaRow keyText="Создано" valEl={formatDateTime(article.created_at)} />
                            </div>
                        </div>

                        {/* URL */}
                        <div className="card p-5 bg-card rounded-xl border border-border shadow-sm">
                            <div className="text-[10px] font-semibold tracking-[0.08em] uppercase mb-3 text-muted-foreground">Ссылка на сайте</div>
                            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg font-mono text-[12px] bg-muted/50">
                                <LinkIcon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                <span className="truncate flex-1 text-foreground">/blog/{article.category?.slug || 'category'}/{article.slug}</span>
                                <button className="hover:text-red-600 transition flex-shrink-0" title="Скопировать" onClick={handleCopyUrl}>
                                    <Copy className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <Button variant="outline" className="w-full mt-3 justify-center">
                                <Eye className="w-3.5 h-3.5" />
                                Открыть превью
                            </Button>
                        </div>

                        {/* Danger zone */}
                        <div className="card p-5 bg-card rounded-xl border border-red-200 shadow-sm">
                            <div className="text-[10px] font-semibold tracking-[0.08em] uppercase mb-1 text-red-600">Опасная зона</div>
                            <div className="text-[12px] mb-3 text-muted-foreground">Удаление невозможно отменить. Все ревизии статьи будут стёрты.</div>
                            <Button variant="destructive" className="w-full justify-center">
                                <Trash2 className="w-3.5 h-3.5" />
                                Удалить статью
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Tweaks panel */}
            <div className="fixed bottom-[18px] right-[18px] w-[270px] bg-card border border-border rounded-xl shadow-lg z-100 p-4 text-[13px]">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                    <svg className="w-3.5 h-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="4" y1="21" x2="4" y2="14" />
                        <line x1="4" y1="10" x2="4" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12" y2="3" />
                        <line x1="20" y1="21" x2="20" y2="16" />
                        <line x1="20" y1="12" x2="20" y2="3" />
                        <line x1="1" y1="14" x2="7" y2="14" />
                        <line x1="9" y1="8" x2="15" y2="8" />
                        <line x1="17" y1="16" x2="23" y2="16" />
                    </svg>
                    <div className="font-bold text-[13px]">Tweaks</div>
                    <span className="ml-auto text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">Live</span>
                </div>

                <div className="py-2 border-b border-border/50 flex items-center justify-between">
                    <span className="text-muted-foreground">Hero обложка</span>
                    <div className="inline-flex bg-muted/50 p-[2px] rounded-lg gap-[2px]">
                        <button 
                            className={cn("px-2.5 py-1 rounded-md text-[11px] font-bold", heroVariant === 'tall' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground')}
                            onClick={() => setHeroVariant('tall')}
                        >
                            Большая
                        </button>
                        <button 
                            className={cn("px-2.5 py-1 rounded-md text-[11px] font-bold", heroVariant === 'standard' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground')}
                            onClick={() => setHeroVariant('standard')}
                        >
                            Средняя
                        </button>
                        <button 
                            className={cn("px-2.5 py-1 rounded-md text-[11px] font-bold", heroVariant === 'compact' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground')}
                            onClick={() => setHeroVariant('compact')}
                        >
                            Без
                        </button>
                    </div>
                </div>

                <div className="py-2 flex items-center justify-between">
                    <span className="text-muted-foreground">Боковая панель</span>
                    <button
                        className={cn("relative w-9 h-5 rounded-full transition-all", showSide ? 'bg-red-600' : 'bg-border')}
                        onClick={() => setShowSide(!showSide)}
                    >
                        <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all", showSide ? 'left-[18px]' : 'left-[2px]')}></span>
                    </button>
                </div>
            </div>
        </main>
    );
}

const MetaRow = ({ keyText, valEl }: { keyText: string; valEl: React.ReactNode }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0 text-[13px]">
        <span className="text-muted-foreground text-[12px] font-medium">{keyText}</span>
        <span className="text-foreground font-medium">{valEl}</span>
    </div>
);
