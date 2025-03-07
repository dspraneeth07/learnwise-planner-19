
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ease-in-out',
        scrolled || location.pathname !== '/' 
          ? 'bg-white/80 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="bg-gradient-to-r from-studbud-500 to-studbud-700 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold transition-transform duration-300 group-hover:scale-110">
            S
          </div>
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-studbud-700 to-studbud-500">
            Studbud
          </span>
        </Link>
        
        <nav className="hidden md:flex space-x-1">
          <NavLink to="/" label="Home" pathname={location.pathname} />
          <NavLink to="/study-details" label="Plan" pathname={location.pathname} />
          <NavLink to="/generated-plan" label="Schedule" pathname={location.pathname} />
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link
            to="/study-details"
            className={cn(
              "hidden sm:flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              "bg-studbud-500 text-white hover:bg-studbud-600 shadow-md hover:shadow-lg",
              "hover:scale-105 active:scale-95"
            )}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  pathname: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, pathname }) => {
  const isActive = pathname === to || (pathname.startsWith(to) && to !== '/');
  
  return (
    <Link
      to={to}
      className={cn(
        "relative px-3 py-2 rounded-full text-sm font-medium transition-all duration-200",
        isActive
          ? "text-studbud-700"
          : "text-gray-600 hover:text-studbud-600"
      )}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-studbud-500 rounded-full" />
      )}
    </Link>
  );
};

export default Header;
