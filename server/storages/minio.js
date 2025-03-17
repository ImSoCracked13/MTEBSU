import { Client } from "minio";
import * as dotenv from "dotenv";
dotenv.config();

// MinIO client singleton
class MinioClient {
    constructor() {
        if (MinioClient.instance) {
            return MinioClient.instance;
        }

        this.minioClient = new Client({
            endPoint: process.env.MINIO_ENDPOINT,
            port: parseInt(process.env.MINIO_PORT),
            useSSL: process.env.MINIO_USE_SSL === 'true',
            accessKey: process.env.MINIO_ACCESS_KEY,
            secretKey: process.env.MINIO_SECRET_KEY
        });

        this.bucketName = process.env.MINIO_BUCKET_NAME;
        MinioClient.instance = this;
    }

    // Initialize bucket
    async initBucket() {
        try {
            const bucketExists = await this.minioClient.bucketExists(this.bucketName);
            if (!bucketExists) {
                await this.minioClient.makeBucket(this.bucketName);
                console.log(`Created new MinIO bucket: ${this.bucketName}`);
            } else {
                console.log(`Using existing MinIO bucket: ${this.bucketName}`);
            }
            console.log('Connected to MinIO');
            return true;
        } catch (error) {
            console.error('MinIO connection error:', error);
            return false;
        }
    }

    getClient() {
        return this.minioClient;
    }

    getBucketName() {
        return this.bucketName;
    }
}

export default new MinioClient(); 