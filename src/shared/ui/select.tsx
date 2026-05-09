'use client';

import {
    createContext,
    forwardRef,
    useContext,
    useEffect,
    useId,
    useRef,
    useState,
    type ButtonHTMLAttributes,
    type ReactNode,
} from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface SelectContextValue {
    value: string;
    onValueChange: (value: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    triggerRef: React.RefObject<HTMLButtonElement | null>;
    contentId: string;
    labels: Map<string, ReactNode>;
    registerLabel: (value: string, label: ReactNode) => void;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelect() {
    const ctx = useContext(SelectContext);
    if (!ctx) throw new Error('Select components must be used inside <Select>');
    return ctx;
}

interface SelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    defaultValue?: string;
    children: ReactNode;
}

export const Select = ({ value, onValueChange, defaultValue, children }: SelectProps) => {
    const [internalValue, setInternalValue] = useState(defaultValue ?? '');
    const [open, setOpen] = useState(false);
    const [labelsVersion, setLabelsVersion] = useState(0);
    const labelsRef = useRef<Map<string, ReactNode>>(new Map());
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const contentId = useId();

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const handleValueChange = (next: string) => {
        if (!isControlled) setInternalValue(next);
        onValueChange?.(next);
        setOpen(false);
    };

    const registerLabel = (val: string, label: ReactNode) => {
        const current = labelsRef.current.get(val);
        if (typeof label === 'string' && current === label) return;
        labelsRef.current.set(val, label);
        setLabelsVersion((v) => v + 1);
    };

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (triggerRef.current?.contains(target)) return;
            const content = document.getElementById(contentId);
            if (content?.contains(target)) return;
            setOpen(false);
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open, contentId]);

    // labelsVersion в зависимостях — пересоздаём Map при изменении
    const contextValue = {
        value: currentValue,
        onValueChange: handleValueChange,
        open,
        setOpen,
        triggerRef,
        contentId,
        labels: new Map(labelsRef.current),
        registerLabel,
    };

    // labelsVersion используется неявно через перерендер компонента
    void labelsVersion;

    return (
        <SelectContext.Provider value={contextValue}>
            <div className="relative w-full">
                {children}
               
            </div>
        </SelectContext.Provider>
    );
};

interface SelectTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    children: ReactNode;
}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
    ({ className, children, ...props }, _ref) => {
        const { open, setOpen, triggerRef } = useSelect();
        return (
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen(!open)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className={cn(
                    'flex w-full items-center justify-between rounded-xl border border-border bg-card',
                    'px-4 py-3 text-sm font-semibold text-foreground',
                    'outline-none transition-all',
                    'hover:border-[var(--red)]/50',
                    'focus:border-[var(--red)] focus:ring-2 focus:ring-[var(--red)]/20',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    open && 'border-[var(--red)] ring-2 ring-[var(--red)]/20',
                    className
                )}
                {...props}
            >
                {children}
                <ChevronDown
                    className={cn(
                        'w-4 h-4 text-muted-foreground transition-transform shrink-0 ml-2',
                        open && 'rotate-180'
                    )}
                />
            </button>
        );
    }
);
SelectTrigger.displayName = 'SelectTrigger';

interface SelectValueProps {
    placeholder?: string;
    className?: string;
}

export const SelectValue = ({ placeholder, className }: SelectValueProps) => {
    const { value, labels } = useSelect();
    const label = value ? labels.get(value) : null;

    console.log('🟢 SelectValue render. value:', value, 'labels:', Array.from(labels.entries()), 'found label:', label);

    if (!value || label === null || label === undefined) {
        return (
            <span className={cn('text-muted-foreground font-medium', className)}>
                {placeholder ?? 'Выберите...'}
            </span>
        );
    }
    return <span className={cn('truncate', className)}>{label}</span>;
};

interface SelectContentProps {
    className?: string;
    children: ReactNode;
}

export const SelectContent = ({ className, children }: SelectContentProps) => {
    const { open, contentId } = useSelect();

    return (
        <>
            {open && (
                <div
                    id={contentId}
                    role="listbox"
                    className={cn(
                        'absolute left-0 right-0 top-full z-[100] mt-1.5',
                        'max-h-60 overflow-y-auto',
                        'rounded-xl border border-border bg-card shadow-lg',
                        'p-1',
                        className
                    )}
                >
                    {children}
                </div>
            )}
            {/* Скрытая регистрация — рендерим children когда меню закрыто */}
            {!open && <div className="hidden">{children}</div>}
        </>
    );
};

interface SelectItemProps {
    value: string;
    children: ReactNode;
    className?: string;
    disabled?: boolean;
}

export const SelectItem = ({ value, children, className, disabled }: SelectItemProps) => {
    const { value: selectedValue, onValueChange, registerLabel } = useSelect();
    const isSelected = selectedValue === value;

    useEffect(() => {
        console.log('🔵 SelectItem mount. value:', value, 'children:', children);
        registerLabel(value, children);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, typeof children === 'string' ? children : null]);

    return (
        <button
            type="button"
            role="option"
            aria-selected={isSelected}
            disabled={disabled}
            onClick={() => !disabled && onValueChange(value)}
            className={cn(
                'relative flex w-full items-center rounded-lg',
                'px-3 py-2.5 pr-8 text-sm font-medium text-foreground',
                'cursor-pointer outline-none transition-colors',
                'hover:bg-muted/70 focus:bg-muted/70',
                'disabled:cursor-not-allowed disabled:opacity-50',
                isSelected && 'bg-[var(--red)]/10 text-[var(--red)] font-semibold',
                className
            )}
        >
            <span className="truncate text-left flex-1">{children}</span>
            {isSelected && <Check className="absolute right-2.5 w-4 h-4" />}
        </button>
    );
};