import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import fileRoutes from "./api/routes/fileRoutes";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import minioClient from "./storages/minio.js";

dotenv.config();

const app = new Elysia()
    .use(cors());

// Initialize connections
Promise.all([
    // Connect to MongoDB
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err)),
    
    // Initialize MinIO bucket
    minioClient.initBucket()
])
.then(() => {
    // Add routes
    fileRoutes(app);
    app.listen(process.env.PORT);
    console.log(`Server running on http://localhost:${process.env.PORT}/files`);
    console.log(`File storage available at http://localhost:9001/browser/files`);
})
.catch(err => console.error('Initialization error:', err));
