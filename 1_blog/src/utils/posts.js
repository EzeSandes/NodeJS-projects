import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../data/posts.json');

export function getPosts() {
  const data = fs.readFileSync(filePath, 'utf-8');

  return JSON.parse(data);
}

export function savePosts(posts) {
  fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
}

export function getPostBySlug(slug) {
  const posts = getPosts();

  return posts.find(post => post.slug === slug && post.published);
}
