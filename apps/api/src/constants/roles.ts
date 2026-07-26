export const DEFAULT_ROLES = [
  'Super Admin',
  'Admin',
  'Project Manager',
  'Business Analyst',
  'Developer',
  'QA/Tester',
  'SEO Executive',
  'Finance',
  'Client'
] as const;

export type RoleName = typeof DEFAULT_ROLES[number];
