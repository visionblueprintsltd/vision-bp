import { VercelRequest, VercelResponse } from '@vercel/node';
import { marked } from 'marked';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { title, slug, content, excerpt, published_at, category, cover_image } = req.body;
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
    ${cover_image ? `<meta property="og:image" content="${cover_image}">` : ''}
    <link rel="canonical" href="https://www.visionblueprintsltd.com/blog/${slug}">
</head>
<body>
    <article class="prose lg:prose-xl">
      <h1>${title}</h1>
      <p><em>Published on: ${new Date(published_at).toLocaleDateString()}</em></p>
      ${category ? `<p>Category: ${category}</p>` : ''}
      <div class="content">
        ${renderedContent}
      </div>
    </article>
</body>
</html>`;

  try {
    const encodedContent = Buffer.from(fullHtml).toString('base64');
    
    // 1. Save/Update the individual HTML file
    // First, check if the file exists to get its SHA for update
    const fileUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/public/content/blog/${slug}.html`;
    const checkFile = await fetch(fileUrl, {
      headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
    });
    
    let fileSha = undefined;
    if (checkFile.ok) {
      const fileData = await checkFile.json();
      fileSha = fileData.sha;
    }

    await fetch(fileUrl,
      {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Post HTML: ${title}`,
          content: encodedContent,
          sha: fileSha
        }),
      }
    );

    // 1.5 Save the raw data (JSON) for editing
    const dataUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/public/content/blog/data/${slug}.json`;
    const checkData = await fetch(dataUrl, {
      headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
    });

    let dataSha = undefined;
    if (checkData.ok) {
      const dataJson = await checkData.json();
      dataSha = dataJson.sha;
    }

    const rawData = {
      title,
      slug,
      content, // This is the raw markdown
      excerpt,
      category,
      cover_image,
      published_at
    };

    await fetch(dataUrl, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Post Data: ${title}`,
        content: Buffer.from(JSON.stringify(rawData, null, 2)).toString('base64'),
        sha: dataSha
      }),
    });

    // 2. Update the registry (posts-index.json) for the BlogList view
    const indexPath = "public/content/blog/posts-index.json";
    let indexData = [];
    let indexSha = "";

    // Get existing index
    const existingIndex = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${indexPath}`, {
      headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
    });

    if (existingIndex.ok) {
        const data = await existingIndex.json();
        indexSha = data.sha;
        indexData = JSON.parse(Buffer.from(data.content, 'base64').toString());
    }

    // Prepare the new/updated entry
    const entryData = { 
      id: Date.now().toString(), 
      title, 
      slug, 
      excerpt, 
      published_at,
      category: category || "Uncategorized",
      cover_image: cover_image || ""
    };

    // If updating, find existing entry to preserve its ID if possible (optional)
    const existingEntryIndex = indexData.findIndex(p => p.slug === slug);
    let updatedIndexData;
    
    if (existingEntryIndex !== -1) {
      // Update existing entry
      const existingEntry = indexData[existingEntryIndex];
      entryData.id = existingEntry.id;
      // We also might want to keep the original published_at if it's an update, 
      // but usually the admin sends it.
      indexData[existingEntryIndex] = entryData;
      updatedIndexData = indexData;
    } else {
      // Add new entry to the top
      updatedIndexData = [entryData, ...indexData];
    }

    const updatedIndex = JSON.stringify(updatedIndexData, null, 2);

    await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${indexPath}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: "Update blog index",
        content: Buffer.from(updatedIndex).toString('base64'),
        sha: indexSha || undefined
      }),
    });

    return res.status(200).json({ message: 'Post and Index updated' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}