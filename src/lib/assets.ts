import { SITE } from '@/data/config';

const isProd = process.env.NODE_ENV === 'production';

/** Resolves an asset path with the correct basePath for GitHub Pages. */
export function asset(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return isProd ? `${SITE.basePath}${clean}` : clean;
}

/** URL of a data file under public/data/ */
export const dataUrl = (file: string) => asset(`/data/${file}`);

/** URL of a figure (main or SI) */
export const figureUrl = (group: 'main' | 'si', filename: string) =>
  asset(`/figures/${group}/${filename}`);

/** URL of a static document */
export const docUrl = (filename: string) => asset(`/docs/${filename}`);

/** URL of a table file */
export const tableUrl = (filename: string) => asset(`/tables/${filename}`);

/** URL of a contextual Imbabura image */
export const imgUrl = (filename: string) => asset(`/img/imbabura/${filename}`);
