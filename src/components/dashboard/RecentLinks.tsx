'use client';

import React from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { Link } from '@/types/notion';

interface RecentLinksProps {
  links: Link[];
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

const RecentLinks: React.FC<RecentLinksProps> = ({ links }) => {
  return (
    <div className="space-y-4">
      {links.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">暂无链接数据</p>
      ) : (
        links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg border border-border/70 hover:border-primary/30 transition-all hover:shadow-sm group"
          >
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-md overflow-hidden border border-border/80 bg-muted/30 flex items-center justify-center">
                <Image
                  src={getIconUrl(link)}
                  alt={link.name}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              
              <div className="flex flex-col">
                <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-1">
                  {link.name}
                </h3>
                {link.desc && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {link.desc}
                  </p>
                )}
              </div>
            </div>
            
            <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))
      )}
    </div>
  );
};

export default RecentLinks; 