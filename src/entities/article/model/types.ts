// entities/article/model/types.ts

export interface CategoryShortResponse {
    id: number;
    title: string;
    slug: string;
}

/**
 * Краткая информация о категории для использования в селекте
 */
export interface CategoryArticleShort {
    id: number;
    title: string;
}

export interface Article {
    id: number;
    version: number;
    category: CategoryShortResponse;
    title: string;
    slug: string;
    description: string;
    content: string;
    image_url: string;
    is_active: boolean;
 
    published_at?: string;
    created_at: string;
}

/**
 * Тип для создания новой статьи через админку.
 * Соответствует CreateArticleRequest в Go-сервисе.
 */
export interface CreateArticleRequest {
    category_id: number;
    title: string;
    description: string;
    content: string;
    image_path: string;

}

/**
 * Тип для обновления статьи через админку.
 * Соответствует UpdateArticleRequest в Go-сервисе.
 * Включает version для оптимистической блокировки.
 */
export interface UpdateArticleRequest {
    category_id: number;
    title: string;
    version: number;
    description: string;
    content: string;
    image_path: string;
    is_active?: boolean;

}

export interface UploadResponse {
    path: string;
}

export interface ArticleListResponse {
    items: Article[];
    total: number;
    limit: number;
    offset: number;
}

export interface SlugPreviewResponse {
    slug: string;
}

export interface ArticleFilters {
    search?: string;
    is_active?: boolean;
    category_id?: number;
    created_at_from?: string; // ISO 8601 format for backend *time.Time
    created_at_to?: string;   // ISO 8601 format for backend *time.Time
    page?: number;
    limit?: number;
}

