import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Logo3DProps {
  className?: string;
  interactive?: boolean;
}

export const Logo3D: React.FC<Logo3DProps> = ({ className = '', interactive = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interactive) return;

    let animationId: number;
    let startTime = Date.now();
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      targetRotationY = mouseX * 20;
      targetRotationX = -mouseY * 20;
    };

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      
      if (logoRef.current) {
        // Smooth interpolation for mouse-based rotation
        currentRotationX += (targetRotationX - currentRotationX) * 0.1;
        currentRotationY += (targetRotationY - currentRotationY) * 0.1;
        
        const float = Math.sin(elapsed * 2) * 3;
        const pulse = Math.sin(elapsed * 3) * 0.1 + 1;
        
        logoRef.current.style.transform = `
          translateY(${float}px)
          rotateX(${currentRotationX}deg)
          rotateY(${currentRotationY}deg)
          scale(${pulse})
        `;
      }
      
      animationId = requestAnimationFrame(animate);
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
    }
    
    animate();

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
      }
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [interactive]);

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative ${className}`}
      ref={containerRef}
    >
      <div className="relative w-full h-full flex items-center justify-center perspective-1000">
        <div
          ref={logoRef}
          className="relative w-20 h-20 transform-gpu transition-transform duration-100"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Core Shape */}
          <div className="absolute inset-0">
            {/* Main Sphere */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg">
              {/* Inner Glow */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-tl from-purple-400/50 to-transparent animate-pulse" />
            </div>

            {/* Orbital Rings */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-full border-2 border-purple-400/30"
                style={{
                  transform: `rotateX(${i * 60}deg) rotateY(${i * 45}deg)`,
                  animation: `spin-${i} ${8 + i * 2}s linear infinite`,
                }}
              >
                <div
                  className="absolute w-2 h-2 bg-purple-400 rounded-full"
                  style={{
                    top: '50%',
                    left: '-1px',
                    transform: 'translateY(-50%)',
                  }}
                />
              </div>
            ))}

            {/* Particles */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30) * (Math.PI / 180);
              const radius = 40;
              const delay = i * 0.2;
              
              return (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-400 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    left: `calc(50% + ${Math.cos(angle) * radius}px)`,
                    top: `calc(50% + ${Math.sin(angle) * radius}px)`,
                  }}
                >
                  <div className="absolute inset-0 bg-purple-300 rounded-full blur-sm scale-150 animate-ping" />
                </motion.div>
              );
            })}
          </div>

          {/* Glow Effects */}
          <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl scale-150" />
          <div className="absolute inset-0 rounded-full bg-purple-400/10 blur-2xl scale-[2]" />
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        @keyframes spin-0 {
          from { transform: rotateZ(0deg) rotateX(60deg) rotateY(0deg); }
          to { transform: rotateZ(360deg) rotateX(60deg) rotateY(0deg); }
        }

        @keyframes spin-1 {
          from { transform: rotateZ(0deg) rotateX(120deg) rotateY(45deg); }
          to { transform: rotateZ(-360deg) rotateX(120deg) rotateY(45deg); }
        }

        @keyframes spin-2 {
          from { transform: rotateZ(0deg) rotateX(180deg) rotateY(90deg); }
          to { transform: rotateZ(360deg) rotateX(180deg) rotateY(90deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default Logo3D;