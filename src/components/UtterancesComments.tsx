import React from 'react';

export const useUtterances = (commentNodeId: string) => {
  React.useEffect(() => {
    const scriptParentNode = document.getElementById(commentNodeId);
    if (!scriptParentNode) return;

    // docs - https://utteranc.es/
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.async = true;
    script.setAttribute('repo', 'Bilusca/desafio-nextjs');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('label', 'blog-comment');
    script.setAttribute('theme', 'github-dark');
    script.setAttribute('crossorigin', 'anonymous');

    scriptParentNode.appendChild(script);

    return () => {
      // cleanup - remove the older script with previous theme
      scriptParentNode.removeChild(scriptParentNode.firstChild as Node);
    };
  }, [commentNodeId]);
};

export const Comments = () => {
  useUtterances('comments');
  return <div id="comments" />;
};
