import { createContext, useContext, createSignal, onMount } from "solid-js";
import { fileService } from "../api/fileService";

const FileContext = createContext();

export function FileProvider(props) {
  const [files, setFiles] = createSignal([]);
  const [uploading, setUploading] = createSignal(false);
  const [error, setError] = createSignal(null);

  // Fetch files when the provider mounts
  onMount(async () => {
    try {
      const response = await fileService.getFiles();
      if (response && response.files) {
        setFiles(response.files);
      }
    } catch (err) {
      setError('Failed to load files');
      console.error('Failed to load files:', err);
    }
  });

  const value = {
    files,
    setFiles,
    uploading,
    setUploading,
    error,
    setError,
  };

  return (
    <FileContext.Provider value={value}>
      {props.children}
    </FileContext.Provider>
  );
}

export function useFileContext() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
}