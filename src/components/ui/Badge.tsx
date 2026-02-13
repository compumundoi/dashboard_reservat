import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
    const variants = {
        default: "bg-primary-100 text-primary-800",
        secondary: "bg-secondary-100 text-secondary-800",
        success: "bg-success-50 text-success-700 border border-success-200",
        warning: "bg-warning-50 text-warning-700 border border-warning-200",
        error: "bg-error-50 text-error-700 border border-error-200",
        info: "bg-blue-50 text-blue-700 border border-blue-200",
        outline: "bg-transparent border border-secondary-200 text-secondary-600",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}
