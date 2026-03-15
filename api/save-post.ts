import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { title, slug, content, excerpt, published_at } = req.body;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = "visionblueprintsltd";
  const REPO_NAME = "vision-bp";

  // Create the HTML content
  const htmlContent = `
    <article>
      <h1>${title}</h1>
      <p><em>Published on: ${published_at}</em></p>
      <div class="excerpt">${excerpt}</div>
      <div class="content">
        ${content} 
      </div>
    </article>
  `;

  const encodedContent = Buffer.from(htmlContent).toString('base64');
  const path = `public/content/blog/${slug}.html`;

  try {
    // Commit to GitHub via REST API
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Add blog post: ${title}`,
          content: encodedContent,
          branch: 'main' 
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message);
    }

    return res.status(200).json({ message: 'Post committed successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}