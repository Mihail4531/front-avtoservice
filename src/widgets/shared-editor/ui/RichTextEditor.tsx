'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';

import { RichTextToolbar } from './RichTextToolbar';
import { cn } from '@/shared/lib/cn';
import { tiptapExtensions } from '@/shared/lib/tiptap-extensions';

interface Props {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    minHeight?: string;
}

export const RichTextEditor = ({
    value,
    onChange,
    placeholder,
    error,
    disabled,
    minHeight = '400px',
}: Props) => {
    const editor = useEditor({
        extensions: [
            ...tiptapExtensions,
            Placeholder.configure({
                placeholder: placeholder ?? 'Начните писать...',
            }),
        ],

        content: value,
        editable: !disabled,
        immediatelyRender: false,

        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },

        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-sm max-w-none px-4 py-3 focus:outline-none',
                    minHeight !== 'auto' && `min-h-[${minHeight}]`,
                    '[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-foreground [&_h2]:block',
                    '[&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-foreground [&_h3]:block',
                    '[&_blockquote]:border-l-4 [&_blockquote]:border-[var(--red)] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_blockquote]:text-muted-foreground',
                    '[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5',
                    'prose-p:my-2 prose-p:text-foreground',
                    'prose-strong:text-foreground prose-strong:font-bold',
                ),
            },
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value, {
                emitUpdate: false,
            });
        }
    }, [value, editor]);

    useEffect(() => {
        if (editor) {
            editor.setEditable(!disabled);
        }
    }, [disabled, editor]);

    useEffect(() => {
        if (!editor || !placeholder) return;

        editor.extensionManager.extensions.forEach((ext) => {
            if (ext.name === 'placeholder') {
                ext.options.placeholder = placeholder;
            }
        });
    }, [editor, placeholder]);

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
