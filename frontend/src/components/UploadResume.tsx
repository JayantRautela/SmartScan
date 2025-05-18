import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Upload, FileCheck, File, XCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface PdfUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UploadResume = ({ open, onOpenChange }: PdfUploadDialogProps) => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed", {
        icon: <XCircle className="text-red-600 w-5 h-5" />,
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("PDF cannot be larger than 5MB", {
        icon: <XCircle className="text-red-600 w-5 h-5" />,
      });
      return;
    }

    setSelectedFile(file);
    setUploadProgress(0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 90) {
        progress = 90;
        clearInterval(interval);
      }
      setUploadProgress(Math.min(progress, 90));
    }, 300);

    return interval;
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsUploading(true);
    const progressInterval = simulateProgress();

    try {
      const response: any = await axios.post(
        "",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      const analysis = response.data.analysis;
      localStorage.setItem("resumeAnalysis", JSON.stringify(analysis));

      setTimeout(() => {
        setSelectedFile(null);
        setIsUploading(false);
        onOpenChange(false);
        navigate("/resume-analysis", { state: { analysis } });
      }, 500);
    } catch (error: any) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(0);
      console.log(error);
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(message, {
        icon: <XCircle className="text-red-600 w-5 h-5" />,
      });
    }
  };

  const renderFilePreview = () => {
    if (!selectedFile) return null;

    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <File className="h-16 w-16 text-blue-500 mb-2" />
          <FileCheck className="absolute bottom-1 right-0 h-8 w-8 text-green-500 bg-white rounded-full p-1" />
        </div>
        <p className="font-medium text-gray-900 dark:text-gray-100">
          {selectedFile.name}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Upload your resume
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Upload your PDF resume to get professional analysis and improvement
            suggestions.
          </DialogDescription>
        </DialogHeader>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
        />

        <div
          className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
            ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                : selectedFile
                ? "border-green-300 bg-green-50/50 dark:bg-green-950/20"
                : "border-gray-300 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-600"
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFilePicker}
        >
          <div>
            {selectedFile ? (
              renderFilePreview()
            ) : (
              <div>
                <Upload
                  className={`h-12 w-12 mb-2 mx-auto ${
                    isDragging ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {isDragging
                    ? "Drop your PDF here"
                    : "Drag and drop your PDF here"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to browse files
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Maximum file size: 5MB
                </p>
              </div>
            )}
          </div>
        </div>

        {isUploading && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Uploading...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <DialogFooter className="mt-4 flex justify-between gap-2">
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="relative overflow-hidden cursor-pointer"
          >
            {selectedFile
              ? isUploading
                ? "Uploading..."
                : "Upload Resume"
              : "Select a PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadResume;