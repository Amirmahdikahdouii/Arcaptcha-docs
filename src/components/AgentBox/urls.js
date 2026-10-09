/**
 * Utility functions for resolving GitHub repository URLs and file paths
 * from Docusaurus documentation metadata.
 */

function getDocSourcePath(source) {
  if (!source || typeof source !== 'string') return null;
  return source.replace(/^@site\/?/, '');
}

function getDocGitHubUrls(source, options = {}) {
  const org = options.org || 'arcaptcha';
  const project = options.project || 'arcaptcha-docs';
  const branch = options.branch || 'main';
  const filePath = getDocSourcePath(source);

  if (!filePath) {
    const fallbackPath = 'static/onboard.md';
    return {
      rawUrl: `https://raw.githubusercontent.com/${org}/${project}/${branch}/${fallbackPath}`,
      githubUrl: `https://github.com/${org}/${project}/blob/${branch}/${fallbackPath}`,
    };
  }

  const encodedPath = encodeURI(filePath);
  return {
    rawUrl: `https://raw.githubusercontent.com/${org}/${project}/${branch}/${encodedPath}`,
    githubUrl: `https://github.com/${org}/${project}/blob/${branch}/${encodedPath}`,
  };
}

module.exports = {
  getDocSourcePath,
  getDocGitHubUrls,
};
