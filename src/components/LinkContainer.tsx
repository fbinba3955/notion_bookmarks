// src/components/LinkContainer.tsx
"use client";

import React from "react";
import LinkCard from "./LinkCard";
import * as Icons from "lucide-react";
import type { Link, Category } from '@/types/notion'; 

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
    <div className="space-y-16 pb-12">
      {categories.map((category) => {
        const categoryLinks = linksByCategory[category.name];
        if (!categoryLinks) return null;

        return (
          <section key={category.id} id={category.id} className="space-y-8">
            <div className="flex items-center space-x-3 pb-2 border-b border-b-primary/10">
              {category.iconName &&
              Icons[category.iconName as keyof typeof Icons] ? (
                <div className="w-8 h-8 p-1.5 rounded-lg bg-primary/10 text-primary flex items-center justify-center shadow-sm">
                  {React.createElement(
                    Icons[
                      category.iconName as keyof typeof Icons
                    ] as React.ComponentType<{ className: string }>,
                    { className: "w-5 h-5" }
                  )}
                </div>
              ) : null}
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground/90 flex items-center">
                  {category.name}
                  <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-sm rounded-full font-normal">
                    {Object.values(categoryLinks).reduce((acc, links) => acc + links.length, 0)}
                  </span>
                </h2>
              </div>
            </div>

            <div className="space-y-12">
              {Object.entries(categoryLinks).map(([subCategory, links]) => (
                <div
                  key={`${category.id}-${subCategory
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  id={`${category.id}-${subCategory
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 rounded-full bg-primary"></div>
                    <h3 className="text-lg font-medium text-foreground/90 flex items-center">
                      {subCategory}
                      <span className="ml-2 text-xs px-1.5 py-0.5 rounded-md bg-muted/50 text-muted-foreground">
                        {links.length}
                      </span>
                    </h3>
                  </div>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
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
      <div className="mt-12 text-center text-sm text-muted-foreground">
        最近更新：{formatDate(lastGeneratedTime)}
      </div>
    </div>
  );
}
