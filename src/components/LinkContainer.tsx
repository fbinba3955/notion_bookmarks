// src/components/LinkContainer.tsx
"use client";

import React from "react";
import LinkCard from "./LinkCard";
import * as Icons from "lucide-react";
import type { Link, Category } from '@/types/notion'; 
import { cn } from '@/lib/utils';

interface LinkContainerProps {
  initialLinks: Link[];
  enabledCategories: Set<string>;
  categories: Category[];
  lastGeneratedTime?: Date;
}

export default function LinkContainer({
  initialLinks,
  enabledCategories,
  categories,
  lastGeneratedTime = new Date(),
}: LinkContainerProps) {
  // 按一级和二级分类组织链接，只包含启用的分类
  const linksByCategory = initialLinks.reduce((acc, link) => {
    const cat1 = link.category1;
    const cat2 = link.category2;

    if (enabledCategories.has(cat1)) {
      if (!acc[cat1]) {
        acc[cat1] = {};
      }
      if (!acc[cat1][cat2]) {
        acc[cat1][cat2] = [];
      }
      acc[cat1][cat2].push(link);
    }
    return acc;
  }, {} as Record<string, Record<string, Link[]>>);

  const formatDate = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/\//g, '-');
  };

  return (
    <div className="space-y-8 pb-6">
      {categories.map((category) => {
        const categoryLinks = linksByCategory[category.name];
        if (!categoryLinks) return null;

        // 计算此分类下总链接数
        const totalLinks = Object.values(categoryLinks).reduce((acc, links) => acc + links.length, 0);

        return (
          <section key={category.id} id={category.id} className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                {category.iconName && Icons[category.iconName as keyof typeof Icons] ? (
                  <div className="w-10 h-10 p-2 rounded-lg bg-primary/10 text-primary flex items-center justify-center shadow-sm">
                    {React.createElement(
                      Icons[category.iconName as keyof typeof Icons] as React.ComponentType<{ className: string }>,
                      { className: "w-5 h-5" }
                    )}
                  </div>
                ) : (
                  <div className="w-10 h-10 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center shadow-sm">
                    <Icons.FolderOpen className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    {category.name}
                    <span className="ml-2 px-2.5 py-0.5 bg-primary/10 text-primary text-sm rounded-full font-medium">
                      {totalLinks}
                    </span>
                  </h2>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {Object.entries(categoryLinks).map(([subCategory, links]) => (
                <div
                  key={`${category.id}-${subCategory.toLowerCase().replace(/\s+/g, "-")}`}
                  id={`${category.id}-${subCategory.toLowerCase().replace(/\s+/g, "-")}`}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-5 rounded-full bg-primary"></div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center">
                        {subCategory}
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                          {links.length}
                        </span>
                      </h3>
                    </div>
                  </div>

                  <div className={cn(
                    "grid gap-4",
                    "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
                  )}>
                    {links.map((link) => (
                      <LinkCard key={link.id} link={link} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
      <div className="flex items-center justify-center py-4 mt-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <Icons.Clock className="w-4 h-4 mr-2" />
        最近更新：{formatDate(lastGeneratedTime)}
      </div>
    </div>
  );
}
