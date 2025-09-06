
import React, { useCallback, useState } from 'react';
import { FileUp } from './Icons';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if(e.dataTransfer.files[0].type === 'application/pdf') {
        onFileSelect(e.dataTransfer.files[0]);
      }
      e.dataTransfer.clearData();
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full max-w-lg mx-auto p-12 border-2 border-dashed rounded-xl transition-all duration-300 ${isDragging ? 'border-cyan-400 bg-gray-800' : 'border-gray-600 hover:border-cyan-500 bg-gray-800/50'}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
        accept=".pdf"
      />
      <FileUp className="w-16 h-16 text-gray-500 mb-4" />
      <p className="text-xl font-semibold text-gray-300">
        Drag & drop a PDF here
      </p>
      <p className="text-gray-500">or</p>
      <label
        htmlFor="file-upload"
        className="mt-2 px-6 py-2 bg-cyan-600 text-white rounded-md font-semibold cursor-pointer hover:bg-cyan-700 transition-colors"
      >
        Browse File
      </label>
      <p className="text-xs text-gray-500 mt-4">Maximum file size: 25MB</p>
    </div>
  );
};

export default FileUpload;
