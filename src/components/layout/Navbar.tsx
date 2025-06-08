// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../common/Button';

/**
 * Responsive navigation bar component
 * 
 * Features:
 * - Mobile responsive with hamburger menu
 * - Active link highlighting
 * - Scroll detection for background color change
 * - Smooth transitions
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // Navigation links configuration
  const navLinks: any[] = [
    // { name: 'Home', path: '/' },
    // { name: 'About', path: '/about' },
    // { name: 'Services', path: '/services' },
    // { name: 'Contact', path: '/contact' },
  ];

  // Handle scroll to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Check if a link is active
  const isActiveLink = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span 
              className={`text-2xl font-bold ${
                isScrolled || isMenuOpen ? 'text-purple-600' : 'text-white'
              }`}
            >
              HealVirtue
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors duration-200 font-medium ${
                  isScrolled 
                    ? isActiveLink(link.path)
                      ? 'text-purple-600'
                      : 'text-gray-700 hover:text-purple-600'
                    : isActiveLink(link.path)
                      ? 'text-white font-semibold'
                      : 'text-white/80 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Button
              variant={isScrolled ? 'primary' : 'outline'}
              size="sm"
              className={!isScrolled ? 'border-white text-white hover:bg-white/20' : ''}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden focus:outline-none z-10"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-5">
              <span
                className={`absolute block h-0.5 w-6 transform transition duration-300 ease-in-out ${
                  isMenuOpen 
                    ? 'rotate-45 translate-y-2.5 bg-gray-800' 
                    : isScrolled 
                      ? 'bg-gray-800' 
                      : 'bg-white'
                }`}
              />
              <span
                className={`absolute block h-0.5 mt-2 w-6 transform transition duration-300 ease-in-out ${
                  isMenuOpen ? 'opacity-0' : isScrolled ? 'bg-gray-800' : 'bg-white'
                }`}
              />
              <span
                className={`absolute block h-0.5 mt-4 w-6 transform transition duration-300 ease-in-out ${
                  isMenuOpen 
                    ? '-rotate-45 -translate-y-2.5 bg-gray-800' 
                    : isScrolled 
                      ? 'bg-gray-800' 
                      : 'bg-white'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '60px' }}
      >
        <div className="flex flex-col p-4 space-y-6 pt-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xl transition-colors duration-200 ${
                isActiveLink(link.path)
                  ? 'text-purple-600 font-semibold'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Button variant="primary" size="lg" fullWidth>
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;