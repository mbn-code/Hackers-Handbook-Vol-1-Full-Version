import React, { useState } from 'react';

/**
 * TerminalBlock - A stylized terminal window for commands and outputs.
 * Props:
 *   - lines: Array<{ command?: string, output?: string }>
 *     Each line can be a command (with prompt) or output (plain text).
 */
export default function TerminalBlock({ lines = [] }) {
  const [copied, setCopied] = useState(false);
  const allText = lines.map(l => l.command ? `$ ${l.command}` : l.output).join('\n');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(allText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="bg-background-dark border border-accent-green rounded-lg shadow-lg font-mono text-foreground text-sm my-4 overflow-x-auto relative">
      <div className="flex items-center justify-between px-4 py-2 bg-background border-b border-accent-green rounded-t-lg">
        <span className="text-accent-cyan font-bold tracking-wide select-none">TERMINAL</span>
        <button
          onClick={handleCopy}
          className="text-xs px-2 py-1 rounded bg-accent-green text-background font-bold hover:bg-accent-cyan transition-colors"
          aria-label="Copy terminal contents"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="px-4 py-3 whitespace-pre-wrap">
        {lines.map((line, idx) =>
          line.command ? (
            <div key={idx} className="flex">
              <span className="text-accent-green select-none">$</span>&nbsp;
              <span>{line.command}</span>
            </div>
          ) : (
            <div key={idx} className="text-accent-cyan">{line.output}</div>
          )
        )}
      </pre>
    </div>
  );
}
