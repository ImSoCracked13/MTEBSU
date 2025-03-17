import { Show, createSignal } from 'solid-js';
import { useFileContext } from '../contexts/FileContext';
import { fileService } from '../api/fileService';

export function UploadSection() {
  const { uploading, setUploading, error, setError, setFiles } = useFileContext();
  const [selectedFile, setSelectedFile] = createSignal(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile()) return;

    setUploading(true);
    setError(null);
    try {
      const uploadResult = await fileService.uploadFile(selectedFile());
      if (uploadResult.success) {
        const filesData = await fileService.getFiles();
        if (filesData && filesData.files) {
          setFiles(filesData.files);
        }
        setSelectedFile(null);
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.value = '';
      }
    } catch (err) {
      setError('Upload failed');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div class="card mb-6 p-6">
      <div class="space-y-4">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-4">
            <button
              onClick={() => document.getElementById('fileInput').click()}
              class="button button-choose"
              disabled={uploading()}
            >
              Choose File
            </button>
            <span class="text-gray-300">
              {selectedFile() ? selectedFile().name : 'No file chosen'}
            </span>
            <input
              id="fileInput"
              type="file"
              onChange={handleFileSelect}
              disabled={uploading()}
              style="display: none;"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={!selectedFile() || uploading()}
            class="button button-upload"
          >
            <Show 
              when={!uploading()} 
              fallback={
                <div class="flex items-center gap-2">
                  <div class="i-gg-spinner animate-spin" />
                  Uploading...
                </div>
              }
            >
              <div class="flex items-center gap-2">
                <div class="i-heroicons-cloud-arrow-up" />
                Upload
              </div>
            </Show>
          </button>
        </div>

        <Show when={selectedFile()}>
          <div class="flex items-center justify-between bg-[#40444b] p-3 rounded-lg">
            <div class="flex items-center gap-2">
              <div class="i-heroicons-document text-gray-300" />
              <span class="text-sm font-medium text-gray-200">
                {selectedFile()?.name}
              </span>
              <span class="text-xs text-gray-400">
                ({Math.round(selectedFile()?.size / 1024)} KB)
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                const fileInput = document.getElementById('fileInput');
                if (fileInput) fileInput.value = '';
              }}
              class="text-gray-400 hover:text-gray-200"
              title="Clear selection"
            >
              <div class="i-heroicons-x-mark" />
            </button>
          </div>
        </Show>

        <Show when={error()}>
          <div class="mt-3 text-sm text-red-400 bg-[#40444b] p-2 rounded">
            {error()}
          </div>
        </Show>
      </div>
    </div>
  );
} 