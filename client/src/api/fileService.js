const API_URL = 'http://localhost:3000';

export const fileService = {
  async getFiles() {
    try {
      console.log('Fetching files list');
      const response = await fetch(`${API_URL}/files`);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Get files error response:', errorData);
        throw new Error(`Failed to fetch files: ${errorData}`);
      }

      const result = await response.json();
      console.log('Files list:', result);
      return result;
    } catch (error) {
      console.error('Get files error details:', error);
      throw error;
    }
  },

  async uploadFile(file) {
    try {
      // Convert file to base64
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result
            .replace('data:', '')
            .replace(/^.+,/, '');
          resolve(base64String);
        };
        reader.readAsDataURL(file);
      });

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: base64,
          filename: file.name,
          contentType: file.type
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.json();
      console.log('Upload success:', result);
      return result;

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  async deleteFile(fileId) {
    try {
      console.log('Attempting to delete file:', fileId);
      const response = await fetch(`${API_URL}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: fileId })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Delete error response:', errorData);
        throw new Error(`Delete failed: ${errorData}`);
      }

      const result = await response.json();
      console.log('Delete success:', result);
      return result;
    } catch (error) {
      console.error('Delete error details:', error);
      throw error;
    }
  },

  async downloadFile(fileId) {
    try {
      const response = await fetch(`${API_URL}/files/${fileId}/download`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      // Get the original filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'download';  // default filename
      
      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="([^"]+)"/);
        if (matches && matches[1]) {
            filename = matches[1];
        }
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      
      // Set download attribute to force the original filename
      a.href = url;
      a.download = filename;  // This should be the original filename
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);

      return true;
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }
}; 