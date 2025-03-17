import { File } from "../models/fileModel.js";
import minioClient from "../../storages/minio.js";
import { Buffer } from "buffer";

export default class FileController {
    constructor() {
        this.minioClient = minioClient.getClient();
        this.bucketName = minioClient.getBucketName();
    }

    async initBucketListener() {
        try {
            await minioClient.initBucket();

            // List all objects in bucket and sync with database
            const objects = await this.minioClient.listObjects(this.bucketName, '', true);
            for await (const obj of objects) {
                const stat = await this.minioClient.statObject(this.bucketName, obj.name);
                await this.syncFileToDb(obj.name, stat);
            }

            console.log('Initial sync completed');
        } catch (error) {
            console.error('Bucket listener error:', error);
        }
    }

    async syncFileToDb(filename, stat) {
        try {
            const existingFile = await File.findOne({ filename });
            if (!existingFile) {
                await File.create({
                    filename,
                    path: `/${this.bucketName}/${filename}`,
                    size: stat.size,
                    contentType: stat.metaData['content-type'] || 'application/octet-stream',
                    uploadedAt: stat.lastModified
                });
                console.log(`Synced file: ${filename}`);
            }
        } catch (error) {
            console.error('Sync error:', error);
        }
    }

    async uploadFile(data) {
        try {
            const { file, filename, contentType = 'application/octet-stream', size } = data;
            
            if (!filename || !file) {
                return { 
                    success: false, 
                    message: "Missing required file data" 
                };
            }

            // Upload to MinIO
            await this.minioClient.putObject(
                this.bucketName,
                filename,
                file,
                size,
                { 'Content-Type': contentType }
            );

            // Save to MongoDB
            const fileDoc = await File.create({
                filename,
                path: `/${this.bucketName}/${filename}`,
                size,
                contentType,
                uploadedAt: new Date()
            });

            // Get updated file list
            const files = await File.find().sort({ uploadedAt: -1 });

            return { 
                success: true, 
                message: "File uploaded successfully",
                file: fileDoc,
                files: files
            };
        } catch (error) {
            console.error('Upload error:', error);
            return { 
                success: false, 
                message: "File upload failed", 
                error: error.message 
            };
        }
    }

    async getFiles() {
        try {
            const files = await File.find().sort({ uploadedAt: -1 });
            return {
                success: true,
                files
            };
        } catch (error) {
            console.error('Get files error:', error);
            return {
                success: false,
                message: "Failed to get files",
                error: error.message
            };
        }
    }

    async deleteFile(body) {
        try {
            const { id } = body;
            
            if (!id) {
                return { success: false, message: "No file ID provided" };
            }

            const file = await File.findById(id);
            if (!file) {
                return { success: false, message: "File not found" };
            }

            try {
                await this.minioClient.removeObject(this.bucketName, file.filename);
            } catch (minioError) {
                console.error('MinIO deletion error:', minioError);
            }

            await File.findByIdAndDelete(id);

            return { success: true, message: "File deleted successfully" };
        } catch (error) {
            console.error('Delete error:', error);
            return { success: false, message: "File deletion failed.", error: error.message };
        }
    }

    async downloadFile(fileId) {
        try {
            const file = await File.findById(fileId);
            if (!file) {
                return {
                    success: false,
                    message: "File not found"
                };
            }

            // Store the original filename in metadata
            const fileData = await this.minioClient.getObject(
                this.bucketName,
                file.filename
            );

            return {
                success: true,
                file: fileData,
                filename: file.filename,  // This is the original filename from MongoDB
                contentType: file.contentType
            };
        } catch (error) {
            console.error('Download error:', error);
            return {
                success: false,
                message: "Download failed",
                error: error.message
            };
        }
    }
}