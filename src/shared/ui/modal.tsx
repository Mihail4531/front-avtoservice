import { X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div 
        className={cn(
          "bg-card rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200",
          className
        )}
      >
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
          <h2 className="font-bold text-foreground text-lg">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};
