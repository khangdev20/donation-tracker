import { Router } from "express";
import multer from "multer";
import FileController from "../controllers/fileController.js";
import validationMiddleware from "../middleware/validationMiddleware.js";
import { uploadMultipleFilesValidation } from "../utils/validation.js";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post(
    "/upload",
    upload.array("files", 10),
    uploadMultipleFilesValidation,
    validationMiddleware.handler,
    FileController.uploadFiles.bind(FileController)
);

export default router;
