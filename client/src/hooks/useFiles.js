import { createEffect } from "solid-js";
import { useFileContext } from "../contexts/FileContext";
import { fileService } from "../api/fileService";

export function useFiles() {
  const { state, setState } = useFileContext();

  const fetchFiles = async () => {
    setState("loading", true);
    setState("error", null);
    
    try {
      const result = await fileService.getFiles();
      if (result.success) {
        setState("files", result.files);
      } else {
        setState("error", result.message);
      }
    } catch (error) {
      setState("error", error.message);
    } finally {
      setState("loading", false);
    }
  };

  createEffect(() => {
    fetchFiles();
  });

  return {
    files: () => state.files,
    loading: () => state.loading,
    error: () => state.error,
    refetch: fetchFiles
  };
} 