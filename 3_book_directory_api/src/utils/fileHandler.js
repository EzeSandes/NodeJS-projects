import fs from 'fs/promises';
import path from 'path';

/*
|--------------------------------------------------------------------------
| JSON database path
|--------------------------------------------------------------------------
*/
const dataPath = path.resolve('src/data/books.json');

/*
|--------------------------------------------------------------------------
| Read JSON file
|--------------------------------------------------------------------------
*/
export async function readJSON() {
  const data = await fs.readFile(dataPath, 'utf-8');
  return JSON.parse(data);
}

/*
|--------------------------------------------------------------------------
| Write JSON file
|--------------------------------------------------------------------------
*/
export async function writeJSON(data) {
  await fs.writeFile(dataPath, JSON.stringify(data), 'utf-8');
}
