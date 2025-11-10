
import React from 'react';
import { CopyIcon, ClearIcon, LoadingSpinnerIcon } from './Icons';

interface TranslatorCardProps {
  language: string;
  text: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClear?: () => void;
  isLoading?: boolean;
  isReadOnly: boolean;
  placeholder: string;
}

const TranslatorCard: React.FC<TranslatorCardProps> = ({
  language,
  text,
  onChange,
  onClear,
  isLoading = false,
  isReadOnly,
  placeholder,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-gray-700 rounded-xl p-4 flex flex-col h-full relative">
      <div className="relative flex-grow">
        <textarea
          value={text}
          onChange={onChange}
          readOnly={isReadOnly}
          placeholder={placeholder}
          className="w-full h-64 bg-transparent text-gray-200 placeholder-gray-500 resize-none focus:outline-none text-lg p-2"
          aria-label={`${language} text area`}
        />
        {isLoading && (
          <div className="absolute inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center rounded-xl">
            <LoadingSpinnerIcon className="w-10 h-10 text-cyan-400" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-end mt-2 space-x-2 h-8">
        {!isReadOnly && onClear && text.length > 0 && (
          <button
            onClick={onClear}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Clear text"
          >
            <ClearIcon className="w-5 h-5" />
          </button>
        )}
        {isReadOnly && text.length > 0 && !isLoading && (
          <button
            onClick={handleCopy}
            className="p-2 text-gray-400 hover:text-white transition-colors flex items-center"
            aria-label="Copy text"
          >
            {copied ? (
              <span className="text-sm text-cyan-400">Copied!</span>
            ) : (
              <CopyIcon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default TranslatorCard;
