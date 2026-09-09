import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  structuredData?: Record<string, any> | Record<string, any>[];
}

export default function SEO({
  title,
  description,
  ogType = 'website',
  ogImage = 'https://www.wildinn.in/img/pexels-best-safari-insights-2159031159-35751549.webp',
  structuredData,
}: SEOProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Title
    const formattedTitle = title 
      ? `${title} | Wild Inn` 
      : 'Wild Inn | Luxury Wildlife Safaris, South India';
    document.title = formattedTitle;

    // 2. Canonical
    // Since HashRouter is used, we normalize the canonical link to have the clean browser-level pathname format.
    const normalizedPath = pathname === '/' ? '' : pathname;
    const canonicalUrl = `https://www.wildinn.in${normalizedPath}`;
    
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 3. Meta Description
    const defaultDescription = 'Discover the beauty of the South Indian wilderness through curated luxury safari journeys in Kabini, Bandipur, and Masinagudi.';
    const metaDescValue = description || defaultDescription;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', metaDescValue);

    // Helper to set meta tags
    const setMetaTag = (attrName: string, attrVal: string, contentVal: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    // 4. Open Graph Tags
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', metaDescValue);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:site_name', 'Wild Inn');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', metaDescValue);
    setMetaTag('name', 'twitter:image', ogImage);

    // 6. JSON-LD Structured Data
    // Remove old schema script tags
    const existingScripts = document.querySelectorAll('script[data-schema-id]');
    existingScripts.forEach(script => script.remove());

    if (structuredData) {
      const schemas = Array.isArray(structuredData) ? structuredData : [structuredData];
      schemas.forEach((schema, idx) => {
        const script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-schema-id', `seo-schema-${idx}`);
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }

    return () => {
      // Cleanup schemas on unmount
      const scriptsToClean = document.querySelectorAll('script[data-schema-id]');
      scriptsToClean.forEach(script => script.remove());
    };
  }, [title, description, ogType, ogImage, pathname, structuredData]);

  return null;
}
