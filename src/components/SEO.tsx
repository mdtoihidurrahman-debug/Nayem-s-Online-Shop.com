/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export default function SEO({ 
  title = "Nayem's Online Shop | Premium Clothing Brand", 
  description = "Discover Nayem's exclusive collection of premium clothing for men, women, and kids in Bangladesh. Shop stylish Panjabis, Sarees, and more.",
  image = "/og-image.jpg",
  url = "https://nayemsonlineshop.com"
}: SEOProps) {
  const siteTitle = title.includes("Nayem's Online Shop") ? title : `${title} | Nayem's Online Shop`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Keywords */}
      <meta name="keywords" content="clothing brand, online shop, fashion, Bangladesh, men's wear, women's wear, kids wear, panjabi, saree, Nayem's Online Shop" />
    </Helmet>
  );
}
