import { useState, useEffect } from 'react';

/**
 * Hook to manage cover image - uses procedural generation instead of API
 */
export function useCoverImage() {
  const [coverImage, setCoverImage] = useState<string | null>(() => {
    try {
      if (typeof window === 'undefined') return null;
      return window.localStorage.getItem('coverImage');
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (coverImage) return;

    // Generate procedural cover image using canvas
    const generateProceduralCover = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 720;
      canvas.height = 1280;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Background gradient (sunset)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#2d1b4e');
      gradient.addColorStop(0.3, '#c752a9');
      gradient.addColorStop(0.6, '#ff6b9d');
      gradient.addColorStop(1, '#ffb347');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sun
      const sunGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height * 0.4, 0,
        canvas.width / 2, canvas.height * 0.4, 200
      );
      sunGradient.addColorStop(0, '#fff5e7');
      sunGradient.addColorStop(0.3, '#ffcc00');
      sunGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height * 0.4, 200, 0, Math.PI * 2);
      ctx.fill();

      // Grid floor (perspective)
      ctx.strokeStyle = 'rgba(255, 100, 200, 0.5)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 20; i++) {
        const y = canvas.height * 0.6 + (i * i * 3);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Vertical grid lines
      for (let i = -10; i <= 10; i++) {
        const x = canvas.width / 2 + i * i * (i > 0 ? 1 : -1) * 5;
        ctx.beginPath();
        ctx.moveTo(x, canvas.height * 0.6);
        ctx.lineTo(canvas.width / 2 + i * 100, canvas.height);
        ctx.stroke();
      }

      // Silhouette car
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.moveTo(100, canvas.height - 150);
      ctx.lineTo(200, canvas.height - 150);
      ctx.lineTo(220, canvas.height - 200);
      ctx.lineTo(350, canvas.height - 200);
      ctx.lineTo(400, canvas.height - 150);
      ctx.lineTo(620, canvas.height - 150);
      ctx.lineTo(620, canvas.height - 100);
      ctx.lineTo(100, canvas.height - 100);
      ctx.closePath();
      ctx.fill();

      // Neon glow effects
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(150, canvas.height - 120);
      ctx.lineTo(570, canvas.height - 120);
      ctx.stroke();
      ctx.shadowBlur = 0;

      const imageUrl = canvas.toDataURL('image/png');
      setCoverImage(imageUrl);
      try {
        window.localStorage.setItem('coverImage', imageUrl);
      } catch {
        console.warn('Could not save to localStorage');
      }
      return imageUrl;
    };

    generateProceduralCover();
  }, [coverImage]);

  return coverImage;
}
