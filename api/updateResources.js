export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { resources } = req.body || {};

    if (!Array.isArray(resources)) {
      return res.status(400).json({ success: false, error: 'resources must be an array' });
    }

    const owner = process.env.GITHUB_OWNER || 'JohnStyleZ';
    const repo = process.env.GITHUB_REPO || 'ProbationResourcesPage';
    const branch = process.env.GITHUB_BRANCH || 'main';
    const path = process.env.GITHUB_JSON_PATH || 'resources.json';
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return res.status(500).json({ success: false, error: 'Missing GITHUB_TOKEN environment variable' });
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    const currentFileResponse = await fetch(getUrl, { headers });
    const currentFile = await currentFileResponse.json();

    if (!currentFileResponse.ok) {
      return res.status(currentFileResponse.status).json({
        success: false,
        error: 'Could not read resources.json from GitHub',
        githubError: currentFile.message || currentFile
      });
    }

    const updatedJson = JSON.stringify(resources, null, 2) + '\n';
    const content = Buffer.from(updatedJson, 'utf8').toString('base64');

    const updateResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update resources.json from admin panel',
        content,
        sha: currentFile.sha,
        branch
      })
    });

    const updateResult = await updateResponse.json();

    if (!updateResponse.ok) {
      return res.status(updateResponse.status).json({
        success: false,
        error: 'Could not update resources.json on GitHub',
        githubError: updateResult.message || updateResult
      });
    }

    return res.status(200).json({
      success: true,
      commit: updateResult.commit?.html_url || null,
      content: updateResult.content?.html_url || null
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
