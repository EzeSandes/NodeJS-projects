import fs from 'fs/promises';
import path from 'path';

/*
|--------------------------------------------------------------------------
| Remove file safely
|--------------------------------------------------------------------------
*/
export async function removeFile(filePath) {
  try {
    const absolutePath = path.resolve(
      'src/public',
      filePath.replace('/images', 'images')
    );
    await fs.unlink(absolutePath);
  } catch (error) {
    console.error('Error removing file:', error);
  }
}
