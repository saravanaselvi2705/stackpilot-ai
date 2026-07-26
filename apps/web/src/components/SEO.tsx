import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'StackPilot AI - All-in-One AI-Powered Enterprise SaaS Platform',
  description = 'StackPilot AI unifies CRM, project management, automated billing, team collaboration, document management, and SEO workspaces into a single intelligent enterprise platform. Powered by Creovix.Stack.',
  keywords = 'StackPilot AI, enterprise SaaS, project management, CRM, AI productivity, workflow automation, document management, SEO workspace, Creovix',
  canonicalUrl = 'https://stackpilot.ai',
  ogType = 'website',
  ogImage = 'https://stackpilot.ai/og-image.png'
}) => {
  useEffect(() => {
    // Document Title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMetaTag = (selector: string, attribute: string, value: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          const nameMatch = selector.match(/name="([^"]+)"/);
          if (nameMatch) element.setAttribute('name', nameMatch[1]);
        } else if (selector.startsWith('meta[property=')) {
          const propMatch = selector.match(/property="([^"]+)"/);
          if (propMatch) element.setAttribute('property', propMatch[1]);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    // Standard Meta Tags
    updateMetaTag('meta[name="description"]', 'content', description);
    updateMetaTag('meta[name="keywords"]', 'content', keywords);

    // Open Graph Meta Tags
    updateMetaTag('meta[property="og:title"]', 'content', title);
    updateMetaTag('meta[property="og:description"]', 'content', description);
    updateMetaTag('meta[property="og:type"]', 'content', ogType);
    updateMetaTag('meta[property="og:url"]', 'content', canonicalUrl);
    updateMetaTag('meta[property="og:image"]', 'content', ogImage);

    // Twitter Card Meta Tags
    updateMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'content', title);
    updateMetaTag('meta[name="twitter:description"]', 'content', description);
    updateMetaTag('meta[name="twitter:image"]', 'content', ogImage);

    // Canonical Link Tag
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', canonicalUrl);

    // JSON-LD Structured Data Schema
    const schemaData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          'name': 'StackPilot AI',
          'applicationCategory': 'BusinessApplication',
          'operatingSystem': 'Web',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
          },
          'description': description,
          'publisher': {
            '@type': 'Organization',
            'name': 'Creovix.Stack',
            'email': 'creovixstack@gmail.com',
            'url': 'https://stackpilot.ai'
          }
        },
        {
          '@type': 'Organization',
          'name': 'Creovix.Stack',
          'email': 'creovixstack@gmail.com',
          'url': 'https://stackpilot.ai',
          'logo': 'https://stackpilot.ai/favicon.svg'
        }
      ]
    };

    let scriptElement = document.querySelector('#jsonld-schema') as HTMLScriptElement | null;
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = 'jsonld-schema';
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(schemaData);

  }, [title, description, keywords, canonicalUrl, ogType, ogImage]);

  return null;
};

export default SEO;
