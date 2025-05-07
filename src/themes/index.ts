import { type ThemeConfig } from '@/types/theme';

// 导入simple主题配置
import { simpleTheme } from './simple';

// 所有可用主题的映射
export const themes: Record<string, ThemeConfig> = {
  simple: simpleTheme,
};

// 默认主题配置
export const defaultTheme = simpleTheme;

/**
 * 获取主题配置
 * @param themeName 主题名称
 * @returns 主题配置
 */
export function getTheme(themeName: string): ThemeConfig | undefined {
  return themes[themeName];
}

/**
 * 获取所有可用主题
 * @returns 所有主题的配置
 */
export function getAllThemes(): ThemeConfig[] {
  return Object.values(themes);
}

/**
 * 获取主题的显示名称
 * @param themeName 主题名称
 * @returns 主题的显示名称
 */
export function getThemeDisplayName(themeName: string): string {
  const theme = getTheme(themeName);
  return theme ? theme.displayName : themeName;
}