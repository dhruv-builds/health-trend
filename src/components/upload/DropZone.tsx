import { useCallback, useState, useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export function DropZone({ onFilesSelected, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected, disabled]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      file => file.type === 'application/pdf'
    );
    if (files.length > 0) {
      onFilesSelected(files);
    }
    e.target.value = '';
  }, [onFilesSelected]);

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  return (
    <div
      data-dropzone
      className={cn(
        'relative rounded-xl border-2 border-dashed p-8 transition-all duration-200 cursor-pointer',
        'flex flex-col items-center justify-center gap-4 text-center',
        isDragging 
          ? 'border-primary bg-primary/5 scale-[1.02]' 
          : 'border-border hover:border-primary/50 hover:bg-accent/30',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        multiple
        className="sr-only"
        onChange={handleFileInput}
        disabled={disabled}
      />

      <div className={cn(
        'w-16 h-16 rounded-full flex items-center justify-center transition-colors',
        isDragging ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary'
      )}>
        <Upload className="w-7 h-7" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          {isDragging ? 'Drop your PDFs here' : 'Upload Blood Reports'}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Drag and drop your blood report PDFs, or click to browse. 
          We'll extract your markers and show trends.
        </p>
      </div>

      <div className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
        'bg-primary text-primary-foreground hover:bg-primary/90',
      )}>
        <FileText className="w-4 h-4" />
        Browse Files
      </div>

      <p className="text-xs text-muted-foreground">
        PDF files only • No data stored on our servers
      </p>
    </div>
  );
}
