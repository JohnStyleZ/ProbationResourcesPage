export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {

    const { resources } = req.body;

    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';

    const token = process.env.GITHUB_TOKEN;

    const path = 'resources.json';

    const currentFile = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json'
        }
      }
    );

    const currentData = await currentFile.json();

    const updatedContent = Buffer
      .from(JSON.stringify(resources, null, 2))
      .toString('base64');

    const githubResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update resources.json from admin panel',
          content: updatedContent,
          sha: currentData.sha,
          branch
        })
      }
    );

    const githubResult = await githubResponse.json();

    return res.status(200).json({
      success: true,
      githubResult
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      error: err.message
    });

  }
}
