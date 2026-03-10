import { Helmet } from "react-helmet-async";

interface BlogSEOProps {
  title: string;
  description: string;
  slug: string;
  ogImage?: string;
  publishedDate: string;
}

export const BlogSEO = ({
  title,
  description,
  slug,
  ogImage,
  publishedDate,
}: BlogSEOProps) => {
  const url = `${window.location.origin}/blog/${slug}`;

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    image: [ogImage],
    datePublished: publishedDate,
    url: url,
    description: description,
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:url" content={url} />

      <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
    </Helmet>
  );
};
