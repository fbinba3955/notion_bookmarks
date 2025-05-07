'use client';

import Image from 'next/image';
import { Link } from '@/types/notion';
import { motion } from 'framer-motion';
import { IconExternalLink } from '@tabler/icons-react';
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
      className="fixed p-2 rounded-lg bg-popover/95 backdrop-blur supports-[backdrop-filter]:bg-popover/85
                border shadow-lg max-w-xs z-[100] pointer-events-none
                animate-in fade-in zoom-in-95 duration-200"
      style={{ 
        left: x,
        top: y - 8,
        transform: 'translateY(-100%)'
      }}
    >
      <p className="text-sm text-popover-foreground whitespace-normal">{content}</p>
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
    <motion.a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          block group relative
          p-3 rounded-lg border border-border/50
          transition-all duration-300 ease-out
          hover:shadow-md hover:shadow-primary/5
          hover:border-primary/20
          bg-card/50 backdrop-blur-sm
          h-[130px] min-w-[200px]
          overflow-hidden
          ${className || ''}
        `}
      >
        {/* 内容容器 */}
        <div className="flex flex-col h-full gap-1.5">
          {/* 图标和名称行 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* 图标容器 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative w-8 h-8 rounded-md overflow-hidden transition-all shrink-0
                       bg-muted/50 p-1 border border-border/50"
            >
              <Image
                src={getIconUrl(link)}
                alt="Site Icon"
                fill
                className="object-contain"
                sizes="32px"
              />
            </motion.div>
            
            {/* 网站名称和图标 */}
            <div className="flex-1 min-w-0 relative">
              <div 
                className="relative"
                onMouseEnter={(e) => handleMouseEnter(e, setTitleTooltip)}
                onMouseLeave={() => handleMouseLeave(setTitleTooltip)}
              >
                <h3 className="text-base font-medium text-foreground
                               group-hover:text-primary
                               transition-colors line-clamp-1 pr-6">
                  {link.name}
                </h3>
              </div>
              {/* 固定位置的外链图标 */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <IconExternalLink 
                  className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" 
                />
              </div>
            </div>
          </div>

          {/* 描述行 */}
          {link.desc && (
            <div 
              className="relative flex-1 min-h-0"
              onMouseEnter={(e) => handleMouseEnter(e, setDescTooltip)}
              onMouseLeave={() => handleMouseLeave(setDescTooltip)}
            >
              <p className="text-xs text-foreground/70
                         group-hover:text-foreground
                         line-clamp-2 transition-colors">
                {link.desc}
              </p>
            </div>
          )}

          {/* 标签行 - 放在底部 */}
          {link.tags && link.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 flex-shrink-0 mt-auto">
              {link.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-1.5 py-0.5 text-xs rounded-md
                           bg-muted/40 text-muted-foreground
                           group-hover:bg-primary/10 group-hover:text-primary/90
                           transition-colors"
                  title={tag}
                >
                  <span className="truncate max-w-[60px] text-[10px]">{tag}</span>
                </span>
              ))}
              {link.tags.length > 2 && (
                <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] rounded-md
                              bg-muted/40 text-muted-foreground
                              group-hover:bg-primary/10 group-hover:text-primary/90
                              transition-colors shrink-0"
                >
                  +{link.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 渐变悬浮效果 */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-transparent via-transparent to-transparent
                      group-hover:from-primary/5 group-hover:via-primary/2 group-hover:to-transparent
                      transition-colors duration-500" />

        {/* 新增的底部亮光效果 */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-transparent to-transparent
                     group-hover:via-primary/30 transition-colors duration-500" />
      </motion.a>

      {/* 提示框 */}
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