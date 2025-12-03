import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoMetaOptions {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  url?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private defaultImage = 'https://krhautobody.com/assets/krh-og-default.jpg';
  private defaultUrl = 'https://krhautobody.com';

  constructor(private meta: Meta, private title: Title) {}

  update(metaData: SeoMetaOptions): void {
    const {
      title,
      description,
      keywords,
      ogImage = this.defaultImage,
      url = this.defaultUrl,
    } = metaData;

    // Document title
    this.title.setTitle(title);

    // Basic meta
    this.meta.updateTag({ name: 'description', content: description });
    if (keywords) {
      this.meta.updateTag({ name: 'keywords', content: keywords });
    }

    // Open Graph (for FB, iMessage, etc.)
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: ogImage });
    this.meta.updateTag({ property: 'og:url', content: url });

    // Twitter Card (optional but nice)
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: ogImage });
  }
}
