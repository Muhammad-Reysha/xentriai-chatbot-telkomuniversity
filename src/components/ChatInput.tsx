import { Camera, Send, Loader2, X } from 'lucide-react';
import { useState, KeyboardEvent, useRef, ChangeEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string, image?: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({ onSendMessage, isLoading, placeholder = "Butuh informasi apa?" }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if ((input.trim() || selectedImage) && !isLoading) {
      onSendMessage(input, selectedImage || undefined);
      setInput('');
      setSelectedImage(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // reset input so the same file could be selected again if removed
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto flex flex-col items-start gap-4">
        {selectedImage && (
          <div className="bg-surface-dark/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-xl relative group w-fit">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 bg-primary-teal text-[#FFFFFF] rounded-full p-1.5 shadow-md hover:brightness-110 z-10 transition-all hover:scale-105"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-xl overflow-hidden shadow-inner">
               <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
            </div>
          </div>
        )}
        <div className="bg-surface-dark/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-1.5 md:p-2 flex items-end gap-1 md:gap-2 group transition-all hover:border-primary-teal/30 w-full">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageChange}
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 md:p-3 mb-0.5 text-text-dim hover:text-primary-teal hover:bg-white/5 rounded-full transition-all flex-shrink-0"
          >
            <Camera className="w-5 h-5" />
          </button>
          <textarea 
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none focus:ring-0 text-text-bright placeholder-text-dim/50 px-2 py-3 md:py-3.5 outline-none text-sm md:text-base w-full min-w-0 resize-none overflow-y-auto max-h-[150px]"
            rows={1}
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className="p-2.5 md:p-3 mb-0.5 bg-primary-teal/20 text-primary-teal rounded-full hover:bg-primary-teal/30 transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : <Send className="w-5 h-5 md:w-6 md:h-6 fill-current" />}
          </button>
        </div>
        <div className="w-full text-center mt-2">
          <p className="text-xs text-text-dim">AI can make mistakes. Consider verifying important information.</p>
        </div>
      </div>
    </div>
  );
}
