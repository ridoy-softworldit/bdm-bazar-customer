import { useEffect, useState } from 'react';

interface Submenu {
  title: string;
  url: string;
  isDynamicPage: boolean;
  isActive: boolean;
}

interface Menu {
  menuTitle: string;
  submenus: Submenu[];
  isActive: boolean;
  order: number;
}

interface FooterSetting {
  _id: string;
  menus: Menu[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FooterSettingsResponse {
  success: boolean;
  message: string;
  data: FooterSetting[];
}

export default function useFooterSettings() {
  const [footerSettings, setFooterSettings] = useState<FooterSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFooterSettings = async () => {
      try {
        const response = await fetch('/api/footer-settings');
        const result: FooterSettingsResponse = await response.json();
        
        if (result.success) {
          // Filter active settings and sort menus by order
          const activeSettings = result.data
            .filter(setting => setting.isActive)
            .map(setting => ({
              ...setting,
              menus: setting.menus
                .filter(menu => menu.isActive)
                .sort((a, b) => a.order - b.order)
            }));
          
          setFooterSettings(activeSettings);
        } else {
          setError('Failed to fetch footer settings');
        }
      } catch {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchFooterSettings();
  }, []);

  return { footerSettings, loading, error };
}