import type { Access } from 'payload/config';

export const isAdmin: Access = ({ req: { user } }) => user?.role === 'admin';
