import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle } from 'lucide-react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, id, ...props }, ref) => {
        const generatedId = React.useId();
        const textareaId = id || generatedId;

        return (
            <div className="space-y-1.5 w-full">
                {label && (
                    <label htmlFor={textareaId} className="block text-sm font-medium text-secondary-700">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <textarea
                        id={textareaId}
                        ref={ref}
                        className={cn(
                            "flex min-h-[80px] w-full rounded-xl border border-secondary-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-secondary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-y",
                            error && "border-error-500 focus-visible:ring-error-500",
                            className
                        )}
                        {...props}
                    />
                </div>

                {error && (
                    <div className="flex items-center gap-1 text-error-600 text-xs mt-1 animate-fade-in">
                        <AlertCircle className="w-3 h-3" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        );
    }
);

Textarea.displayName = "Textarea";
