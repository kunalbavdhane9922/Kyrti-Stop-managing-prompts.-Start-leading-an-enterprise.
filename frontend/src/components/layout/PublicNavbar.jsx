import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Rocket, CreditCard, LogIn, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, preview: 'Return to the beginning. Stop managing prompts, start leading an enterprise.', action: () => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'vision-section', label: 'Vision', icon: Rocket, preview: 'Discover our blueprint for sovereign AI workforce and enterprise growth.', action: () => document.getElementById('vision-section')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'pricing-section', label: 'Pricing', icon: CreditCard, preview: 'Transparent account opening and maintenance charges.', action: () => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'login', label: 'Access Portal', icon: LogIn, preview: 'Log in to your authenticated enterprise dashboard.', isRoute: true, path: '/login' },
];

export function PublicNavbar() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If the section is at least 30% visible, mark it active
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.3 }
    );

    const sections = ['home', 'vision-section', 'pricing-section'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleAction = (item) => {
    if (item.isRoute) {
      navigate(item.path);
    } else if (item.action) {
      item.action();
    }
  };

  return (
    <>
      <nav style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '80px',
        backgroundColor: '#0F1115', // Premium Blue-Gray Theme
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2.5rem 0',
        zIndex: 50,
        borderRight: '1px solid rgba(255, 255, 255, 0.05)', // Subtle Structural border
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)', // Deep shadow
        fontFamily: '"Inter", sans-serif'
      }}>
        {/* Brand / Logo */}
        <div style={{ marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '10px' }}>
          <img 
            src="/main_logo.png" 
            alt="Kyrti Logo" 
            style={{ 
              width: '120px', 
              height: 'auto',
              display: 'block'
            }} 
          />
        </div>

        {/* Nav Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id || (item.isRoute && location.pathname === item.path);
            const isHovered = hoveredItem === item.id;
            
            return (
              <div 
                key={item.id}
                style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '10%',
                      bottom: '10%',
                      width: '3px',
                      backgroundColor: '#FF5C00',
                      borderTopRightRadius: '4px',
                      borderBottomRightRadius: '4px',
                    }}
                  />
                )}

                <motion.button
                  onClick={() => handleAction(item)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: isActive ? '#FF5C00' : (isHovered ? '#E8943A' : '#E4E2DD'), // Warm Amber hover, Cream default
                    padding: '0.85rem',
                    borderRadius: '14px',
                    backgroundColor: isActive ? 'rgba(255, 92, 0, 0.08)' : (isHovered ? 'rgba(232, 148, 58, 0.1)' : 'transparent'),
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <item.icon size={22} strokeWidth={1.5} />
                </motion.button>

                {/* Instant Preview Popup (Tooltip) */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: -5, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -5, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: 0.1, ease: 'easeOut' }}
                      style={{
                        position: 'absolute',
                        left: '95px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: '#151821', 
                        padding: '0.85rem 1.25rem',
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)', // Elevated Dark Shadow
                        width: '260px',
                        pointerEvents: 'none',
                        zIndex: 100,
                        border: '1px solid rgba(255, 255, 255, 0.1)' // Structural border
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <h4 style={{ margin: 0, color: '#FF5C00', fontSize: '1rem', fontWeight: '600', letterSpacing: '0.3px' }}>
                          {item.label}
                        </h4>
                        <ChevronRight size={14} color="#FF5C00" strokeWidth={2} />
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#E4E2DD', opacity: 0.7, lineHeight: '1.5' }}>
                        {item.preview}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Pro UI Badge - Command Palette */}
        <div style={{ marginTop: 'auto', marginBottom: '1rem' }}>
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#E4E2DD', fontFamily: 'monospace' }}>⌘ K</span>
            </div>
          </button>
        </div>
      </nav>
      {/* Spacer to push content right */}
      <div style={{ width: '80px', flexShrink: 0 }} />
    </>
  );
}
