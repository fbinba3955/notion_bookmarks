'use client'

import { WebsiteConfig } from '@/types/notion'
import { FaGithub, FaXTwitter, FaWeibo } from 'react-icons/fa6'
import { FaBlogger } from 'react-icons/fa'
import Image from 'next/image'

interface FooterProps {
  config: WebsiteConfig
}

export default function Footer({ config }: FooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-3 z-10 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
          <div className="flex items-center space-x-4">
            {config.SOCIAL_GITHUB && (
              <a
                href={config.SOCIAL_GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                title="GitHub"
                aria-label="GitHub"
              >
                <FaGithub className="w-5 h-5" />
              </a>
            )}
            {config.SOCIAL_BLOG && (
              <a
                href={config.SOCIAL_BLOG}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                title="Blog"
                aria-label="Blog"
              >
                <FaBlogger className="w-5 h-5" />
              </a>
            )}
            {config.SOCIAL_X && (
              <a
                href={config.SOCIAL_X}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                title="X (Twitter)"
                aria-label="X (Twitter)"
              >
                <FaXTwitter className="w-5 h-5" />
              </a>
            )}
            {config.SOCIAL_JIKE && (
              <a
                href={config.SOCIAL_JIKE}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                title="即刻"
                aria-label="即刻"
              >
                <Image
                  src="/logo_jike.png"
                  alt="即刻"
                  width={20}
                  height={20}
                  className="opacity-75 hover:opacity-100 transition-all"
                />
              </a>
            )}
            {config.SOCIAL_WEIBO && (
              <a
                href={config.SOCIAL_WEIBO}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                title="微博"
                aria-label="微博"
              >
                <FaWeibo className="w-5 h-5" />
              </a>
            )}
          </div>
          <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
            <p className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
              Built with Next.js and Notion
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 {config.SITE_AUTHOR || 'Notion Bookmarks'}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}