export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface SuperAdminSettings {
  id: string;
  requireEmailVerification: boolean;
  allowOrganizationCreation: boolean;
  defaultTrialDays: number;
  enforceStrongPasswords: boolean;
  logoUrl: string;
  faviconUrl: string;
  lightThemeColors: ThemeColors;
  darkThemeColors: ThemeColors;
  updatedAt: string;
}

export const initialSettings: SuperAdminSettings = {
  id: "1",
  requireEmailVerification: true,
  allowOrganizationCreation: true,
  defaultTrialDays: 14,
  enforceStrongPasswords: true,
  logoUrl: "/logo.png",
  faviconUrl: "/favicon.ico",
  lightThemeColors: {
    primary: "#0284c7",
    secondary: "#64748b",
    accent: "#f59e0b",
    background: "#ffffff",
    text: "#0f172a",
  },
  darkThemeColors: {
    primary: "#38bdf8",
    secondary: "#94a3b8",
    accent: "#fbbf24",
    background: "#0f172a",
    text: "#f8fafc",
  },
  updatedAt: new Date().toISOString(),
};
