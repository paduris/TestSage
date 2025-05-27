import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard, getFileExtension, getLanguageFromExtension } from '../../utils/helpers';

/**
 * Code snippet component with syntax highlighting and copy functionality
 */
const CodeSnippet = ({
  code,
  language = '',
  filePath = '',
  showLineNumbers = true,
  maxHeight = '400px',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  
  // Determine language from file path if not provided
  const displayLanguage = language || (filePath ? getLanguageFromExtension(getFileExtension(filePath)) : 'plaintext');
  
  // Handle copy to clipboard
  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <div className={`code-snippet-container rounded-lg overflow-hidden border border-gray-200 ${className}`}>
      {/* Header with language and copy button */}
      <div className="bg-gray-100 px-4 py-2 flex justify-between items-center border-b border-gray-200">
        <div className="text-sm font-medium text-gray-700">
          {displayLanguage}
          {filePath && (
            <span className="ml-2 text-gray-500 text-xs">{filePath}</span>
          )}
        </div>
        
        <button
          onClick={handleCopy}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Copy code"
          title="Copy to clipboard"
        >
          {copied ? (
            <div className="flex items-center text-green-600">
              <Check size={16} className="mr-1" />
              <span className="text-xs">Copied!</span>
            </div>
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>
      
      {/* Code content */}
      <div 
        className="overflow-auto bg-gray-50 p-4"
        style={{ maxHeight }}
      >
        <pre className="text-sm font-mono whitespace-pre">
          {showLineNumbers ? (
            code.split('\n').map((line, index) => (
              <div key={index} className="code-line flex">
                <span className="line-number text-gray-400 select-none mr-4 text-right w-8">
                  {index + 1}
                </span>
                <span className="line-content">{line}</span>
              </div>
            ))
          ) : (
            code
          )}
        </pre>
      </div>
    </div>
  );
};

export default CodeSnippet;
