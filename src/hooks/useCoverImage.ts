import { useState, useEffect } from 'react';

/**
 * Hook to generate and manage a cover image using Google AI.
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

    const generateImage = async () => {
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
          console.warn('GEMINI_API_KEY is missing, skipping cover image generation');
          return;
        }

        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: '1980s arcade racing video game cover art, synthwave aesthetic, outrun style, neon grid floor, glowing sunset, retro sports car driving towards the horizon, vibrant magenta cyan and purple colors, airbrushed retro style, no text',
          config: {
            imageConfig: {
              aspectRatio: '9:16',
            },
          },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            setCoverImage(imageUrl);
            try {
              window.localStorage.setItem('coverImage', imageUrl);
            } catch {
              console.warn('Could not save to localStorage (quota exceeded?)');
            }
            break;
          }
        }
      } catch (error) {
        console.error('Error generating cover image:', error);
      }
    };

    generateImage();
  }, [coverImage]);

  return coverImage;
}
