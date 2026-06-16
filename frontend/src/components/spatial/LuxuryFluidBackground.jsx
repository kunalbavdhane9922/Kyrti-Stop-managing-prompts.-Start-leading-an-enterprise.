import React, { useEffect, useRef } from 'react';
import webGLFluidEnhanced from 'webgl-fluid-enhanced';
import { motion } from 'framer-motion';
import { usePerformanceMode } from '../../hooks/usePerformanceMode.js';

export const LuxuryFluidBackground = React.memo(function LuxuryFluidBackground() {
  const canvasRef = useRef(null);
  const { isLowPower } = usePerformanceMode();

  useEffect(() => {
    if (isLowPower || !canvasRef.current) return;

    try {
      const fluid = new webGLFluidEnhanced(canvasRef.current);
      fluid.setConfig({
        hover: true,
        simResolution: 64, // Downscaled for performance (was 128)
        dyeResolution: 256, // Downscaled for performance (was 512)
        captureResolution: 512,
        densityDissipation: 0.98,
        velocityDissipation: 0.99,
        pressure: 0.8,
        pressureIterations: 20,
        curl: 0,
        splatRadius: 0.25,
        splatForce: 2000,
        shading: true,
        colorful: false,
        colorPalette: ['#00E5FF', '#4169E1', '#FF00FF'],
        colorUpdateSpeed: 10,
        backgroundColor: '#000000',
        transparent: false,
        bloom: false, // Disabled for performance
        bloomIterations: 8,
        bloomResolution: 256,
        bloomIntensity: 0.8,
        bloomThreshold: 0.6,
        bloomSoftKnee: 0.7,
        sunrays: false, // Disabled for performance
        sunraysResolution: 196,
        sunraysWeight: 1.0,
      });
      fluid.start();

      return () => {
        fluid.stop();
      };
    } catch (err) {
      console.error('Failed to initialize WebGL fluid:', err);
    }
  }, [isLowPower]);

  if (isLowPower) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          zIndex: 0, 
          background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 100%)' 
        }}
      />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3, delay: 1, ease: 'easeOut' }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, backgroundColor: '#000000' }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </motion.div>
  );
});
