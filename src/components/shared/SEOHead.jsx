import { useEffect } from 'react';

export default function SEOHead({ title, description }) {
  useEffect(() => {
    if (title) document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute('content', description);
  }, [title, description]);

  return null;
}
