import React, { useEffect, useRef } from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';

const Ecosystem: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Define the flywheel components
    const components = [
      { name: 'Marketplace', color: '#9333EA', x: canvas.width * 0.25, y: canvas.height * 0.35 },
      { name: 'Hub', color: '#0D9488', x: canvas.width * 0.75, y: canvas.height * 0.35 },
      { name: 'DeepWiki', color: '#EC4899', x: canvas.width * 0.5, y: canvas.height * 0.75 }
    ];
    
    // Animation variables
    let angle = 0;
    let particlePoints: Array<{x: number, y: number, vx: number, vy: number, life: number, color: string}> = [];
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update positions based on angle for circular motion effect
      components[0].x = canvas.width * 0.25 + Math.sin(angle * 0.5) * 5;
      components[0].y = canvas.height * 0.35 + Math.cos(angle * 0.5) * 5;
      
      components[1].x = canvas.width * 0.75 + Math.sin(angle * 0.5 + 2) * 5;
      components[1].y = canvas.height * 0.35 + Math.cos(angle * 0.5 + 2) * 5;
      
      components[2].x = canvas.width * 0.5 + Math.sin(angle * 0.5 + 4) * 5;
      components[2].y = canvas.height * 0.75 + Math.cos(angle * 0.5 + 4) * 5;
      
      // Draw connections between components
      ctx.beginPath();
      ctx.moveTo(components[0].x, components[0].y);
      ctx.lineTo(components[1].x, components[1].y);
      ctx.lineTo(components[2].x, components[2].y);
      ctx.lineTo(components[0].x, components[0].y);
      ctx.strokeStyle = 'rgba(160, 160, 160, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw arrow for the flywheel effect
      const drawFlywheelArrow = () => {
        ctx.save();
        const centerX = (components[0].x + components[1].x + components[2].x) / 3;
        const centerY = (components[0].y + components[1].y + components[2].y) / 3;
        
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        
        // Draw circular arrow
        ctx.beginPath();
        ctx.arc(0, 0, 50, 0, 1.5 * Math.PI, false);
        ctx.strokeStyle = 'rgba(147, 51, 234, 0.6)';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw arrowhead
        ctx.beginPath();
        ctx.moveTo(0, -50);
        ctx.lineTo(10, -40);
        ctx.lineTo(-5, -35);
        ctx.closePath();
        ctx.fillStyle = 'rgba(147, 51, 234, 0.6)';
        ctx.fill();
        
        ctx.restore();
      };
      
      drawFlywheelArrow();
      
      // Create occasional particles at random component
      if (Math.random() < 0.1) {
        const sourceIndex = Math.floor(Math.random() * components.length);
        const targetIndex = (sourceIndex + 1) % components.length;
        
        const sourceX = components[sourceIndex].x;
        const sourceY = components[sourceIndex].y;
        const targetX = components[targetIndex].x;
        const targetY = components[targetIndex].y;
        
        const dirX = targetX - sourceX;
        const dirY = targetY - sourceY;
        const length = Math.sqrt(dirX * dirX + dirY * dirY);
        
        particlePoints.push({
          x: sourceX,
          y: sourceY,
          vx: (dirX / length) * 2,
          vy: (dirY / length) * 2,
          life: 100,
          color: components[sourceIndex].color
        });
      }
      
      // Update and draw particles
      particlePoints.forEach((point, index) => {
        point.x += point.vx;
        point.y += point.vy;
        point.life -= 1;
        
        const alpha = point.life / 100;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `${point.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
        
        if (point.life <= 0) {
          particlePoints.splice(index, 1);
        }
      });
      
      // Draw components
      components.forEach(component => {
        // Component circle
        ctx.beginPath();
        ctx.arc(component.x, component.y, 25, 0, Math.PI * 2);
        ctx.fillStyle = `${component.color}30`;
        ctx.fill();
        ctx.strokeStyle = component.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Component name
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#333';
        ctx.fillText(component.name, component.x, component.y);
      });
      
      angle += 0.01;
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);
  
  return (
    <div id="ecosystem" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">The Flywheel Effect</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            GenWorks creates a powerful loop of value by connecting its components.
            More users lead to more data, which improves our AI, attracting even more vibe coders.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <RefreshCw className="h-6 w-6 text-purple-700" />
              Continuous Evolution
            </h3>
            <p className="text-gray-700 mb-6">
              GenWorks creates a self-improving ecosystem that gets better with every interaction:
            </p>
            
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">1</div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">More Marketplace Users</h4>
                  <p className="text-gray-600 text-sm">As more vibe coders join the Marketplace, they bring diverse skills and approaches to AI-assisted development.</p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">2</div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Enriched Hub Data</h4>
                  <p className="text-gray-600 text-sm">These users share more prompts and results on the Hub, creating a rich repository of AI interactions and outcomes.</p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold">3</div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Improved Devstral AI</h4>
                  <p className="text-gray-600 text-sm">This data fine-tunes our Devstral AI model, making it more powerful and better aligned with vibe coders' needs.</p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">4</div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Enhanced DeepWiki Experience</h4>
                  <p className="text-gray-600 text-sm">The improved AI makes DeepWiki more capable, attracting more vibe coders to the platform.</p>
                </div>
              </li>
            </ol>
            
            <div className="mt-8">
              <button className="inline-flex items-center text-purple-700 font-medium hover:text-purple-800 transition-colors group">
                Learn about our AI evolution process
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-4 h-96 border border-gray-100 relative">
            <canvas ref={canvasRef} className="w-full h-full"></canvas>
            <div className="absolute bottom-4 left-4 right-4 text-center text-sm text-gray-500">
              Interactive visualization of the GenWorks flywheel effect
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ecosystem;