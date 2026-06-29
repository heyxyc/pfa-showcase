import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import fs from 'fs';

function saveCoursesPlugin() {
  return {
    name: 'save-courses-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/save-courses' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              if (Array.isArray(data)) {
                // Generate src/data.ts file content, replacing any outdated emails
                const cleanedData = data.map(course => ({
                  ...course,
                  enquiryEmail: "academy@redcross.sg"
                }));
                const fileContent = `import { Course } from "./types";\n\nexport const initialCourses: Course[] = ${JSON.stringify(cleanedData, null, 2)};\n`;
                fs.writeFileSync(path.resolve(__dirname, './src/data.ts'), fileContent, 'utf-8');
                console.log('[Vite Plugin] Successfully saved courses from browser into src/data.ts');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
              } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Data must be an array' }));
              }
            } catch (err) {
              console.error('[Vite Plugin] Failed to update src/data.ts:', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), saveCoursesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
