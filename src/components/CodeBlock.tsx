import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CodeBlock({ children, className, node, ...rest }: any) {
  const [isCopied, setIsCopied] = useState(false);
  
  // Extract text content from children
  const extractText = (node: any): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (node && typeof node === 'object' && node.props && node.props.children) {
      return extractText(node.props.children);
    }
    return '';
  };

  const handleCopy = () => {
    const text = extractText(children);
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const match = /language-(\w+)/.exec(className || '');
  const isInline = !match && !className?.includes('language-');

  if (isInline) {
    return (
      <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-primary-teal" {...rest}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative group rounded-lg overflow-hidden bg-black/50 border border-white/10 my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5 text-xs text-text-dim">
        <span className="font-mono">{match?.[1] || 'Code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-text-bright transition-colors"
          aria-label="Copy code"
        >
          {isCopied ? <Check className="w-4 h-4 text-primary-teal" /> : <Copy className="w-4 h-4" />}
          <span className="hidden sm:inline-block">{isCopied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
        <code className={className} {...rest}>
          {children}
        </code>
      </div>
    </div>
  );
}
