import { motion } from 'motion/react';
import { Cpu, User } from 'lucide-react';
import { Message } from '../types';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { normalizeResponse } from '../app/user/page';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 mt-6 pb-6">
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex gap-3 md:gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {message.role === 'model' && (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-teal/10 flex items-center justify-center border border-primary-teal/20 flex-shrink-0 mt-auto">
              <Cpu className="w-5 h-5 text-primary-teal" />
            </div>
          )}
          
          <div className={`flex flex-col gap-2 min-w-0 max-w-[calc(100%-2.75rem)] md:max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
            {message.image && (
               <div className="rounded-2xl overflow-hidden shadow-sm border border-text-dim/20 bg-black/5 dark:bg-white/5 p-1 w-fit">
                  <img src={message.image} alt="User upload" className="max-w-[300px] max-h-[300px] w-auto h-auto rounded-xl object-contain" />
               </div>
            )}
            
            {message.text && (
              <div 
                className={`rounded-2xl px-4 py-2.5 md:px-5 md:py-3.5 max-w-full overflow-x-auto ${
                  message.role === 'user' 
                    ? 'bg-primary-teal text-bg-deep rounded-br-sm' 
                    : 'bg-surface-dark text-text-bright border border-white/5 rounded-bl-sm'
                }`}
              >
                <div className={`prose max-w-none break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 ${message.role === 'user' ? 'prose-sm md:prose-base prose-p:text-bg-deep prose-headings:text-bg-deep prose-strong:text-bg-deep prose-a:text-bg-deep' : 'prose-sm md:prose-base prose-invert prose-p:leading-relaxed prose-pre:bg-transparent prose-pre:border-0 prose-pre:p-0 prose-p:text-text-bright'}`}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      code: CodeBlock
                    }}
                  >
                      {message.role === 'model' ? normalizeResponse(message.text) : message.text}

                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>

          {message.role === 'user' && (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 flex-shrink-0 mt-auto">
              <User className="w-5 h-5 text-text-dim" />
            </div>
          )}
        </motion.div>
      ))}
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 md:gap-4 justify-start"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-teal/10 flex items-center justify-center border border-primary-teal/20 flex-shrink-0 mt-auto">
            <Cpu className="w-5 h-5 text-primary-teal" />
          </div>
          <div className="bg-surface-dark border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3 md:px-5 md:py-4 flex items-center gap-2 h-fit">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary-teal rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </motion.div>
      )}
    </div>
  );
}
