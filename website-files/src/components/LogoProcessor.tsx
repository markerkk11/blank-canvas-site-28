import React, { useEffect, useState } from 'react';
import { removeBackground, loadImageFromUrl } from '@/utils/backgroundRemoval';

interface LogoProcessorProps {
  onProcessed: (processedImageUrl: string) => void;
}

export const LogoProcessor: React.FC<LogoProcessorProps> = ({ onProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const processLogo = async () => {
      try {
        setIsProcessing(true);
        console.log('Loading AT&T logo for background removal...');
        
        // Load the uploaded AT&T logo
        const imageElement = await loadImageFromUrl('/lovable-uploads/2d4d7e0c-81ea-4c08-b4ef-81fbd1bb69e0.png');
        
        // Remove background
        const processedBlob = await removeBackground(imageElement);
        
        // Create URL for the processed image
        const processedUrl = URL.createObjectURL(processedBlob);
        
        // Notify parent component
        onProcessed(processedUrl);
        
        console.log('AT&T logo background removal completed');
      } catch (error) {
        console.error('Error processing AT&T logo:', error);
        // Fallback to original image if background removal fails
        onProcessed('/lovable-uploads/2d4d7e0c-81ea-4c08-b4ef-81fbd1bb69e0.png');
      } finally {
        setIsProcessing(false);
      }
    };

    processLogo();
  }, [onProcessed]);

  if (isProcessing) {
    return (
      <div className="text-sm text-muted-foreground">
        Processing AT&T logo...
      </div>
    );
  }

  return null;
};