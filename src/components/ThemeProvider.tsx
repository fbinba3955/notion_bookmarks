"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"
import { simpleTheme } from "@/themes/simple"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // 应用主题样式的函数
  const applyThemeStyles = React.useCallback(() => {
    // 确保在客户端环境下执行
    if (typeof window === 'undefined') return;
    
    // 获取各模式的样式
    const lightStyles = simpleTheme.styles.light;
    const darkStyles = simpleTheme.styles.dark;
    
    if (!lightStyles || !darkStyles) return;
    
    // 创建或获取light模式样式元素
    const lightStyleId = `theme-simple-light`;
    let lightStyleEl = document.getElementById(lightStyleId) as HTMLStyleElement;
    
    if (!lightStyleEl) {
      lightStyleEl = document.createElement('style');
      lightStyleEl.id = lightStyleId;
      document.head.appendChild(lightStyleEl);
    }
    
    // 创建或获取dark模式样式元素
    const darkStyleId = `theme-simple-dark`;
    let darkStyleEl = document.getElementById(darkStyleId) as HTMLStyleElement;
    
    if (!darkStyleEl) {
      darkStyleEl = document.createElement('style');
      darkStyleEl.id = darkStyleId;
      document.head.appendChild(darkStyleEl);
    }
    
    // 生成light模式CSS变量
    const lightCssVars = Object.entries(lightStyles)
      .map(([key, value]) => {
        // 处理HSL颜色值，确保正确应用
        if (typeof value === 'string' && value.startsWith('hsl(')) {
          // 提取HSL值中的参数，用于Tailwind兼容性
          const hslParams = value.replace('hsl(', '').replace(')', '');
          // 对于颜色类变量，同时生成两种格式：一种是原始HSL函数格式，一种是Tailwind兼容的参数格式
          return `--${key}: ${value};\n  --${key}-hsl: ${hslParams};`;
        }
        return `--${key}: ${value};`;
      })
      .join('\n');
    
    // 生成dark模式CSS变量
    const darkCssVars = Object.entries(darkStyles)
      .map(([key, value]) => {
        // 处理HSL颜色值，确保正确应用
        if (typeof value === 'string' && value.startsWith('hsl(')) {
          // 提取HSL值中的参数，用于Tailwind兼容性
          const hslParams = value.replace('hsl(', '').replace(')', '');
          // 对于颜色类变量，同时生成两种格式：一种是原始HSL函数格式，一种是Tailwind兼容的参数格式
          return `--${key}: ${value};\n  --${key}-hsl: ${hslParams};`;
        }
        return `--${key}: ${value};`;
      })
      .join('\n');
    
    // 设置light模式样式内容
    lightStyleEl.textContent = `
      :root {
        ${lightCssVars}
        color-scheme: light;
      }
    `;
    
    // 设置dark模式样式内容
    darkStyleEl.textContent = `
      [data-theme="simple-dark"] {
        ${darkCssVars}
        color-scheme: dark;
      }
    `;
  }, []);

  // 在组件挂载时应用样式
  React.useEffect(() => {
    applyThemeStyles();
  }, [applyThemeStyles]);
  
  return (
    <NextThemesProvider 
      {...props} 
      attribute="data-theme"
      defaultTheme="simple-light"
      themes={['simple-light', 'simple-dark']}
    >
      {children}
    </NextThemesProvider>
  );
}