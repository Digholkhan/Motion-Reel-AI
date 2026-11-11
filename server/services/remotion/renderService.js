import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RENDERS_DIR = path.resolve(__dirname, '../../data/renders');

if (!fs.existsSync(RENDERS_DIR)) {
  fs.mkdirSync(RENDERS_DIR, { recursive: true });
}

// Active render jobs map
const activeJobs = new Map();

// Detect local Chrome or Edge
function getChromiumExecutablePath() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  if (fs.existsSync(chromePath)) return chromePath;
  if (fs.existsSync(edgePath)) return edgePath;
  return undefined;
}

export const renderService = {
  getJobStatus(jobId) {
    return activeJobs.get(jobId) || null;
  },

  getAllRenders() {
    try {
      const files = fs.readdirSync(RENDERS_DIR).filter(f => f.endsWith('.mp4'));
      return files.map(file => {
        const fullPath = path.join(RENDERS_DIR, file);
        const stats = fs.statSync(fullPath);
        return {
          filename: file,
          url: `/api/render/download/${file}`,
          sizeBytes: stats.size,
          sizeMb: (stats.size / (1024 * 1024)).toFixed(2),
          createdAt: stats.birthtime
        };
      }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
      console.error('Error reading renders dir:', err);
      return [];
    }
  },

  async startRenderJob(project, options = {}) {
    const jobId = `job-${Date.now()}`;
    const outputFilename = `motionforge-${project.id}-${Date.now()}.mp4`;
    const outputPath = path.join(RENDERS_DIR, outputFilename);

    const job = {
      id: jobId,
      projectId: project.id,
      title: project.title,
      status: 'bundling', // bundling | rendering | completed | failed
      progress: 0,
      renderedFrames: 0,
      totalFrames: 0,
      outputFilename,
      outputPath,
      downloadUrl: `/api/render/download/${outputFilename}`,
      error: null,
      startedAt: new Date().toISOString(),
      completedAt: null
    };

    activeJobs.set(jobId, job);

    // Run async render pipeline
    (async () => {
      try {
        console.log(`[RenderService] Starting job ${jobId} for project "${project.title}"`);
        
        const entryPoint = path.resolve(__dirname, '../../../src/remotion/register.js');
        job.status = 'bundling';
        job.progress = 5;

        console.log(`[RenderService] Bundling composition from: ${entryPoint}`);
        const bundled = await bundle({
          entryPoint,
          webpackOverride: (config) => config
        });

        job.status = 'rendering';
        job.progress = 15;

        // Calculate dimensions from aspect ratio
        let width = 1920;
        let height = 1080;
        if (project.aspectRatio === '9:16') {
          width = 1080;
          height = 1920;
        } else if (project.aspectRatio === '1:1') {
          width = 1080;
          height = 1080;
        }

        const fps = project.fps || 30;
        const totalDurationSec = (project.scenes || []).reduce((acc, s) => acc + (s.durationInSeconds || 5), 0) || project.durationInSeconds || 30;
        const durationInFrames = Math.max(30, Math.round(totalDurationSec * fps));

        job.totalFrames = durationInFrames;

        console.log(`[RenderService] Rendering ${durationInFrames} frames at ${fps} fps (${width}x${height})`);

        const composition = await selectComposition({
          serveUrl: bundled,
          id: 'MotionReel',
          inputProps: { project }
        });

        const browserExecutable = getChromiumExecutablePath();
        const ffmpegExecutable = ffmpegInstaller?.path || undefined;

        console.log(`[RenderService] Using Browser: ${browserExecutable || 'Puppeteer default'}`);
        console.log(`[RenderService] Using FFmpeg: ${ffmpegExecutable || 'Remotion default'}`);

        await renderMedia({
          composition: {
            ...composition,
            width,
            height,
            fps,
            durationInFrames
          },
          serveUrl: bundled,
          codec: 'h264',
          outputLocation: outputPath,
          inputProps: { project },
          ffmpegExecutable,
          chromiumOptions: {
            executablePath: browserExecutable,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
          },
          onProgress: ({ renderedFrames, encodedFrames }) => {
            const currentFrame = Math.max(renderedFrames, encodedFrames);
            const renderPercent = Math.min(95, 15 + Math.round((currentFrame / durationInFrames) * 80));
            job.progress = renderPercent;
            job.renderedFrames = currentFrame;
          }
        });

        job.progress = 100;
        job.status = 'completed';
        job.completedAt = new Date().toISOString();
        console.log(`[RenderService] Render completed successfully: ${outputFilename}`);
      } catch (err) {
        console.error(`[RenderService] Render failed:`, err);
        job.status = 'failed';
        job.error = err.message || 'Unknown render error';
        job.completedAt = new Date().toISOString();
      }
    })();

    return job;
  }
};

