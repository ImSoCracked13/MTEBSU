import FileController from "../controllers/fileController";

export default (app) => {
    const controller = new FileController();

    app.post("/upload", 
        async ({ body }) => {
            try {
                // Log the incoming request
                console.log('Upload request received');

                if (!body || !body.file) {
                    return {
                        success: false,
                        message: "No file data provided"
                    };
                }

                // Convert base64 to buffer
                const fileData = Buffer.from(body.file, 'base64');

                const result = await controller.uploadFile({
                    file: fileData,
                    filename: body.filename,
                    contentType: body.contentType || 'application/octet-stream',
                    size: fileData.length
                });

                return result;

            } catch (error) {
                console.error('Upload route error:', error);
                return {
                    success: false,
                    message: error.message || "Upload failed"
                };
            }
        }
    );
    
    app.get("/files", 
        async () => await controller.getFiles()
    );
    
    app.delete("/delete", 
        async ({ body }) => {
            const result = await controller.deleteFile(body);
            return result;
        }
    );

    app.get("/files/:id/download", 
        async ({ params }) => {
            try {
                const result = await controller.downloadFile(params.id);
                
                if (!result.success) {
                    return result;
                }

                // Force the download with the original filename
                return new Response(result.file, {
                    headers: {
                        "Content-Type": result.contentType,
                        "Content-Disposition": `attachment; filename="${result.filename}"`,
                        "Access-Control-Expose-Headers": "Content-Disposition"
                    },
                });
            } catch (error) {
                console.error('Download route error:', error);
                return {
                    success: false,
                    message: error.message || "Download failed"
                };
            }
        }
    );
};
