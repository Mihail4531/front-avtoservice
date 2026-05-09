'use client';

import { useParams } from 'react-router-dom';
import { CategoryEditor } from '@/widgets/category-editor/ui/CategoryEditor';

export const CategoryEditorPage = () => {
    const { id } = useParams<{ id: string }>();
    const categoryId = id ? Number(id) : undefined;

    return <CategoryEditor categoryId={categoryId} />;
};
