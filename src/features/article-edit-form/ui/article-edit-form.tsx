import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Switch } from '@/shared/ui/switch';
import { Label } from '@/shared/ui/label';
import { useArticleById } from '@/entities/article/hooks/use-get-by-id';
import { useUpdateArticle } from '@/entities/article/hooks/use-update';
import { useCreateArticle } from '@/entities/article/hooks/use-create';
import { useCategories } from '@/entities/category/hooks/use-get-all';
import { useEffect } from 'react';

const articleSchema = z.object({
    title: z.string().min(1, 'Заголовок обязателен'),
    slug: z.string().min(1, 'Slug обязателен'),
    description: z.string().min(1, 'Описание обязательно'),
    content: z.string().min(1, 'Контент обязателен'),
    category_id: z.string().min(1, 'Категория обязательна'),
    image_url: z.string().optional(),
    is_active: z.boolean().default(false),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

interface ArticleEditFormProps {
    mode?: 'create' | 'edit';
}

export function ArticleEditForm({ mode = 'edit' }: ArticleEditFormProps) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const { data: article, isLoading: isLoadingArticle } = useArticleById(mode === 'edit' && id ? Number(id) : null);
    const { data: categories } = useCategories();
    
    const updateMutation = useUpdateArticle();
    const createMutation = useCreateArticle();
    
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ArticleFormValues>({
        resolver: zodResolver(articleSchema),
        defaultValues: {
            title: '',
            slug: '',
            description: '',
            content: '',
            category_id: '',
            image_url: '',
            is_active: false,
        },
    });

    useEffect(() => {
        if (article && mode === 'edit') {
            setValue('title', article.title);
            setValue('slug', article.slug);
            setValue('description', article.description || '');
            setValue('content', article.content || '');
            setValue('category_id', String(article.category?.id || ''));
            setValue('image_url', article.image_url || '');
            setValue('is_active', article.is_active);
        }
    }, [article, mode, setValue]);

    const onSubmit = async (data: ArticleFormValues) => {
        try {
            if (mode === 'edit' && id) {
                await updateMutation.mutateAsync({
                    id: Number(id),
                    data: {
                        category_id: Number(data.category_id),
                        title: data.title,
                        slug: data.slug,
                        description: data.description,
                        content: data.content,
                        image_path: data.image_url || '',
                        is_active: data.is_active,
                        version: article?.version || 1,
                    },
                });
            } else {
                await createMutation.mutateAsync({
                    category_id: Number(data.category_id),
                    title: data.title,
                    slug: data.slug,
                    description: data.description,
                    content: data.content,
                    image_path: data.image_url || '',
                });
            }
            navigate('/dashboard/admin/articles');
        } catch (error) {
            console.error('Error saving article:', error);
        }
    };

    const isLoading = mode === 'edit' && isLoadingArticle;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => navigate(mode === 'edit' ? `/dashboard/admin/articles/${id}/view` : '/dashboard/admin/articles')}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Назад
                    </Button>
                    <h1 className="text-2xl font-bold">
                        {mode === 'edit' ? 'Редактирование статьи' : 'Создание статьи'}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => navigate(mode === 'edit' ? `/dashboard/admin/articles/${id}/view` : '/dashboard/admin/articles')}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Отмена
                    </Button>
                    <Button type="submit" disabled={updateMutation.isPending || createMutation.isPending}>
                        <Save className="w-4 h-4 mr-2" />
                        {updateMutation.isPending || createMutation.isPending ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Основная информация</h2>
                        
                        <div className="space-y-2">
                            <Label htmlFor="title">Заголовок *</Label>
                            <Input
                                id="title"
                                {...register('title')}
                                placeholder="Введите заголовок статьи"
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug *</Label>
                            <Input
                                id="slug"
                                {...register('slug')}
                                placeholder="url-slug"
                            />
                            {errors.slug && (
                                <p className="text-sm text-destructive">{errors.slug.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Описание *</Label>
                            <Textarea
                                id="description"
                                {...register('description')}
                                placeholder="Краткое описание статьи"
                                rows={3}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">{errors.description.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Контент *</h2>
                        <Textarea
                            {...register('content')}
                            placeholder="HTML контент статьи"
                            rows={15}
                            className="font-mono text-sm"
                        />
                        {errors.content && (
                            <p className="text-sm text-destructive">{errors.content.message}</p>
                        )}
                    </div>
                </div>

                {/* Right Column - Settings */}
                <div className="space-y-6">
                    {/* Category & Status */}
                    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Настройки</h2>
                        
                        <div className="space-y-2">
                            <Label htmlFor="category">Категория *</Label>
                            <Select 
                                value={watch('category_id')} 
                                onValueChange={(value) => setValue('category_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите категорию" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories?.map((category) => (
                                        <SelectItem key={category.id} value={String(category.id)}>
                                            {category.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category_id && (
                                <p className="text-sm text-destructive">{errors.category_id.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image_url">URL изображения</Label>
                            <Input
                                id="image_url"
                                {...register('image_url')}
                                placeholder="https://example.com/image.jpg"
                            />
                            {errors.image_url && (
                                <p className="text-sm text-destructive">{errors.image_url.message}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <Label htmlFor="is_active">Опубликовано</Label>
                            <Switch
                                id="is_active"
                                checked={watch('is_active')}
                                onCheckedChange={(checked) => setValue('is_active', checked)}
                            />
                        </div>
                    </div>

                    {/* Info Card */}
                    {mode === 'edit' && article && (
                        <div className="bg-card rounded-xl border border-border p-6 space-y-3">
                            <h2 className="text-lg font-semibold">Информация</h2>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>ID: {article.id}</p>
                                <p>Версия: {article.version}</p>
                                <p>Создано: {new Date(article.created_at).toLocaleDateString('ru-RU')}</p>
                                {article.updated_at && (
                                    <p>Обновлено: {new Date(article.updated_at).toLocaleDateString('ru-RU')}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}
