import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

export const tiptapExtensions = [
    StarterKit.configure({
        heading: {
            levels: [2, 3],
        },
    }),

    Link.configure({
        openOnClick: false,
        HTMLAttributes: {
            class: 'text-[var(--red)] underline underline-offset-2 cursor-pointer',
        },
    }),
];