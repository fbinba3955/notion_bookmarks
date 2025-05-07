"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"
import { simpleTheme } from "@/themes/simple"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // 应用主题样式的函数
  const applyThemeStyles = React.useCallback(() => {
    // 确保在客户端环境下执行
    if (typeof window === 'undefined') return;
    
    // 获取light模式的样式
    const themeStyles = simpleTheme.styles.light;
    if (!themeStyles) return;
    
    // 创建或获取样式元素
    const styleId = `theme-simple-light`;
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    
    // 生成CSS变量
    const cssVars = Object.entries(themeStyles)
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
    
    // 设置样式内容
    styleEl.textContent = `
      :root {
        ${cssVars}
        color-scheme: light;
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
      forcedTheme="simple-light"
    >
      {children}
    </NextThemesProvider>
  );
}