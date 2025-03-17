export const FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  SPREADSHEET: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size exceeds 50MB limit',
  INVALID_TYPE: 'File type not supported',
  UPLOAD_FAILED: 'Failed to upload file',
  DELETE_FAILED: 'Failed to delete file',
}; 