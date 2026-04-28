import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import GalleryLightbox from '@/components/GalleryLightbox';
import type { Locale } from '@/i18n/config';

export default async function GalleryPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('gallery');

  return (
    <>
      <PageHero kicker="22 figuras" title={t('title')} subtitle={t('subtitle')} variant="compact" />
      <section className="section">
        <GalleryLightbox />
      </section>
    </>
  );
}
