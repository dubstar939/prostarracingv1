import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to handle keyboard controls for the racing game.
 */
export function useControls() {
  const [keys, setKeys] = useState<Record<string, boolean>>({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    s: false,
    a: false,
    d: false,
    Shift: false,
    Space: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'Shift', 'Space'].includes(e.key)) {
        e.preventDefault();
        setKeys((prev) => ({ ...prev, [e.key]: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'Shift', 'Space'].includes(e.key)) {
        e.preventDefault();
        setKeys((prev) => ({ ...prev, [e.key]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const isAccelerating = useCallback(() => keys.ArrowUp || keys.w, [keys]);
  const isBraking = useCallback(() => keys.ArrowDown || keys.s, [keys]);
  const isTurningLeft = useCallback(() => keys.ArrowLeft || keys.a, [keys]);
  const isTurningRight = useCallback(() => keys.ArrowRight || keys.d, [keys]);
  const isNitroActive = useCallback(() => keys.Shift, [keys]);

  return {
    keys,
    isAccelerating,
    isBraking,
    isTurningLeft,
    isTurningRight,
    isNitroActive,
  };
}
