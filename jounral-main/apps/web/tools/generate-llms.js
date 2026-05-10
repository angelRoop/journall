import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const pages = [];
const pagesDir = path.resolve(rootDir, 'src/pages');

if (fs.existsSync(pagesDir)) {
  for (const file of fs.readdirSync(pagesDir)) {
    if (/\.(jsx?|tsx?)$/.test(file)) {
      pages.push(file.replace(/Page\.(jsx?|tsx?)$/, '').replace(/\.(jsx?|tsx?)$/, ''));
    }
  }
}

const llmsContent = `# Trading Journal

A web application for logging, tracking, and analyzing trades. Users can record trade details including symbols, entry/exit points, emotions, tags, and session notes, then review statistics and performance over time.

## Pages

${pages.map(p => `- ${p}`).join('\n')}

## Features

- Trade entry with symbol, direction, entry/exit price, quantity, and PnL
- Emotional state tracking per trade
- Tagging system for categorizing trades
- Dashboard with trade history and live summary
- Statistics page with charts and symbol-level analysis
- User authentication via Supabase

## Technology

- React 18 with Vite
- Tailwind CSS with shadcn/ui components
- Supabase for authentication and data persistence
- Recharts for data visualization
`;

fs.writeFileSync(path.join(publicDir, 'llms.txt'), llmsContent);
console.log('Generated public/llms.txt');
