import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Serverless function to delete a blog post from GitHub storage.
 * It removes the HTML file and updates the central posts-index.json.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow DELETE requests for this endpoint
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { slug } = req.body;
  
  // Input validation
  if (!slug) {
    return res.status(400).json({ message: 'Missing post slug' });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = "vision-bp";
  const OWNER = "visionblueprintsltd";
  const BASE_URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;

  try {
    // 1. Retrieve the file metadata to get the 'sha' required for deletion
    const fileRes = await fetch(`${BASE_URL}/public/content/blog/${slug}.html`, {
      headers: { 
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!fileRes.ok) {
      const errorData = await fileRes.json();
      throw new Error(`Failed to find file: ${errorData.message}`);
    }

    const fileData = await fileRes.json();

    // 2. Delete the specific HTML file from the GitHub repository
    const deleteRes = await fetch(`${BASE_URL}/public/content/blog/${slug}.html`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${GITHUB_TOKEN}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        message: `chore(blog): delete post ${slug}`, 
        sha: fileData.sha 
      })
    });

    if (!deleteRes.ok) {
      const errorData = await deleteRes.json();
      throw new Error(`Failed to delete file: ${errorData.message}`);
    }

    // 3. Update the registry (posts-index.json) reflect the deletion
    const indexPath = "public/content/blog/posts-index.json";
    const indexRes = await fetch(`${BASE_URL}/${indexPath}`, {
      headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
    });

    if (indexRes.ok) {
      const indexFileData = await indexRes.json();
      const currentContent = JSON.parse(
        Buffer.from(indexFileData.content, 'base64').toString('utf-8')
      );

      // Filter out the deleted post from the index array
      const updatedContent = currentContent.filter((post: any) => post.slug !== slug);
      const encodedUpdatedContent = Buffer.from(JSON.stringify(updatedContent, null, 2)).toString('base64');

      // Upload the updated index back to GitHub
      const updateIndexRes = await fetch(`${BASE_URL}/${indexPath}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${GITHUB_TOKEN}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          message: `chore(blog): remove ${slug} from index`,
          content: encodedUpdatedContent,
          sha: indexFileData.sha
        })
      });

      if (!updateIndexRes.ok) {
        const errorData = await updateIndexRes.json();
        throw new Error(`Failed to update index: ${errorData.message}`);
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: `Post ${slug} and its index entry deleted successfully.` 
    });

  } catch (err: any) {
    console.error("Deletion error:", err.message);
    return res.status(500).json({ 
      success: false, 
      message: err.message || "An internal error occurred during deletion." 
    });
  }
}