import React from 'react';
import DocItemTOCDesktop from '@theme-original/DocItem/TOC/Desktop';
import AgentBox from '@site/src/components/AgentBox';
import { useDoc } from '@docusaurus/plugin-content-docs/client';

export default function DocItemTOCDesktopWrapper(props) {
  const doc = useDoc();
  return (
    <>
      <DocItemTOCDesktop {...props} />
      <AgentBox doc={doc} />
    </>
  );
}

