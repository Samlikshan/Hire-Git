import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { RequestHandler } from "express";

interface IFileUploadOptions {
  fileTypes: string[];
  fileSizeLimit: number;
  uploadDir: string; // This will be the S3 key prefix
}

export class FileUpload {
  private upload: multer.Multer;

  constructor(private options: IFileUploadOptions) {
    this.upload = this.createUploadMiddleware(options);
  }

  private createUploadMiddleware(options: IFileUploadOptions): multer.Multer {
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const storage = multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET_NAME!,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        const ext = path.extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        cb(null, `${options.uploadDir}/${filename}`);
      },
    });

    return multer({
      storage,
      limits: { fileSize: options.fileSizeLimit },
      fileFilter: (req, file, cb) => {
        const allowedExtensions = options.fileTypes.map(
          (ext) => `.${ext.toLowerCase()}`
        );
        const allowedMimeTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "image/jpeg",
          "image/png",
          "text/html",
        ];

        const fileExt = path.extname(file.originalname).toLowerCase();
        const fileMime = file.mimetype;
        if (
          allowedExtensions.includes(fileExt) &&
          allowedMimeTypes.includes(fileMime)
        ) {
          cb(null, true);
        } else {
          cb(
            new Error(`Only ${options.fileTypes.join(", ")} files are allowed`)
          );
        }
      },
    });
  }

  // Keep existing methods unchanged
  uploadFile(fieldName: string): RequestHandler {
    return this.upload.single(fieldName);
  }

  uploadMultiple(fieldName: string, maxCount: number): RequestHandler {
    return this.upload.array(fieldName, maxCount);
  }

  uploadFields(fields: { name: string; maxCount: number }[]): RequestHandler {
    return this.upload.fields(fields);
  }
}
