'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect } from 'react';

import Placeholder from '@tiptap/extension-placeholder';
import { RichTextToolbar } from './RichTextToolbar';
import { cn } from '@/shared/lib/cn';
import { tiptapExtensions } from '@/shared/lib/tiptap-extensions';

interface Props {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
}

export const RichTextEditor = ({
    content,
    onChange,
    placeholder,
    error,
    disabled,
}: Props) => {
    const editor = useEditor({
        extensions: [
            ...tiptapExtensions,
            Placeholder.configure({
                placeholder: placeholder ?? 'Начните писать описание...',
            }),
        ],

        content,
        editable: !disabled,
        immediatelyRender: false,

        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },

        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-sm max-w-none min-h-[300px] px-4 py-3 focus:outline-none',

                    '[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-4 [&_h2]:text-foreground [&_h2]:block',
                    '[&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-foreground [&_h3]:block',

                    '[&_p]:my-2 [&_p]:leading-relaxed',

                    '[&_blockquote]:border-l-4 [&_blockquote]:border-[var(--red)] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-muted-foreground',

                    '[&_ul]:list-disc [&_ul]:pl-5',
                    '[&_ol]:list-decimal [&_ol]:pl-5',
                    '[&_li]:my-1',

                    'prose-p:text-foreground',
                ),
            },
        },
    });

    // sync content
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, {
                emitUpdate: false,
            });
        }
    }, [content, editor]);

    // sync disabled
    useEffect(() => {
        if (editor) {
            editor.setEditable(!disabled);
        }
    }, [disabled, editor]);

    return (
        <div
            className={cn(
                'bg-card border rounded-xl overflow-hidden transition-all',
                error
                    ? 'border-red-500'
                    : 'border-border focus-within:ring-1 focus-within:ring-[var(--red)]',
                disabled && 'opacity-50 pointer-events-none bg-muted/10',
            )}
        >
            <RichTextToolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};