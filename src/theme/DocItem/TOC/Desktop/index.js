import React from 'react';
import DocItemTOCDesktop from '@theme-original/DocItem/TOC/Desktop';
import AgentBox from '@site/src/components/AgentBox';

export default function DocItemTOCDesktopWrapper(props) {
  return (
    <>
      <DocItemTOCDesktop {...props} />
      <AgentBox />
    </>
  );
}
