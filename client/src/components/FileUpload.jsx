import { createSignal } from "solid-js";
import { fileService } from "../api/fileService";
import { useFileContext } from "../contexts/FileContext";

export default function FileUpload() {
  const [uploading, setUploading] = createSignal(false);
  const { setState } = useFileContext();

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await fileService.uploadFile(file);
      if (result.success) {
        const filesData = await fileService.getFiles();
        setState("files", filesData.files);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{
      padding: '1rem',
      border: '2px dashed #ccc',
      borderRadius: '4px'
    }}>
      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading()}
        style={{
          width: '100%',
          cursor: uploading() ? 'not-allowed' : 'pointer'
        }}
      />
    </div>
  );
} 