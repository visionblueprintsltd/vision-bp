import { VercelRequest, VercelResponse } from '@vercel/node';
import { marked } from 'marked';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { title, slug, content, excerpt, published_at } = req.body;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = "visionblueprintsltd";
  const REPO_NAME = "vision-bp";

  // Convert Markdown to actual HTML for SEO
  const renderedContent = marked.parse(content || "");

  // Create a full, SEO-friendly HTML page
  const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Vision Blueprints</title>
    <meta name="description" content="${excerpt}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${excerpt}">
    <meta property="og:type" content="article">
    <link rel="canonical" href="https://www.visionblueprintsltd.com/blog/${slug}">
</head>
<body>
    <article class="prose lg:prose-xl">
      <h1>${title}</h1>
      <p><em>Published on: ${new Date(published_at).toLocaleDateString()}</em></p>
      <div class="content">
        ${renderedContent}
      </div>
    </article>
</body>
</html>`;

  try {
    const encodedContent = Buffer.from(fullHtml).toString('base64');
    
    // Save the individual HTML file
    await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/public/content/blog/${slug}.html`,
      {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Post: ${title}`,
          content: encodedContent,
        }),
      }
    );

    // Update the registry (posts-index.json) for the BlogList view
    const indexPath = "public/content/blog/posts-index.json";
    let indexData = [];
    let sha = "";

    // Try to get existing index
    const existingIndex = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${indexPath}`, {
      headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
    });

    if (existingIndex.ok) {
        const data = await existingIndex.json();
        sha = data.sha;
        indexData = JSON.parse(Buffer.from(data.content, 'base64').toString());
    }

    // Add new post to the top of the list
    const newEntry = { id: Date.now().toString(), title, slug, excerpt, published_at };
    const updatedIndex = JSON.stringify([newEntry, ...indexData.filter(p => p.slug !== slug)], null, 2);

    await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${indexPath}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: "Update blog index",
        content: Buffer.from(updatedIndex).toString('base64'),
        sha: sha || undefined
      }),
    });

    return res.status(200).json({ message: 'Post and Index updated' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}