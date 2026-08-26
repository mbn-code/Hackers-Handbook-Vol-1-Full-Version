// migrate-handbook-pages.mjs
// Script to migrate Markdown files from src/pages/en to Astro Content Collection in src/content/handbook
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const SRC_DIR = path.resolve('src/pages/en');
const DEST_DIR = path.resolve('src/content/handbook');

const DIFFICULTY_DEFAULT = 'beginner'; // Change as needed

async function migrate() {
  const files = await fs.readdir(SRC_DIR);
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const srcPath = path.join(SRC_DIR, file);
    const destPath = path.join(DEST_DIR, file);
    const raw = await fs.readFile(srcPath, 'utf8');
    const { data, content } = matter(raw);
    // Add/normalize required fields
    const newData = {
      title: data.title || path.basename(file, '.md'),
      difficulty: data.difficulty || DIFFICULTY_DEFAULT,
      tags: Array.isArray(data.tags) ? data.tags : [],
    };
    const newFrontmatter = '---\n' +
      Object.entries(newData).map(([k, v]) => `${k}: ${Array.isArray(v) ? '[' + v.map(x => `'${x}'`).join(', ') + ']' : `'${v}'`}`).join('\n') +
      '\n---\n';
    await fs.writeFile(destPath, newFrontmatter + '\n' + content);
    console.log(`Migrated: ${file}`);
  }
}

migrate().catch(console.error);
