'use client';

import { useParams } from 'react-router-dom';
import { ArticleEditor } from '@/widgets/article-editor/ui/ArticleEditor';

export const ArticleEditorPage = () => {
    const { id } = useParams<{ id: string }>();
    const articleId = id ? Number(id) : undefined;

    return <ArticleEditor articleId={articleId} />;
};