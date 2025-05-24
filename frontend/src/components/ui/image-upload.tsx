import { useState } from 'react';
import { Label } from './label';
import { Input } from './input';

interface ImageUploadProps {
  label: string;
  currentImageUrl: string;
  onChange?: (file: File) => void;
  disabled?: boolean;
}

export function ImageUpload({ label, currentImageUrl, onChange, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState(currentImageUrl);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange?.(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        {preview && (
          <img 
            src={preview} 
            alt={label} 
            className="w-16 h-16 object-contain border rounded"
          />
        )}
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
