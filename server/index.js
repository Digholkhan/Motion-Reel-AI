import express from 'express';
import cors from 'cors';
import projectsRouter from './routes/projects.js';
import aiRouter from './routes/ai.js';
import voiceRouter from './routes/voice.js';
import renderRouter from './routes/render.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Route Mounts
app.use('/api/projects', projectsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/voice', voiceRouter);
app.use('/api/render', renderRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    engine: 'MotionForge AI',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`🚀 MotionForge AI Server running on http://localhost:${PORT}`);
  console.log(`📡 Ready for AI generation and Remotion rendering`);
  console.log(`========================================\n`);
});

