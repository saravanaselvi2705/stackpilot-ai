import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import type { User, UserRole } from '../../../../packages/shared/types';

export interface CustomizationSettings {
  companyName: string;
  logoText: string;
  logoUrl: string;
  brandColor: string;
  theme: 'dark' | 'light';
  sidebarMenu: {
    dashboard: boolean;
    crm: boolean;
    projects: boolean;
    tasks: boolean;
    finance: boolean;
    reports: boolean;
    team: boolean;
    calendar: boolean;
    documentation: boolean;
  };
  dashboardWidgets: {
    metrics: boolean;
    recentActivities: boolean;
    calendarPreview: boolean;
    invoicesSummary: boolean;
  };
  currency: 'INR' | 'USD' | 'EUR';
  timezone: string;
  dateFormat: string;
  invoiceTemplate: 'modern' | 'classic' | 'minimal';
  reportBranding: {
    headerText: string;
    footerText: string;
  };
  emailTemplates: {
    welcome: string;
    invoice: string;
  };
}

export interface PermissionSet {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface RoleConfig {
  name: string;
  description: string;
  permissions: {
    CRM: PermissionSet;
    PM: PermissionSet;
    Finance: PermissionSet;
    SEO: PermissionSet;
  };
}

interface CustomizationContextProps {
  settings: CustomizationSettings;
  updateSettings: (newSettings: Partial<CustomizationSettings>) => void;
  resetBranding: () => void;
  roles: RoleConfig[];
  addRole: (role: RoleConfig) => void;
  updateRole: (roleName: string, updated: RoleConfig) => void;
  deleteRole: (roleName: string) => void;
  usersList: User[];
  updateUserRole: (userId: string, role: string) => void;
  hasPermission: (module: 'CRM' | 'PM' | 'Finance' | 'SEO', action: 'view' | 'create' | 'edit' | 'delete') => boolean;
  formatCurrency: (amount: number) => string;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
}

const defaultSettings: CustomizationSettings = {
  companyName: 'StackPilot AI',
  logoText: 'S',
  logoUrl: '',
  brandColor: '#22C55E',
  theme: 'dark',
  sidebarMenu: {
    dashboard: true,
    crm: true,
    projects: true,
    tasks: true,
    finance: true,
    reports: true,
    team: true,
    calendar: true,
    documentation: true,
  },
  dashboardWidgets: {
    metrics: true,
    recentActivities: true,
    calendarPreview: true,
    invoicesSummary: true,
  },
  currency: 'INR',
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
  invoiceTemplate: 'modern',
  reportBranding: {
    headerText: 'StackPilot Telemetry Insights',
    footerText: '© 2026 StackPilot AI. All rights reserved.',
  },
  emailTemplates: {
    welcome: 'Welcome to StackPilot! Your corporate portal is ready.',
    invoice: 'Hello, your invoice details are attached below.',
  },
};

const defaultRoles: RoleConfig[] = [
  {
    name: 'Super Admin',
    description: 'Master administrative bypass permissions.',
    permissions: {
      CRM: { view: true, create: true, edit: true, delete: true },
      PM: { view: true, create: true, edit: true, delete: true },
      Finance: { view: true, create: true, edit: true, delete: true },
      SEO: { view: true, create: true, edit: true, delete: true },
    },
  },
  {
    name: 'Admin',
    description: 'System administration settings access.',
    permissions: {
      CRM: { view: true, create: true, edit: true, delete: true },
      PM: { view: true, create: true, edit: true, delete: true },
      Finance: { view: true, create: true, edit: true, delete: true },
      SEO: { view: true, create: true, edit: true, delete: true },
    },
  },
  {
    name: 'Project Manager',
    description: 'Manage tasks, milestones, and deliverable items.',
    permissions: {
      CRM: { view: true, create: true, edit: true, delete: false },
      PM: { view: true, create: true, edit: true, delete: true },
      Finance: { view: true, create: false, edit: false, delete: false },
      SEO: { view: true, create: true, edit: true, delete: false },
    },
  },
  {
    name: 'Developer',
    description: 'Review task details, submit timesheets.',
    permissions: {
      CRM: { view: false, create: false, edit: false, delete: false },
      PM: { view: true, create: false, edit: true, delete: false },
      Finance: { view: false, create: false, edit: false, delete: false },
      SEO: { view: false, create: false, edit: false, delete: false },
    },
  },
  {
    name: 'Tester',
    description: 'QA validation execution suites.',
    permissions: {
      CRM: { view: false, create: false, edit: false, delete: false },
      PM: { view: true, create: true, edit: true, delete: false },
      Finance: { view: false, create: false, edit: false, delete: false },
      SEO: { view: false, create: false, edit: false, delete: false },
    },
  },
  {
    name: 'Finance',
    description: 'Billing invoicing configurations and payments ledger.',
    permissions: {
      CRM: { view: true, create: false, edit: false, delete: false },
      PM: { view: false, create: false, edit: false, delete: false },
      Finance: { view: true, create: true, edit: true, delete: true },
      SEO: { view: false, create: false, edit: false, delete: false },
    },
  },
  {
    name: 'Client',
    description: 'Customer workspace access view reports.',
    permissions: {
      CRM: { view: false, create: false, edit: false, delete: false },
      PM: { view: true, create: false, edit: false, delete: false },
      Finance: { view: true, create: false, edit: false, delete: false },
      SEO: { view: false, create: false, edit: false, delete: false },
    },
  },
];

const CustomizationContext = createContext<CustomizationContextProps | undefined>(undefined);

export const CustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Customization Settings
  const [settings, setSettings] = useState<CustomizationSettings>(() => {
    const stored = localStorage.getItem('sp_customization_settings');
    return stored ? JSON.parse(stored) : defaultSettings;
  });

  // Custom Roles & Permissions custom list
  const [roles, setRoles] = useState<RoleConfig[]>(() => {
    const stored = localStorage.getItem('sp_custom_roles');
    return stored ? JSON.parse(stored) : defaultRoles;
  });

  // User details cache to support custom assignment
  const [usersList, setUsersList] = useState<User[]>(() => {
    const stored = localStorage.getItem('sp_users');
    if (stored) return JSON.parse(stored);
    
    // Seed initial users list from localStorage sp_users if present
    const usersStr = localStorage.getItem('sp_users');
    if (usersStr) return JSON.parse(usersStr);
    return [];
  });

  // Demo Mode state
  const [demoMode, setDemoModeState] = useState<boolean>(() => {
    const stored = localStorage.getItem('sp_demo_mode');
    return stored ? stored === 'true' : true; // Default to true for development/demo ease
  });

  const setDemoMode = (val: boolean) => {
    setDemoModeState(val);
    localStorage.setItem('sp_demo_mode', String(val));
    // Trigger window refresh to clean/reseed mock database
    window.location.reload();
  };

  // Sync usersList whenever sp_users changes in localStorage
  useEffect(() => {
    const checkUsers = () => {
      const stored = localStorage.getItem('sp_users');
      if (stored) {
        setUsersList(JSON.parse(stored));
      }
    };
    checkUsers();
    // Add interval poll to sync user listings in settings
    const interval = setInterval(checkUsers, 3000);
    return () => clearInterval(interval);
  }, []);

  // Sync styles on changes
  useEffect(() => {
    localStorage.setItem('sp_customization_settings', JSON.stringify(settings));
    
    // Apply Brand Color overriding Tailwind CSS variables
    document.documentElement.style.setProperty('--color-primary', settings.brandColor);
    document.documentElement.style.setProperty('--color-cyan-500', settings.brandColor);
    document.documentElement.style.setProperty('--color-indigo-500', settings.brandColor);
    
    // Theme setup
    if (settings.theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [settings]);

  // Sync custom roles
  useEffect(() => {
    localStorage.setItem('sp_custom_roles', JSON.stringify(roles));
  }, [roles]);

  const updateSettings = (newSettings: Partial<CustomizationSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetBranding = () => {
    setSettings(defaultSettings);
    setRoles(defaultRoles);
    localStorage.removeItem('sp_customization_settings');
    localStorage.removeItem('sp_custom_roles');
  };

  // Roles helpers
  const addRole = (role: RoleConfig) => {
    if (roles.some((r) => r.name.toLowerCase() === role.name.toLowerCase())) return;
    setRoles((prev) => [...prev, role]);
  };

  const updateRole = (roleName: string, updated: RoleConfig) => {
    setRoles((prev) => prev.map((r) => (r.name === roleName ? updated : r)));
  };

  const deleteRole = (roleName: string) => {
    // Prevent deleting default critical administrative roles
    if (['super admin', 'admin', 'developer'].includes(roleName.toLowerCase())) return;
    setRoles((prev) => prev.filter((r) => r.name !== roleName));
  };

  // Update user roles
  const updateUserRole = (userId: string, newRole: string) => {
    const updated = usersList.map((u) => {
      if (u._id === userId) {
        return { ...u, role: newRole as any };
      }
      return u;
    });
    setUsersList(updated);
    localStorage.setItem('sp_users', JSON.stringify(updated));

    // If the active user updated their own role, update AuthContext
    const activeUser = localStorage.getItem('stackpilot_user');
    if (activeUser) {
      const activeObj = JSON.parse(activeUser);
      if (activeObj._id === userId) {
        activeObj.role = newRole;
        localStorage.setItem('stackpilot_user', JSON.stringify(activeObj));
        // Force refresh to reload role permissions state
        window.location.reload();
      }
    }
  };

  // Dynamic Permission Guard Evaluator
  const hasPermission = (
    module: 'CRM' | 'PM' | 'Finance' | 'SEO',
    action: 'view' | 'create' | 'edit' | 'delete'
  ): boolean => {
    if (!user) return false;
    
    // Super Admin & Admin bypass all checks
    if (user.role === 'Super Admin' || user.role === 'Admin') return true;

    // Look up active user role permissions matrix
    const roleConfig = roles.find((r) => r.name.toLowerCase() === user.role.toLowerCase());
    if (!roleConfig) {
      // Hardcoded fallback checks for safety
      if (user.role === 'Developer' && module === 'PM' && (action === 'view' || action === 'edit')) return true;
      if (user.role === 'Finance' && module === 'Finance') return true;
      if (user.role === 'SEO Executive' && module === 'SEO') return true;
      return false;
    }

    const modPerm = roleConfig.permissions[module];
    if (!modPerm) return false;
    return !!modPerm[action];
  };

  // Dynamic Currency Formatter
  const formatCurrency = (amount: number): string => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: settings.currency === 'INR' ? 'INR' : settings.currency === 'EUR' ? 'EUR' : 'USD',
      maximumFractionDigits: 0,
    });
    return formatter.format(amount);
  };

  return (
    <CustomizationContext.Provider
      value={{
        settings,
        updateSettings,
        resetBranding,
        roles,
        addRole,
        updateRole,
        deleteRole,
        usersList,
        updateUserRole,
        hasPermission,
        formatCurrency,
        demoMode,
        setDemoMode,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
};
