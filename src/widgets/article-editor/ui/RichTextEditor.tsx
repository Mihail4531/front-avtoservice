'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import { RichTextToolbar } from './RichTextToolbar';
import { cn } from '@/shared/lib/cn';

interface Props {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
}

export const RichTextEditor = ({ value, onChange, placeholder, error, disabled }: Props) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3], // только H2 и H3, как на скрине
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[var(--red)] underline underline-offset-2',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder ?? 'Начните писать...',
            }),
        ],
        content: value,
        editable: !disabled,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-sm max-w-none min-h-[400px] px-4 py-3 focus:outline-none',
                    'prose-headings:font-bold prose-headings:text-foreground',
                    'prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3',
                    'prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2',
                    'prose-p:my-2 prose-p:text-foreground',
                    'prose-strong:text-foreground prose-strong:font-bold',
                    'prose-ul:my-2 prose-ol:my-2',
                    'prose-li:my-0.5',
                    'prose-blockquote:border-l-4 prose-blockquote:border-[var(--red)]',
                    'prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground',
                    'prose-a:text-[var(--red)] prose-a:underline',
                ),
            },
        },
    });

    // Синхронизация при внешнем изменении value (например, при загрузке статьи)
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value, { emitUpdate: false });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <div
            className={cn(
                'bg-card border rounded-xl overflow-hidden',
                error ? 'border-red-500' : 'border-border',
                disabled && 'opacity-50 pointer-events-none'
            )}
        >
            <RichTextToolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};