import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';

const inputFile = process.argv[2] || '/tmp/windsurf/mcp_output_b67b5d9b39dec639.txt';
const outputDir = '/home/erol/moltbot/docs-mirror';

const data = JSON.parse(readFileSync(inputFile, 'utf-8'));

console.log(`Processing ${data.data.length} pages...`);

let saved = 0;
for (const page of data.data) {
  const url = page.metadata?.sourceURL || page.metadata?.url;
  if (!url || !page.markdown) continue;
  
  // Convert URL to file path
  let path = url.replace('https://docs.molt.bot', '').replace(/^\//, '') || 'index';
  if (!path.endsWith('.md')) path += '.md';
  
  const fullPath = join(outputDir, path);
  const dir = dirname(fullPath);
  
  // Create directory structure
  mkdirSync(dir, { recursive: true });
  
  // Add frontmatter with source URL
  const content = `---
source: ${url}
title: ${page.metadata?.title || 'Untitled'}
---

${page.markdown}`;
  
  writeFileSync(fullPath, content);
  saved++;
  console.log(`Saved: ${path}`);
}

console.log(`\nDone! Saved ${saved} files to ${outputDir}`);
