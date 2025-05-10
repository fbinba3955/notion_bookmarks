'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import * as Icons from 'lucide-react'
import { WebsiteConfig } from '@/types/notion'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'

interface Category {
  id: string
  name: string
  iconName?: string
  subCategories: {
    id: string
    name: string
  }[]
}

interface NavigationProps {
  categories: Category[]
  config: WebsiteConfig
}

const defaultConfig: WebsiteConfig = {
  SOCIAL_GITHUB: '',
  SOCIAL_BLOG: '',
  SOCIAL_X: '',
  SOCIAL_JIKE: '',
  SOCIAL_WEIBO: ''
}

export default function Navigation({ categories, config = defaultConfig }: NavigationProps) {
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  // 处理导航点击
  const handleNavClick = (categoryId: string, subCategoryId?: string) => {
    setActiveCategory(categoryId);
    const elementId = subCategoryId ? `${categoryId}-${subCategoryId}` : categoryId;
    const element = document.getElementById(elementId);
    
    if (element) {
      // 获取元素的位置
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // 滚动到元素位置，减去顶部导航栏的高度（根据实际高度调整）
      window.scrollTo({
        top: rect.top + scrollTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* 移动端顶部导航 */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <Icons.Rocket className="w-5 h-5 text-primary" />
            <span className="font-medium text-gray-900 dark:text-white">{config.SITE_TITLE || 'Notion Bookmarks'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeSwitcher />
            <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <Icons.Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto flex items-center h-12 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 scrollbar-none">
          <div className="flex px-4 min-w-full">
            <div className="flex space-x-2 mx-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleNavClick(category.id)}
                  className={cn(
                    "whitespace-nowrap px-3 py-1.5 text-sm rounded-md transition-colors shrink-0",
                    activeCategory === category.id
                      ? "bg-primary text-white font-medium shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* 桌面端边导航 */}
      <nav className="hidden lg:block w-[280px] flex-shrink-0 h-screen sticky top-0 bg-white dark:bg-gray-900 overflow-y-auto border-r border-gray-200 dark:border-gray-800">
        <div className="flex flex-col h-full">
          {/* Logo and Title */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                <Icons.Rocket className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white">{config.SITE_TITLE || 'Notion Bookmarks'}</span>
            </div>
            <ThemeSwitcher />
          </div>
          
          {/* Navigation Section */}
          <div className="flex-1 py-5 px-4">
            <div className="mb-4 px-2">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categories</h3>
            </div>
            
            <ul className="space-y-1">
              {categories.map((category) => {
                const IconComponent = category.iconName && (category.iconName in Icons)
                  ? (Icons[category.iconName as keyof typeof Icons] as React.ComponentType)
                  : Icons.Globe;

                return (
                  <li key={category.id}>
                    <div className="flex flex-col">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors",
                          expandedCategories.has(category.id)
                            ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            "w-6 h-6 rounded-md flex items-center justify-center",
                            expandedCategories.has(category.id) 
                              ? "bg-primary/10 text-primary" 
                              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                          )}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <Icons.ChevronDown
                          className={cn(
                            "w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform",
                            expandedCategories.has(category.id) ? "rotate-180" : ""
                          )}
                        />
                      </button>
                      {expandedCategories.has(category.id) && (
                        <ul className="mt-1 ml-9 space-y-1">
                          {category.subCategories.map((subCategory) => (
                            <li key={subCategory.id}>
                              <button
                                onClick={() => handleNavClick(category.id, subCategory.id)}
                                className={cn(
                                  "w-full text-left px-3 py-1.5 rounded-md transition-colors text-sm",
                                  activeCategory === `${category.id}-${subCategory.id}`
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                              >
                                {subCategory.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
          
          {/* Footer Section with Social Links */}
          {(config.SOCIAL_GITHUB || config.SOCIAL_BLOG || config.SOCIAL_X) && (
            <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-center space-x-4">
                {config.SOCIAL_GITHUB && (
                  <a 
                    href={config.SOCIAL_GITHUB} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <Icons.Github className="w-5 h-5" />
                  </a>
                )}
                {config.SOCIAL_BLOG && (
                  <a 
                    href={config.SOCIAL_BLOG} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <Icons.BookOpen className="w-5 h-5" />
                  </a>
                )}
                {config.SOCIAL_X && (
                  <a 
                    href={config.SOCIAL_X} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <Icons.Twitter className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}