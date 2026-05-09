'use client';

import type { Editor } from '@tiptap/react';
import {
    Bold,
    Italic,
    Heading2,
    Heading3,
    List,
    Quote,
    Link2,
} from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface Props {
    editor: Editor | null;
}

export const RichTextToolbar = ({ editor }: Props) => {
    if (!editor) return null;

    const handleAddLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL ссылки', previousUrl ?? '');
        if (url === null) return; // отмена
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border bg-muted/30">
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive('bold')}
                title="Жирный (Ctrl+B)"
            >
                <Bold className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive('italic')}
                title="Курсив (Ctrl+I)"
            >
                <Italic className="w-4 h-4" />
            </ToolbarButton>

            <Divider />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                active={editor.isActive('heading', { level: 2 })}
                title="Заголовок 2"
            >
                <Heading2 className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                active={editor.isActive('heading', { level: 3 })}
                title="Заголовок 3"
            >
                <Heading3 className="w-4 h-4" />
            </ToolbarButton>

            <Divider />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editor.isActive('bulletList')}
                title="Список"
            >
                <List className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                active={editor.isActive('blockquote')}
                title="Цитата"
            >
                <Quote className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
                onClick={handleAddLink}
                active={editor.isActive('link')}
                title="Ссылка"
            >
                <Link2 className="w-4 h-4" />
            </ToolbarButton>
        </div>
    );
};

function ToolbarButton({
    onClick,
    active,
    title,
    children,
}: {
    onClick: () => void;
    active: boolean;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={cn(
                'p-1.5 rounded-md text-muted-foreground transition-colors',
                'hover:bg-muted hover:text-foreground',
                active && 'bg-muted text-foreground'
            )}
        >
            {children}
        </button>
    );
}

function Divider() {
    return <div className="w-px h-5 bg-border mx-1" />;
}
