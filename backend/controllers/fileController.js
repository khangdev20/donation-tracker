import { put } from "@vercel/blob";

class FileController {
    async uploadFiles(req, res) {
        try {
            const files = req.files;

            if (!files || files.length === 0) {
                res.status(400).json({
                    statusCode: 400,
                    success: false,
                    message: "No files provided",
                });
                return;
            }

            const uploadPromises = files.map(async (file) => {
                const blob = await put(file.originalname, file.buffer, {
                    access: "public",
                    addRandomSuffix: true,
                });
                return blob.url;
            });

            const uploadedImages = await Promise.all(uploadPromises);

            res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Files uploaded successfully",
                data: uploadedImages,
            });
        } catch (error) {
            res.status(500).json({
                statusCode: 500,
                success: false,
                message: error.message,
            });
        }
    }
}

export default new FileController();
