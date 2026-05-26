interface SEOOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

const SITE_NAME = "Lilly's Blog";
const DEFAULT_DESCRIPTION = "Hi there, I'm a programmer from HIT. I love music and anime, hope you can find something interesting here!";

export function useSEO(options: SEOOptions = {}) {
  const title = options.title ? `${options.title} | ${SITE_NAME}` : SITE_NAME;
  const description = options.description || DEFAULT_DESCRIPTION;
  const url = options.url || window.location.href;
  const type = options.type || 'website';

  return { title, description, url, type, SITE_NAME };
}
