import { ArticleTable } from '@/widgets/article-table/ui/article-table';

export default function ArticlesPage() {
    return (
        <main className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Статьи</h1>
                <p className="text-muted-foreground">Управление статьями базы знаний</p>
            </div>

            <ArticleTable />
        </main>
    );
}
