import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Bot, User, Building2, MousePointer2, Network } from 'lucide-react';

export function HeroOrb() {
  const containerRef = useRef(null);
  
  // Direct mouse coordinates (Human Lead)
  const mouseX = useMotionValue(250);
  const mouseY = useMotionValue(250);
  
  // Springy coordinates for the AI Swarm
  const swarmX = useSpring(mouseX, { damping: 20, stiffness: 60 });
  const swarmY = useSpring(mouseY, { damping: 20, stiffness: 60 });

  const [isBuilding, setIsBuilding] = useState(false);
  const [startups, setStartups] = useState([]);
  const [isHoveringContainer, setIsHoveringContainer] = useState(false);
  const [hoveredStartup, setHoveredStartup] = useState(null);

  // Default angles for the 5 AI agents
  const angles = [0, 72, 144, 216, 288].map(deg => deg * (Math.PI / 180));

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
    if (!isHoveringContainer) setIsHoveringContainer(true);
  };

  const handleMouseLeave = () => {
    setIsHoveringContainer(false);
    mouseX.set(250);
    mouseY.set(250);
  };

  const handleMouseClick = (e) => {
    // If we click on an existing startup, don't build a new one
    if (isBuilding || hoveredStartup) return; 

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      setIsBuilding(true);

      setTimeout(() => {
        setStartups(prev => {
          const newStartups = [...prev, { id: Date.now(), x: clickX, y: clickY }];
          return newStartups.slice(-5); // Keep max 5 startups
        });
        setIsBuilding(false);
      }, 1000);
    }
  };

  // Update a startup's position while dragging so network lines follow
  const handleDrag = (id, e, info) => {
    setStartups(prev => prev.map(s => {
      if (s.id === id) {
        // We calculate rough offset based on the drag delta
        return { ...s, x: s.x + info.delta.x, y: s.y + info.delta.y };
      }
      return s;
    }));
  };

  const radius = isBuilding ? 50 : 130;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseClick}
      style={{ 
        position: 'relative', width: '100%', height: '500px', 
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        cursor: 'none', 
        overflow: 'hidden',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.05)',
        backgroundColor: 'rgba(255,255,255,0.01)',
        touchAction: 'none',
        marginTop: '-100px'
      }}
    >
      
      {/* Background Ambience */}
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(18, 152, 176, 0.1) 0%, transparent 60%)',
          filter: 'blur(50px)',
          zIndex: 0
        }}
      />

      {/* Instructions Overlay */}
      <motion.div 
        animate={{ opacity: isHoveringContainer ? 0 : 0.6 }}
        style={{ position: 'absolute', top: 20, color: '#E4E2DD', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}
      >
        <MousePointer2 size={16} /> Click to construct. Drag to arrange.
      </motion.div>

      {/* Network Lines connecting Startups */}
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 1 }}>
        {startups.map((startup, i) => {
          if (i === 0) return null;
          const prev = startups[i - 1];
          return (
            <motion.line
              key={`line-${startup.id}`}
              x1={prev.x} y1={prev.y}
              x2={startup.x} y2={startup.y}
              stroke="rgba(18, 152, 176, 0.4)"
              strokeWidth="3"
              strokeDasharray="5 10"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
               {/* Pulsing data along the network lines */}
               <animate attributeName="stroke-dashoffset" from="30" to="0" dur="1s" repeatCount="indefinite" />
            </motion.line>
          );
        })}
      </svg>

      {/* Draggable Startups */}
      {startups.map((startup) => (
        <motion.div
          key={startup.id}
          drag
          dragConstraints={containerRef}
          dragElastic={0.1}
          dragMomentum={false}
          onDrag={(e, info) => handleDrag(startup.id, e, info)}
          onHoverStart={() => setHoveredStartup(startup.id)}
          onHoverEnd={() => setHoveredStartup(null)}
          whileHover={{ scale: 1.1 }}
          whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
          initial={{ scale: 0, opacity: 0, rotate: -45 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          style={{ 
            position: 'absolute', left: startup.x - 40, top: startup.y - 40,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            cursor: 'grab', zIndex: 10
          }}
        >
          {/* Node Graphic */}
          <div style={{
             width: 80, height: 80,
             background: hoveredStartup === startup.id ? 'linear-gradient(135deg, #1298B0, #FF5C00)' : 'linear-gradient(135deg, #092F63, #1298B0)',
             borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center',
             border: '2px solid #E4E2DD', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <Building2 color="#E4E2DD" size={36} />
          </div>

          {/* Hover Tooltip */}
          {hoveredStartup === startup.id && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: 'absolute', top: -45, whiteSpace: 'nowrap',
                background: '#151821', color: '#1298B0', border: '1px solid #1298B0',
                padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontFamily: 'monospace',
                display: 'flex', alignItems: 'center', gap: '6px', pointerEvents: 'none'
              }}
            >
              <Network size={12} /> ENTERPRISE NODE ACTIVE
            </motion.div>
          )}
        </motion.div>
      ))}

      {/* The AI Swarm */}
      <motion.div style={{ x: swarmX, y: swarmY, position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 5 }}>
        
        {/* Fast rotation when building, slow when idle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: isBuilding ? 3 : 15, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', width: 0, height: 0 }}
        >
          {/* Construction Beams */}
          <svg width="400" height="400" style={{ position: 'absolute', left: -200, top: -200, overflow: 'visible' }}>
            {angles.map((angle, i) => {
               const bx = Math.cos(angle) * radius;
               const by = Math.sin(angle) * radius;
               return (
                 <motion.line 
                   key={`beam-${i}`}
                   x1={0} y1={0}
                   x2={0} y2={0}
                   animate={{ x2: bx, y2: by, opacity: isBuilding ? 0.9 : 0 }}
                   transition={{ duration: 0.2 }}
                   stroke="#FF5C00" strokeWidth="4" strokeDasharray="4 8"
                 />
               );
            })}
          </svg>

          {/* AI Bots */}
          {angles.map((angle, i) => {
            const bx = Math.cos(angle) * radius;
            const by = Math.sin(angle) * radius;
            return (
              <motion.div
                key={`bot-${i}`}
                animate={{ x: bx, y: by }}
                transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                style={{ 
                  position: 'absolute', marginLeft: -20, marginTop: -20, 
                  width: 40, height: 40, borderRadius: '50%', background: '#111319', 
                  border: '2px solid #FF5C00', display: 'flex', justifyContent: 'center', alignItems: 'center',
                  boxShadow: isBuilding ? '0 0 25px rgba(255,92,0,0.8)' : '0 0 10px rgba(255,92,0,0.3)'
                }}
              >
                <motion.div animate={{ rotate: -360 }} transition={{ duration: isBuilding ? 3 : 15, repeat: Infinity, ease: 'linear' }}>
                  <Bot color="#FF5C00" size={20} />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Human Lead Cursor */}
      <motion.div 
        style={{ 
          x: mouseX, y: mouseY, 
          position: 'absolute', top: 0, left: 0, pointerEvents: 'none',
          marginLeft: -30, marginTop: -30, zIndex: 20
        }}
      >
        <div style={{ 
          width: 60, height: 60, borderRadius: '50%', background: '#0F1115', 
          border: '2px solid #1298B0', display: 'flex', justifyContent: 'center', alignItems: 'center',
          boxShadow: '0 0 20px rgba(18, 152, 176, 0.6)'
        }}>
          <User color="#1298B0" size={32} />
        </div>
        
        {isBuilding && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 35 }}
            style={{ 
              position: 'absolute', left: '50%', transform: 'translateX(-50%)',
              background: '#FF5C00', color: '#fff', padding: '2px 8px', borderRadius: '4px',
              fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px', whiteSpace: 'nowrap'
            }}
          >
            BUILDING STARTUP...
          </motion.div>
        )}
      </motion.div>

    </div>
  );
}
