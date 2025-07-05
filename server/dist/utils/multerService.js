"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_s3_1 = __importDefault(require("multer-s3"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
class FileUpload {
    constructor(options) {
        this.options = options;
        this.upload = this.createUploadMiddleware(options);
    }
    createUploadMiddleware(options) {
        const s3 = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
        const storage = (0, multer_s3_1.default)({
            s3: s3,
            bucket: process.env.AWS_BUCKET_NAME,
            contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
            key: (req, file, cb) => {
                const uniqueSuffix = (0, uuid_1.v4)();
                const ext = path_1.default.extname(file.originalname);
                const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
                cb(null, `${options.uploadDir}/${filename}`);
            },
        });
        return (0, multer_1.default)({
            storage,
            limits: { fileSize: options.fileSizeLimit },
            fileFilter: (req, file, cb) => {
                const allowedExtensions = options.fileTypes.map((ext) => `.${ext.toLowerCase()}`);
                const allowedMimeTypes = [
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "image/jpeg",
                    "image/png",
                    "text/html",
                ];
                const fileExt = path_1.default.extname(file.originalname).toLowerCase();
                const fileMime = file.mimetype;
                if (allowedExtensions.includes(fileExt) &&
                    allowedMimeTypes.includes(fileMime)) {
                    cb(null, true);
                }
                else {
                    cb(new Error(`Only ${options.fileTypes.join(", ")} files are allowed`));
                }
            },
        });
    }
    // Keep existing methods unchanged
    uploadFile(fieldName) {
        return this.upload.single(fieldName);
    }
    uploadMultiple(fieldName, maxCount) {
        return this.upload.array(fieldName, maxCount);
    }
    uploadFields(fields) {
        return this.upload.fields(fields);
    }
}
exports.FileUpload = FileUpload;
