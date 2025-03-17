import { For, Show, ErrorBoundary, Suspense } from 'solid-js';
import { useFileContext } from '../contexts/FileContext';
import { fileService } from '../api/fileService';

const ErrorFallback = (props) => (
  <div class="error-fallback">
    <p>Something went wrong:</p>
    <pre>{props.error.toString()}</pre>
  </div>
);

export function FileList() {
  const { files, setFiles, setError } = useFileContext();

  const handleDelete = async (fileId) => {
    try {
      const result = await fileService.deleteFile(fileId);
      if (result.success) {
        const filesData = await fileService.getFiles();
        if (filesData && filesData.files) {
          setFiles(filesData.files);
        }
      }
    } catch (err) {
      setError('Delete failed');
      console.error('Delete error:', err);
    }
  };

  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <div class="files-section">
        <h2 class="files-title">Uploaded Files</h2>
        <Suspense fallback={<div class="loading-text">Loading files...</div>}>
          <Show
            when={files() && files().length > 0}
            fallback={<div class="empty-text">No files uploaded yet</div>}
          >
            <ul class="file-list">
              <For each={files()}>
                {(file) => (
                  <li class="file-item">
                    <span class="file-name">
                      {file.filename || file.name || 'Unnamed file'}
                    </span>
                    <div class="button-group">
                      <button
                        class="button button-download"
                        onClick={() => fileService.downloadFile(file._id || file.id)}
                      >
                        Download
                      </button>
                      <button
                        class="button button-delete"
                        onClick={() => handleDelete(file._id || file.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                )}
              </For>
            </ul>
          </Show>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}