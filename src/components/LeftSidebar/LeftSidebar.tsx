import React, { useState } from 'react';

// Example structure. Replace with your actual handbook structure or pass as prop.
const handbookTree = [
  {
    type: 'folder',
    name: 'Introduction',
    children: [
      { type: 'file', name: 'Welcome', link: '/en/introduction' },
      { type: 'file', name: 'Stay Current', link: '/en/page-stay-current' },
    ],
  },
  {
    type: 'folder',
    name: 'Networking',
    children: [
      { type: 'file', name: 'IP', link: '/en/page-ip' },
      { type: 'file', name: 'Packets', link: '/en/page-packets' },
      { type: 'file', name: 'Packet Sniffing', link: '/en/page-packet-sniffing' },
    ],
  },
  // ...more folders/files
];

function TreeNode({ node, currentPath }) {
  const [open, setOpen] = useState(true);
  if (node.type === 'folder') {
    return (
      <div className="ml-2">
        <button
          className="flex items-center text-accent-green font-header focus:outline-none"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <span className="mr-1">{open ? '▾' : '▸'}</span>
          <span>{node.name}</span>
        </button>
        {open && (
          <div className="ml-4 border-l border-accent-green pl-2">
            {node.children.map((child, idx) => (
              <TreeNode key={child.name + idx} node={child} currentPath={currentPath} />
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <a
      href={node.link}
      className={`block pl-6 py-0.5 text-foreground font-body text-sm transition-colors duration-100 hover:text-accent-cyan ${currentPath === node.link ? 'bg-background-dark text-accent-green' : ''}`}
    >
      <span className="font-mono">$</span> {node.name}
    </a>
  );
}

export default function LeftSidebar({ tree = handbookTree, currentPath }) {
  return (
    <nav aria-label="Handbook Navigation" className="bg-background text-foreground p-4 h-full font-body text-base select-none">
      <div className="text-xs text-accent-cyan mb-2 font-header tracking-widest">HANDBOOK</div>
      {tree.map((node, idx) => (
        <TreeNode key={node.name + idx} node={node} currentPath={currentPath} />
      ))}
    </nav>
  );
}
