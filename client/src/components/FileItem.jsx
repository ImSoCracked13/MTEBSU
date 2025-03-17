import { createSignal, Show } from 'solid-js';
import { fileService } from "../api/fileService";
import { useFileContext } from "../contexts/FileContext";
import { formatFileSize, formatDate } from "../utils/formatters";

export default function FileItem(props) {
  const { setState } = useFileContext();
  const [showTooltip, setShowTooltip] = createSignal(false);

  const handleDelete = async () => {
    try {
      const result = await fileService.deleteFile(props.file._id);
      if (result.success) {
        const filesData = await fileService.getFiles();
        setState("files", filesData.files);
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div 
      class="file-item"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div class="file-content">
        <h3 class="file-name">{props.file.filename}</h3>
        <div class="file-info">
          <span>{formatFileSize(props.file.size)}</span>
          <span class="separator">•</span>
          <span>{formatDate(props.file.uploadedAt)}</span>
        </div>
      </div>
      <button
        class="button button-delete"
        onClick={handleDelete}
      >
        Delete
      </button>

      <Show when={showTooltip()}>
        <div class="tooltip">
          <div class="tooltip-item">
            <strong>File ID:</strong> {props.file._id}
          </div>
          <div class="tooltip-item">
            <strong>MIME Type:</strong> {props.file.mimetype}
          </div>
          <div class="tooltip-item">
            <strong>Uploaded:</strong> {new Date(props.file.uploadedAt).toLocaleString()}
          </div>
        </div>
      </Show>
    </div>
  );
}