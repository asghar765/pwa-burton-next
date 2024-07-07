// pwa-burton-next/config/themeConfig.ts
export const themeConfig = {
    light: {
      foreground: '#000000',
      background: '#ffffff',
    },
    dark: {
      foreground: '#ffffff',
      background: '#000000',
    },
  };
  
  export type ThemeType = keyof typeof themeConfig;