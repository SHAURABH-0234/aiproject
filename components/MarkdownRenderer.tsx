
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderLine = (line: string, index: number) => {
    if (line.startsWith('### ')) {
      return <h3 key={index} className="text-xl font-semibold mt-4 mb-2 text-cyan-400">{line.substring(4)}</h3>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 border-b border-gray-700 pb-2">{line.substring(3)}</h2>;
    }
    if (line.startsWith('# ')) {
      return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{line.substring(2)}</h1>;
    }
    if (line.startsWith('* ')) {
      return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
    }
    if (line.startsWith('- ')) {
        return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
      }
    if (line.trim() === '') {
      return <br key={index} />;
    }
    return <p key={index} className="my-1">{line}</p>;
  };

  const lines = content.split('\n');
  
  return (
    <div className="prose prose-invert max-w-none text-gray-300">
      {lines.map(renderLine)}
    </div>
  );
};

export default MarkdownRenderer;
