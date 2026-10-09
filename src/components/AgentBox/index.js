import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

const ONBOARD_PROMPT =
  'Please read https://docs.arcaptcha.co/onboard.md and help me integrate ARCaptcha into this project.';

const AGENTS = [
  {
    id: 'claude',
    name: 'Claude Code',
    url: `claude-cli://open?q=${encodeURIComponent(ONBOARD_PROMPT)}`,
    icon: (
      <svg className={styles.agentIcon} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L9.5 8.5L3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5L12 2z" />
      </svg>
    ),
  },
  {
    id: 'cursor',
    name: 'Cursor',
    url: `https://cursor.com/link/rule?name=arcaptcha-docs&text=${encodeURIComponent(
      ONBOARD_PROMPT
    )}`,
    icon: (
      <svg className={styles.agentIcon} viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm3 3h6v2H9V9zm0 4h6v2H9v-2z" />
      </svg>
    ),
  },
  {
    id: 'codex',
    name: 'Codex',
    url: `codex://threads/new?prompt=${encodeURIComponent(ONBOARD_PROMPT)}`,
    icon: (
      <svg className={styles.agentIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    url: null, // Pure CLI prompt copy
    icon: (
      <svg className={styles.agentIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
];

export default function AgentBox() {
  const [toastMessage, setToastMessage] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const triggerToast = (message) => {
    setToastMessage(message);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const copyToClipboard = async (text) => {
    if (typeof window === 'undefined') return false;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    } catch {
      return false;
    }
  };

  const handleAgentClick = async (agent, event) => {
    event.preventDefault();
    await copyToClipboard(ONBOARD_PROMPT);
    triggerToast(`Prompt copied for ${agent.name}!`);

    if (agent.url && typeof window !== 'undefined') {
      if (agent.url.startsWith('https://')) {
        window.open(agent.url, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = agent.url;
      }
    }
  };

  const handleCopyPageText = async (event) => {
    event.preventDefault();
    if (typeof window === 'undefined') return;

    let content = '';
    const article = document.querySelector('article');
    if (article) {
      content = article.innerText.trim();
    } else {
      content = ONBOARD_PROMPT;
    }

    const success = await copyToClipboard(content);
    if (success) {
      triggerToast('Page text copied to clipboard!');
    } else {
      triggerToast('Failed to copy page text.');
    }
  };

  const handleOpenMarkdown = (event) => {
    if (typeof window === 'undefined') return;
    window.open('/onboard.md', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.agentBoxContainer}>
      <div className={styles.agentBoxCard}>
        <div className={styles.agentBoxHeader}>
          <h4 className={styles.agentBoxTitle}>
            <svg
              className={styles.titleIcon}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L9.5 8.5L3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5L12 2z" />
            </svg>
            Add to your Agent
          </h4>
        </div>

        <div className={styles.agentGrid}>
          {AGENTS.map((agent) => (
            <button
              key={agent.id}
              type="button"
              className={styles.agentButton}
              onClick={(e) => handleAgentClick(agent, e)}
              title={`Add ARCaptcha to ${agent.name}`}
            >
              {agent.icon}
              <span>{agent.name}</span>
            </button>
          ))}
        </div>

        <div className={styles.utilityActions}>
          <button
            type="button"
            className={styles.utilityButton}
            onClick={handleCopyPageText}
            title="Copy clean page text to clipboard"
          >
            <svg
              className={styles.agentIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span>Copy Text Content</span>
          </button>

          <button
            type="button"
            className={styles.utilityButton}
            onClick={handleOpenMarkdown}
            title="Open raw markdown specification"
          >
            <svg
              className={styles.agentIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>Open Markdown</span>
          </button>
        </div>

        {toastMessage && (
          <div className={styles.toast} role="status" aria-live="polite">
            <svg
              className={styles.toastIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
