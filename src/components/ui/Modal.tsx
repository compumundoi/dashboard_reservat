import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
}

export function Modal({ isOpen, onClose, title, description, children, size = 'md', className }: ModalProps & { className?: string }) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-xl",
        xl: "max-w-4xl",
        "2xl": "max-w-5xl",
        "3xl": "max-w-6xl",
        "4xl": "max-w-7xl",
        full: "max-w-full mx-4",
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-secondary-900/40 backdrop-blur-sm transition-opacity animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                ref={modalRef}
                className={cn(
                    "relative w-full bg-white rounded-2xl shadow-soft-xl border border-secondary-200 overflow-hidden flex flex-col max-h-[90vh] animate-scale-in",
                    sizes[size],
                    className
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-secondary-100 bg-secondary-50/50">
                    <div>
                        <h3 className="text-lg font-display font-semibold text-secondary-900">{title}</h3>
                        {description && (
                            <p className="text-sm text-secondary-500 mt-0.5">{description}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
