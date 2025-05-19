import React, { useState, useRef } from "react";
import { Upload, X, FileText, Check } from "lucide-react";

interface FileUploaderProps {
  acceptedFileTypes: string;
  maxFileSizeMB: number;
  onFileSelected: (file: File) => void;
  label?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  acceptedFileTypes,
  maxFileSizeMB,
  onFileSelected,
  label = "Upload File",
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    setError(null);

    // Check file type
    if (!selectedFile.type.match(acceptedFileTypes)) {
      setError(
        `Invalid file type. Please upload ${acceptedFileTypes.replace(
          "application/",
          ""
        )}`
      );
      return;
    }

    // Check file size
    if (selectedFile.size > maxFileSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxFileSizeMB}MB limit`);
      return;
    }

    setFile(selectedFile);
    onFileSelected(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            type="file"
            className="hidden"
            accept={acceptedFileTypes}
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            ref={fileInputRef}
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm font-medium text-gray-900">{label}</p>
          <p className="mt-1 text-xs text-gray-500">
            Drag and drop or click to browse
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Max size: {maxFileSizeMB}MB | Format:{" "}
            {acceptedFileTypes.replace("application/", "").toUpperCase()}
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
                <span className="inline-flex items-center ml-2 text-green-600">
                  <Check className="h-3 w-3 mr-1" /> Ready to upload
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FileUploader;
