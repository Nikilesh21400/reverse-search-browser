import { writeTextFile, BaseDirectory } from '@tauri-apps/api/fs';
import { download } from '@tauri-apps/api/http';

export async function handleFileDownload(url: string, filename: string) {
  const response = await download(url, {
    file: {
      path: filename,
      directory: BaseDirectory.Download
    },
    onProgress: (progress) => {
      console.log(`Download progress: ${progress}`);
    }
  });
  console.log('Downloaded to:', response.path);
}
