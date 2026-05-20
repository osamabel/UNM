import 'dotenv/config';
import express from 'express';
import payload from 'payload';

const app = express();

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET!,
    express: app,
    onInit: () => {
      payload.logger.info(`UNM CMS started — admin at ${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin`);
    },
  });

  // Mount admin at /studio in production as a defense-in-depth measure.
  if (process.env.NODE_ENV === 'production') {
    app.use('/studio', (req, res, next) => {
      req.url = req.url.replace(/^\/studio/, '/admin');
      next();
    });
  }

  const port = Number(process.env.PORT ?? 3001);
  app.listen(port, () => {
    payload.logger.info(`Listening on :${port}`);
  });
};

start();
