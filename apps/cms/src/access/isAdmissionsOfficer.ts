import type { Access } from 'payload/config';

export const isAdmissionsOfficer: Access = ({ req: { user } }) =>
  user?.role === 'admin' || user?.role === 'admissions';
