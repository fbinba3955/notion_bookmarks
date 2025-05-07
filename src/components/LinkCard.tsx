'use client';

import Image from 'next/image';
import { Link } from '@/types/notion';
import { motion } from 'framer-motion';
import { ExternalLink, Star, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface LinkCardProps {
  link: Link;
  className?: string;
}

// 提示框组件
function Tooltip({ content, show, x, y }: { content: string; show: boolean; x: number; y: number }) {
  if (!show) return null;
  
  return createPortal(
    <div 
      className="fixed p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 max-w-xs z-[100] pointer-events-none animate-in fade-in zoom-in-95 duration-200"
      style={{ 
        left: x,
        top: y - 8,
        transform: 'translateY(-100%)'
      }}
    >
      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-normal">{content}</p>
    </div>,
    document.body
  );
}

// 获取图标URL的辅助函数
function getIconUrl(link: Link): string {
  // 优先使用iconlink
  if (link.iconlink) {
    return link.iconlink;
  }
  // 其次使用iconfile
  if (link.iconfile) {
    return link.iconfile;
  }
  // 如果都没有，使用默认图标
  const url = new URL(link.url);
  return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
}

export default function LinkCard({ link, className }: LinkCardProps) {
  const [titleTooltip, setTitleTooltip] = useState({ show: false, x: 0, y: 0 });
  const [descTooltip, setDescTooltip] = useState({ show: false, x: 0, y: 0 });

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLElement>,
    setter: typeof setTitleTooltip
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setter({
      show: true,
      x: rect.left,
      y: rect.top
    });
  };

  const handleMouseLeave = (setter: typeof setTitleTooltip) => {
    setter({ show: false, x: 0, y: 0 });
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`
          group relative overflow-hidden
          bg-white dark:bg-gray-800 rounded-xl
          border border-gray-200 dark:border-gray-700
          p-4 h-[140px] shadow-sm
          hover:shadow-md hover:border-primary/30 dark:hover:border-primary/30
          transition-all duration-200
          ${className || ''}
        `}
      >
        <a 
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10"
          aria-label={link.name}
        />

        {/* Card content */}
        <div className="flex flex-col h-full">
          {/* Header - Icon and title */}
          <div className="flex items-start space-x-3 mb-2">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-1 flex-shrink-0">
              <Image
                src={getIconUrl(link)}
                alt=""
                fill
                className="object-contain"
                sizes="40px"
              />
            </div>
            
            <div 
              className="flex-1 min-w-0"
              onMouseEnter={(e) => handleMouseEnter(e, setTitleTooltip)}
              onMouseLeave={() => handleMouseLeave(setTitleTooltip)}
            >
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 line-clamp-2 pr-6 group-hover:text-primary transition-colors">
                {link.name}
              </h3>
            </div>
          </div>
          
          {/* Description */}
          {link.desc && (
            <div 
              className="mt-1 flex-1 min-h-0"
              onMouseEnter={(e) => handleMouseEnter(e, setDescTooltip)}
              onMouseLeave={() => handleMouseLeave(setDescTooltip)}
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                {link.desc}
              </p>
            </div>
          )}
          
          {/* Footer with tags */}
          <div className="mt-7 pt-2 flex items-center justify-between">
            {link.tags && link.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1 max-w-[85%]">
                {link.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-1.5 py-0.5 text-[10px] rounded-md
                           bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400
                           group-hover:bg-primary/10 group-hover:text-primary/90
                           transition-colors whitespace-nowrap overflow-hidden"
                    title={tag}
                  >
                    <span className="truncate max-w-[60px]">{tag}</span>
                  </span>
                ))}
                {link.tags.length > 2 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] rounded-md
                              bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400
                              group-hover:bg-primary/10 group-hover:text-primary/90
                              transition-colors shrink-0"
                  >
                    +{link.tags.length - 2}
                  </span>
                )}
              </div>
            ) : (
              <div></div> // Empty div to maintain space
            )}
          </div>
        </div>
        
        {/* Background accent effect */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-transparent via-transparent to-transparent
                      group-hover:from-primary/5 group-hover:via-primary/2 group-hover:to-transparent
                      transition-colors duration-500" />

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-transparent to-transparent
                     group-hover:via-primary/30 transition-colors duration-500" />
      </motion.div>

      {/* Tooltips */}
      <Tooltip 
        content={link.name}
        show={titleTooltip.show}
        x={titleTooltip.x}
        y={titleTooltip.y}
      />
      {link.desc && (
        <Tooltip 
          content={link.desc}
          show={descTooltip.show}
          x={descTooltip.x}
          y={descTooltip.y}
        />
      )}
    </>
  );
}