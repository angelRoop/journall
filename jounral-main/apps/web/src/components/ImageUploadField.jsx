import React, { useState, useRef } from 'react';
import { UploadCloud, X, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { uploadTradeImages, updateTrade } from '@/lib/apiClient.js';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const ImageUploadField = ({ 
  label, 
  field, 
  tradeId, 
  currentImage, 
  record,
  onFileSelect,
  onUploadSuccess
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);
  const fileInputRef = useRef(null);

  const displayUrl = localPreview || currentImage || null;

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateAndProcessFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG, PNG, WEBP)');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image size must be less than 20MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);

    if (tradeId) {
      // Immediate upload for existing records
      setIsUploading(true);
      try {
        const updatedRecord = await uploadTradeImages(tradeId, { [field]: file });
        toast.success(`${label} uploaded successfully`);
        if (onUploadSuccess) onUploadSuccess(updatedRecord);
      } catch (error) {
        console.error(error);
        toast.error(`Failed to upload ${label}`);
        setLocalPreview(null); // Revert preview on failure
      } finally {
        setIsUploading(false);
      }
    } else {
      // Pass file up to form for new records
      if (onFileSelect) onFileSelect(field, file, previewUrl);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    
    if (tradeId && currentImage && !localPreview) {
      setIsUploading(true);
      try {
        const updatedRecord = await updateTrade(tradeId, { [field]: null });
        toast.success(`${label} removed`);
        if (onUploadSuccess) onUploadSuccess(updatedRecord);
      } catch (error) {
        toast.error(`Failed to remove ${label}`);
      } finally {
        setIsUploading(false);
      }
    } else {
      setLocalPreview(null);
      if (onFileSelect) onFileSelect(field, null, null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2 w-full">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      
      <div 
        className="upload-zone"
        data-dragging={isDragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/jpeg,image/png,image/webp" 
          onChange={handleFileChange}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <span className="text-sm font-medium">Uploading...</span>
          </div>
        ) : displayUrl ? (
          <>
            <img src={displayUrl} alt={`${label} preview`} className="upload-preview" />
            <div className="upload-overlay">
              <Button size="sm" variant="secondary" className="h-8 gap-1 shadow-sm" onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}>
                <RefreshCw className="w-3 h-3" /> Replace
              </Button>
              <Button size="sm" variant="destructive" className="h-8 gap-1 shadow-sm" onClick={handleDelete}>
                <X className="w-3 h-3" /> Remove
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-muted-foreground p-6 text-center">
            <div className="p-3 bg-background rounded-full shadow-sm mb-3">
              <UploadCloud className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium mb-1">Click or drag image here</p>
            <p className="text-xs opacity-70">Max 20MB (JPEG, PNG, WEBP)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadField;