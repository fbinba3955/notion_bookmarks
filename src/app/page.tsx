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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Categories</p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{activeCategories.length}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Bookmark className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Bookmarks</p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{processedLinks.length}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Subcategories</p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                        {categoriesWithSubs.reduce((acc, cat) => acc + cat.subCategories.length, 0)}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</p>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                        {new Date().toLocaleDateString()}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

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