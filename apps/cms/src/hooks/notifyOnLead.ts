import type { CollectionAfterChangeHook } from 'payload/types';

export const notifyOnLead: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc;
  req.payload.logger.info({ leadId: doc.id, email: doc.email }, 'New lead');
  // Email/CRM notification is handled in the Next.js /api/leads route to keep
  // this hook idempotent and free of third-party deps.
  return doc;
};
