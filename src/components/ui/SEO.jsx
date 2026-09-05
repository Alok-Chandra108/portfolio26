import React, { useEffect } from 'react';

const DEFAULT_SEO = {
  title: 'Alok Chandra — Lead DevOps & Cloud Engineer',
  description: 'Portfolio of Alok Chandra — Specializing in Cloud Infrastructure, Kubernetes, Automation, DevOps, and Full Stack Systems Engineering.',
  url: 'https://alokchandra.dev',
  image: 'https://alokchandra.dev/og-image.png',
  type: 'website'
};

export default function SEO({
  title = DEFAULT_SEO.title,
  description = DEFAULT_SEO.description,
  url = DEFAULT_SEO.url,
  image = DEFAULT_SEO.image,
  type = DEFAULT_SEO.type,
  jsonLd = null
}) {
  const fullTitle = title.includes('Alok Chandra') ? title : `${title} | Alok Chandra`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = fullTitle;

    // Helper function to update or create meta tags
    const updateMetaTag = (selector, attribute, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const [attrName, attrVal] = selector.replace('meta[', '').replace(']', '').split('=');
        element.setAttribute(attrName, attrVal.replace(/"/g, ''));
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    // 2. Standard Meta Tags
    updateMetaTag('meta[name="description"]', 'content', description);
    updateMetaTag('meta[name="author"]', 'content', 'Alok Chandra');

    // 3. OpenGraph Meta Tags
    updateMetaTag('meta[property="og:title"]', 'content', fullTitle);
    updateMetaTag('meta[property="og:description"]', 'content', description);
    updateMetaTag('meta[property="og:type"]', 'content', type);
    updateMetaTag('meta[property="og:url"]', 'content', url);
    updateMetaTag('meta[property="og:image"]', 'content', image);
    updateMetaTag('meta[property="og:site_name"]', 'content', 'Alok Chandra Portfolio');

    // 4. Twitter Card Meta Tags
    updateMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'content', fullTitle);
    updateMetaTag('meta[name="twitter:description"]', 'content', description);
    updateMetaTag('meta[name="twitter:image"]', 'content', image);

    // 5. JSON-LD Structured Data for Google Rich Snippets
    let scriptTag = document.querySelector('#json-ld-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const defaultJsonLd = jsonLd || {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': 'Alok Chandra',
      'jobTitle': 'DevOps & Cloud Engineer',
      'url': 'https://alokchandra.dev',
      'sameAs': [
        'https://github.com/Alok-Chandra108/',
        'https://www.linkedin.com/in/alok-chandra108/'
      ],
      'knowsAbout': [
        'DevOps',
        'Cloud Computing',
        'Kubernetes',
        'AWS',
        'Docker',
        'Terraform',
        'CI/CD Pipelines'
      ]
    };

    scriptTag.textContent = JSON.stringify(defaultJsonLd);
  }, [fullTitle, description, url, image, type, jsonLd]);

  return null;
}
