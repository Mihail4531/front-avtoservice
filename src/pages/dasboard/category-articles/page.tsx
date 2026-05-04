import { CategoryArticleTable } from '@/widgets/category-article-table/ui/category-article-table';

export default function CategoryArticlesPage() {
    return (
        <main className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Категории статей</h1>
                <p className="text-muted-foreground">Управление категориями для статей базы знаний</p>
            </div>

            <CategoryArticleTable />
        </main>
    );
}
