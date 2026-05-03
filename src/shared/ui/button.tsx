import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
    {
        variants: {
            variant: {
                default: 'bg-[var(--red)] text-white hover:bg-[oklch(0.46_0.21_25)] shadow-sm',
                destructive: 'bg-[var(--red)] text-white hover:bg-[oklch(0.46_0.21_25)]',
                outline: 'border border-border bg-card text-foreground hover:bg-muted',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
                link: 'text-[var(--red)] underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-9 px-4 py-2',
                sm: 'h-8 px-3 text-xs rounded-md',
                lg: 'h-11 px-6',
                icon: 'h-9 w-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => (
        <button
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
        />
    )
);
Button.displayName = 'Button';

export { Button, buttonVariants };