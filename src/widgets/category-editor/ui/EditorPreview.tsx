'use client';

import { type UseFormReturn } from 'react-hook-form';
import type { CategoryEditorSchema } from '../model/use-category-editor';

interface Props {
    form: UseFormReturn<CategoryEditorSchema>;
}

export const EditorPreview = ({ form }: Props) => {
    const title = form.watch('title');
    const description = form.watch('description');
    const imagePath = form.watch('image_path');

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    const imageUrl =
        imagePath instanceof File
            ? URL.createObjectURL(imagePath)
            : typeof imagePath === 'string' && imagePath
                ? imagePath.startsWith('http')
                    ? imagePath
                    : `${apiUrl}/uploads/${imagePath}`
                : null;

    return (
        <article className="bg-card border border-border rounded-xl p-8 max-w-3xl mx-auto">
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={title || 'preview'}
                    className="w-full aspect-video object-cover rounded-xl mb-6"
                />
            )}

            <h1 className="text-3xl font-bold text-foreground mb-4">
                {title || 'Название категории'}
            </h1>

            {description && (
                <div
                    className="text-lg text-muted-foreground mb-8 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            )}

            <div
                className={`prose prose-sm max-w-none
                    prose-headings:font-bold prose-headings:text-foreground
                    prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
                    prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
                    prose-p:my-2 prose-p:text-foreground
                    prose-strong:text-foreground
                    prose-blockquote:border-l-4 prose-blockquote:border-[var(--red)]
                    prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground
                    prose-a:text-[var(--red)] prose-a:underline`}
            >
                <p className="text-muted-foreground">
                    Здесь будет отображаться список всех услуг и статей,
                    привязанных к данной категории.
                </p>
            </div>
        </article>
    );
};