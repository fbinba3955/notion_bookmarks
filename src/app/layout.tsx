import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Clarity } from "@/components/Clarity";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

import { getWebsiteConfig } from "@/lib/notion";
import { mergeConfig } from "@/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  adjustFontFallback: true,
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const config = mergeConfig(await getWebsiteConfig());
  
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: {
      default: config.SITE_TITLE || "Ezho导航",
      template: `%s | ${config.SITE_TITLE || "Ezho工具箱"}`,
    },
    description: config.SITE_DESCRIPTION || "Ezho工具箱，超级个体需要知道的各种好用工具",
    keywords: config.SITE_KEYWORDS?.split(',') || ["AI导航", "超级个体", "工具箱"],
    icons: {
      icon: '/favicon.ico',
    },
    openGraph: {
      type: 'website',
      locale: 'zh_CN',
      url: '/',
      title: config.SITE_TITLE,
      description: config.SITE_DESCRIPTION,
      siteName: config.SITE_TITLE,
    },
    twitter: {
      card: 'summary_large_image',
      title: config.SITE_TITLE,
      description: config.SITE_DESCRIPTION,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = mergeConfig(await getWebsiteConfig());
  
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <Clarity clarityId={config.CLARITY_ID || ''} />
        <GoogleAnalytics gaId={config.GA_ID || ''} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="simple-light"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
