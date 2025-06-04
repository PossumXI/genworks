import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, BarChart, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Logo3D } from './Logo3D';
import { Button } from './ui/Button';
import LoginDialog from './auth/LoginDialog';
import { useUserStore } from '../lib/store';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useUserStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/hub', label: 'Hub' },
    { path: '/deepwiki', label: 'DeepWiki' },
    { path: '/analytics', label: 'Analytics', icon: BarChart },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-3'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-6 h-6">
                <Logo3D />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-700 to-pink-500 bg-clip-text text-transparent">
                GenWorks
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-purple-600'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-700">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<LogOut className="h-4 w-4" />}
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsLoginOpen(true)}
              >
                Sign In
              </Button>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t mt-2 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </Link>
            ))}

            {user ? (
              <div className="pt-3 border-t">
                <div className="flex items-center gap-3 px-2 py-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-700">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<LogOut className="h-4 w-4" />}
                  onClick={handleLogout}
                  className="w-full mt-2"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="pt-3 border-t">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setIsLoginOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <LoginDialog isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </nav>
  );
};

export default Navbar;