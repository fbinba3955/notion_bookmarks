// src/app/page.tsx
import LinkContainer from '@/components/LinkContainer';
import Navigation from '@/components/layout/Navigation';
import { getLinks, getCategories, getWebsiteConfig } from '@/lib/notion';
import Footer from '@/components/layout/Footer';
import { Bookmark } from 'lucide-react';

export const revalidate = 43200; // 12小时重新验证一次

export default async function HomePage() {
  // 获取数据
  const [notionCategories, links, config] = await Promise.all([
    getCategories(),
    getLinks(),
    getWebsiteConfig(),
  ]);

  // 获取启用的分类名称集合
  const enabledCategories = new Set(notionCategories.map(cat => cat.name));

  // 处理链接数据，只保留启用分类中的链接
  const processedLinks = links
    .map(link => ({
      ...link,
      category1: link.category1 || '未分类',
      category2: link.category2 || '默认'
    }))
    .filter(link => enabledCategories.has(link.category1));

  // 获取有链接的分类集合
  const categoriesWithLinks = new Set(processedLinks.map(link => link.category1));

  // 过滤掉没有链接的分类
  const activeCategories = notionCategories.filter(category => 
    categoriesWithLinks.has(category.name)
  );

  // 为 Notion 分类添加子分类信息
  const categoriesWithSubs = activeCategories.map(category => {
    const subCategories = new Set(
      processedLinks
        .filter(link => link.category1 === category.name)
        .map(link => link.category2)
    );

    return {
      ...category,
      subCategories: Array.from(subCategories).map(subCat => ({
        id: subCat.toLowerCase().replace(/\s+/g, '-'),
        name: subCat
      }))
    };
  });

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(30,144,255,0.1)_0%,rgba(30,144,255,0)_100%)] dark:bg-[radial-gradient(45%_45%_at_50%_50%,rgba(30,144,255,0.05)_0%,rgba(30,144,255,0)_100%)]" />
      
      <div className="flex-1 flex">
        {/* Navigation sidebar */}
        <Navigation categories={categoriesWithSubs} config={config} />
        
        {/* Main content */}
        <main className="flex-1 w-full transition-all duration-300 ease-in-out">
          <div className="px-4 py-4 mt-16 lg:mt-0 pb-24">
            {/* Dashboard style stats summary */}
            <div className="max-w-[2000px] mx-auto">
              {/* Bookmark cards container with improved styling */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <LinkContainer 
                  initialLinks={processedLinks} 
                  enabledCategories={enabledCategories}
                  categories={activeCategories}
                  lastGeneratedTime={new Date()}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer config={config} />
    </div>
  );
}