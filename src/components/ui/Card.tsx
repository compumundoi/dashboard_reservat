import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    noPadding?: boolean;
}

export function Card({ className, noPadding = false, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-2xl border border-secondary-100 shadow-soft-sm overflow-hidden",
                !noPadding && "p-6 sm:p-8",
                className
            )}
            {...props}
        />
    );
}
