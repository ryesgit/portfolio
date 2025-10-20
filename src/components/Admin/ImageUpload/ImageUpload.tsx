import { useState, useRef } from 'react';
import { uploadBlogImage, generateImageMarkdown } from '../../../services/storageService';
import './ImageUpload.css';

interface ImageUploadProps {
  onImageUploaded: (markdown: string) => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
}

const ImageUpload = ({ onImageUploaded }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    // Handle multiple files
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    try {
      for (const file of validFiles) {
        const result = await uploadBlogImage(file);
        if (result) {
          const markdown = generateImageMarkdown(result.url, file.name.split('.')[0]);
          onImageUploaded(markdown);
        } else {
          alert(`Failed to upload ${file.name}`);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="image-upload-inline">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      
      <button
        type="button"
        onClick={handleClick}
        className="upload-button"
        disabled={uploading}
      >
        {uploading ? (
          <>
            <div className="upload-spinner-small"></div>
            Uploading...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
            Upload Images
          </>
        )}
      </button>
    </div>
  );
};

export default ImageUpload;