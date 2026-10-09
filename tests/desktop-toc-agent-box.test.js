const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const wrapperPath = path.join(repoRoot, "src/theme/DocItem/TOC/Desktop/index.js");
const agentBoxDir = path.join(repoRoot, "src/components/AgentBox");
const agentBoxComponentPath = path.join(agentBoxDir, "index.js");
const agentBoxStylesPath = path.join(agentBoxDir, "styles.module.css");

test("DocItem/TOC/Desktop swizzle wrapper exists and cleanly wraps original TOC", () => {
  assert.ok(
    fs.existsSync(wrapperPath),
    "src/theme/DocItem/TOC/Desktop/index.js must exist to wrap desktop TOC"
  );

  const wrapperContent = fs.readFileSync(wrapperPath, "utf8");
  assert.match(
    wrapperContent,
    /@theme-original\/DocItem\/TOC\/Desktop/,
    "Wrapper must delegate to @theme-original/DocItem/TOC/Desktop"
  );
  assert.match(
    wrapperContent,
    /AgentBox/,
    "Wrapper must render AgentBox below desktop TOC"
  );
});

test("AgentBox component contains 4 agent buttons with correct deep links and prompt", () => {
  assert.ok(
    fs.existsSync(agentBoxComponentPath),
    "AgentBox component must exist"
  );

  const componentContent = fs.readFileSync(agentBoxComponentPath, "utf8");

  // Prompt check
  const expectedPrompt =
    "Please read https://docs.arcaptcha.co/onboard.md and help me integrate ARCaptcha into this project.";
  assert.match(
    componentContent,
    /https:\/\/docs\.arcaptcha\.co\/onboard\.md/,
    "AgentBox must reference https://docs.arcaptcha.co/onboard.md in prompt"
  );

  // 4 Agent integrations
  assert.match(
    componentContent,
    /Claude Code/i,
    "AgentBox must render Claude Code button"
  );
  assert.match(
    componentContent,
    /claude-cli:\/\/open\?q=/i,
    "Claude Code must have deep link scheme claude-cli://open?q=..."
  );

  assert.match(
    componentContent,
    /Cursor/i,
    "AgentBox must render Cursor button"
  );
  assert.match(
    componentContent,
    /https:\/\/cursor\.com\/link\/rule\?/i,
    "Cursor must have deep link https://cursor.com/link/rule?..."
  );

  assert.match(
    componentContent,
    /Codex/i,
    "AgentBox must render Codex button"
  );
  assert.match(
    componentContent,
    /codex:\/\/threads\/new\?prompt=/i,
    "Codex must have deep link codex://threads/new?prompt=..."
  );

  assert.match(
    componentContent,
    /OpenCode/i,
    "AgentBox must render OpenCode button"
  );

  // Clipboard copy & visual toast feedback
  assert.match(
    componentContent,
    /clipboard/i,
    "AgentBox must handle copying prompt to clipboard"
  );
  assert.match(
    componentContent,
    /toast|tooltip|copied/i,
    "AgentBox must provide visual feedback confirming copy"
  );
});

test("AgentBox styles support dark/light modes and hide on mobile viewports", () => {
  assert.ok(
    fs.existsSync(agentBoxStylesPath),
    "AgentBox styles file must exist"
  );

  const stylesContent = fs.readFileSync(agentBoxStylesPath, "utf8");

  // Mobile viewport hiding
  assert.match(
    stylesContent,
    /@media\s*\(max-width:\s*996px\)/i,
    "AgentBox styles must hide widget on mobile viewports (e.g. <= 996px)"
  );
  assert.match(
    stylesContent,
    /display:\s*none/i,
    "AgentBox must set display: none on small viewports"
  );

  // Theme support (CSS variables or dark mode selector)
  assert.match(
    stylesContent,
    /var\(--ifm-|\[data-theme=['"]dark['"]\]/i,
    "AgentBox styles must utilize Docusaurus theme variables or dark theme selectors"
  );
});

test("getDocGitHubUrls helper computes raw and GitHub blob URLs from doc source metadata", () => {
  const urlsModulePath = path.join(agentBoxDir, "urls.js");
  assert.ok(
    fs.existsSync(urlsModulePath),
    "src/components/AgentBox/urls.js helper module must exist"
  );

  const { getDocGitHubUrls, getDocSourcePath } = require(urlsModulePath);

  // Normal English versioned doc with space
  const enUrls = getDocGitHubUrls("@site/versioned_docs/version-4.0.0/quick start.md", {
    org: "arcaptcha",
    project: "arcaptcha-docs",
    branch: "main",
  });
  assert.strictEqual(
    enUrls.rawUrl,
    "https://raw.githubusercontent.com/arcaptcha/arcaptcha-docs/main/versioned_docs/version-4.0.0/quick%20start.md"
  );
  assert.strictEqual(
    enUrls.githubUrl,
    "https://github.com/arcaptcha/arcaptcha-docs/blob/main/versioned_docs/version-4.0.0/quick%20start.md"
  );

  // Persian localized doc
  const faUrls = getDocGitHubUrls("@site/i18n/fa/docusaurus-plugin-content-docs/version-4.0.0/quick start.md", {
    org: "arcaptcha",
    project: "arcaptcha-docs",
  });
  assert.strictEqual(
    faUrls.rawUrl,
    "https://raw.githubusercontent.com/arcaptcha/arcaptcha-docs/main/i18n/fa/docusaurus-plugin-content-docs/version-4.0.0/quick%20start.md"
  );
  assert.strictEqual(
    faUrls.githubUrl,
    "https://github.com/arcaptcha/arcaptcha-docs/blob/main/i18n/fa/docusaurus-plugin-content-docs/version-4.0.0/quick%20start.md"
  );

  // Path cleaner
  assert.strictEqual(
    getDocSourcePath("@site/docs/overview.md"),
    "docs/overview.md"
  );

  // Graceful fallback when source is missing
  const fallbackUrls = getDocGitHubUrls(null, {
    org: "arcaptcha",
    project: "arcaptcha-docs",
  });
  assert.match(fallbackUrls.githubUrl, /github\.com\/arcaptcha\/arcaptcha-docs/);
  assert.match(fallbackUrls.rawUrl, /raw\.githubusercontent\.com\/arcaptcha\/arcaptcha-docs/);
});

test("AgentBox implements Copy Text Content with GitHub fetch and DOM fallback", () => {
  const componentContent = fs.readFileSync(agentBoxComponentPath, "utf8");

  // Document action buttons present
  assert.match(
    componentContent,
    /Copy Text Content/i,
    "AgentBox must render Copy Text Content button"
  );
  assert.match(
    componentContent,
    /Open Markdown/i,
    "AgentBox must render Open Markdown button"
  );

  // GitHub raw fetch logic
  assert.match(
    componentContent,
    /raw\.githubusercontent\.com|getDocGitHubUrls|fetch\(/i,
    "AgentBox must fetch raw page markdown from GitHub"
  );

  // DOM fallback
  assert.match(
    componentContent,
    /article/i,
    "AgentBox must query article element as fallback"
  );

  // Toast confirmation
  assert.match(
    componentContent,
    /triggerToast\(/i,
    "AgentBox must trigger toast notification on copy"
  );
});

test("AgentBox implements Open Markdown opening GitHub file in a new tab", () => {
  const componentContent = fs.readFileSync(agentBoxComponentPath, "utf8");

  // GitHub file opening
  assert.match(
    componentContent,
    /window\.open\([^,]+,\s*['"]_blank['"]/i,
    "Open Markdown button must open source file in a new tab"
  );
  assert.match(
    componentContent,
    /github\.com/i,
    "Open Markdown button must open GitHub file URL"
  );
});

