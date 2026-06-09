import React, { useEffect, useRef } from 'react';
import webGLFluidEnhanced from 'webgl-fluid';
import { motion } from 'framer-motion';
import { usePerformanceMode } from '../../hooks/usePerformanceMode.js';

export const LuxuryFluidBackground = React.memo(function LuxuryFluidBackground() {
  const canvasRef = useRef(null);
  const { isLowPower } = usePerformanceMode();

  useEffect(() => {
    if (isLowPower || !canvasRef.current) return;

    try {
      webGLFluidEnhanced(canvasRef.current, {
        IMMEDIATE: false,
        TRIGGER: 'hover',
        SIM_RESOLUTION: 64, // Downscaled for performance (was 128)
        DYE_RESOLUTION: 256, // Downscaled for performance (was 512)
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 0.98,
        VELOCITY_DISSIPATION: 0.99,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 0,
        SPLAT_RADIUS: 0.25,
        SPLAT_FORCE: 2000,
        SHADING: true,
        COLORFUL: false,
        COLOR_PALETTE: ['#00E5FF', '#4169E1', '#FF00FF'],
        COLOR_UPDATE_SPEED: 10,
        PAUSED: false,
        BACK_COLOR: '#000000',
        TRANSPARENT: false,
        BLOOM: false, // Disabled for performance
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.8,
        BLOOM_THRESHOLD: 0.6,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: false, // Disabled for performance
        SUNRAYS_RESOLUTION: 196,
        SUNRAYS_WEIGHT: 1.0,
      });
    } catch (err) {
      console.error('Failed to initialize WebGL fluid:', err);
    }

    return () => {
      // In React Strict Mode, the canvas DOM node is reused. 
      // If we explicitly call loseContext(), it will crash on the next mount.
      // Therefore, we let the browser garbage collect the WebGL context naturally.
    };
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
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, backgroundColor: '#FFFFFF' }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </motion.div>
  );
});
