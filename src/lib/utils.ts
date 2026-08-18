import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Prefix a public-folder path with Vite `base` (needed on GitHub Pages project sites). */
export function publicUrl(path: string): string {
    const base = import.meta.env.BASE_URL;
    if (base !== '/' && path.startsWith(base)) {
        return path;
    }
    return `${base}${path.replace(/^\//, '')}`;
}
