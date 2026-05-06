// entities/category-article/model/types.ts

export interface CategoryArticle {
    id: number;
    title: string;
    version: number;
    slug: string;
    description: string;
    image_url: string;
    is_active: boolean;
    created_at: string;
}

/**
 * Тип для создания новой категории статей через админку.
 * Соответствует CreateCategoryArticleRequest в Go-сервисе.
 */
export interface CreateCategoryArticleRequest {
    title: string;
    description: string;
    image_path: string;
}

/**
 * Тип для обновления категории статей через админку.
 * Соответствует UpdateCategoryArticleRequest в Go-сервисе.
 * Включает version для оптимистической блокировки.
 */
export interface UpdateCategoryArticleRequest {
    title: string;
    version: number;
    description: string;
    image_path: string;
    is_active?: boolean;
}

export interface UploadResponse {
    path: string;
}

export interface CategoryArticleListResponse {
    items: CategoryArticle[];
    total: number;
    limit: number;
    offset: number;
}

export interface SlugPreviewResponse {
    slug: string;
}

export interface CategoryArticleFilters {
    search?: string;
    is_active?: boolean;
    created_at_from?: string; // ISO 8601 format for backend *time.Time
    created_at_to?: string;   // ISO 8601 format for backend *time.Time
    page?: number;
    limit?: number;
}
