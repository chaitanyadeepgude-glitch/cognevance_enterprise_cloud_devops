import JSZip from 'jszip';
import { PROJECT_FILES } from '../data/projectFiles';

/**
 * Packages all project files into a downloadable ZIP archive.
 */
export async function downloadProjectZip(onProgress?: (progress: number) => void): Promise<void> {
  const zip = new JSZip();

  // Root folder in the zip archive
  const root = zip.folder("cognevance_enterprise_cloud_devops");

  if (!root) {
    throw new Error("Failed to create ZIP directory root");
  }

  // Populate files into zip structure
  PROJECT_FILES.forEach((file) => {
    root.file(file.path, file.content);
  });

  // Generate blob
  const content = await zip.generateAsync({ type: "blob" }, (metadata) => {
    if (onProgress) {
      onProgress(metadata.percent);
    }
  });

  // Trigger browser download
  const url = URL.createObjectURL(content);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "cognevance_enterprise_cloud_devops.zip";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
