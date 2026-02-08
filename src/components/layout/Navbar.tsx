import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  TrendingUp,
  Menu,
  X,
  User,
  LogOut,
  BarChart3,
  BookOpen,
  Trophy,
  Newspaper,
  Briefcase,
  Settings,
  ChevronDown,
  Layers
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Debug
  console.log('Navbar - isAuthenticated:', isAuthenticated, 'user:', user);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
    { href: '/learn', label: 'Learn', icon: BookOpen },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/news', label: 'News', icon: Newspaper },
  ];

  const advancedItems = [
    { href: '/advanced/heatmaps', label: 'Heat Maps' },
    { href: '/advanced/sectors', label: 'Sectors' },
  ];



  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      className="fixed top-0 w-full z-50 flex justify-center px-6 pt-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="w-full max-w-7xl"
        style={{
          backgroundColor: 'rgb(236, 237, 241)',
          borderRadius: '50px',
          boxShadow: '-3px -3px 6px 0px rgb(250, 251, 255), 3px 3px 6px 0px rgba(0, 125, 252, 0.15)',
          padding: '4px'
        }}
      >
        <div
          style={{
            backgroundColor: 'rgb(236, 237, 241)',
            borderRadius: '50px',
            boxShadow: 'inset -2px -2px 4px 0px rgb(250, 251, 255), inset 2px 2px 4px 0px rgba(0, 125, 252, 0.15)',
            padding: '12px 24px'
          }}
        >
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div
                className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-105"
                style={{
                  borderRadius: '50px',
                  boxShadow: '-2px -2px 4px 0px rgb(250, 251, 255), 2px 2px 4px 0px rgba(0, 125, 252, 0.15)',
                  backgroundColor: 'rgb(236, 237, 241)'
                }}
              >
                <img src="/tradepro logo.png" alt="TradePro Logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-2xl font-bold" style={{ color: 'black' }}>TradePro</span>
            </Link>

            {/* Desktop Navigation */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-2">
                {navItems.slice(0, 1).map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="relative flex items-center space-x-2 font-medium transition-all duration-200 group"
                      style={{
                        backgroundColor: 'rgb(236, 237, 241)',
                        borderRadius: '50px',
                        padding: '10px 16px'
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0)',
                          borderRadius: '50px',
                          boxShadow: '0px 0px 0px 0px rgb(250, 251, 255), 0px 0px 0px 0px rgba(0, 125, 252, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: isActive ? 'rgb(0, 125, 252)' : 'black',
                          transition: 'all 0.2s ease'
                        }}
                        className="group-hover:!text-[rgb(0,125,252)]"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}

                {navItems.slice(1, 2).map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="relative flex items-center space-x-2 font-medium transition-all duration-200 group"
                      style={{
                        backgroundColor: 'rgb(236, 237, 241)',
                        borderRadius: '50px',
                        padding: '10px 16px'
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0)',
                          borderRadius: '50px',
                          boxShadow: '0px 0px 0px 0px rgb(250, 251, 255), 0px 0px 0px 0px rgba(0, 125, 252, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: isActive ? 'rgb(0, 125, 252)' : 'black',
                          transition: 'all 0.2s ease'
                        }}
                        className="group-hover:!text-[rgb(0,125,252)]"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}

                {/* Transactions Link */}
                <Link
                  to="/transactions"
                  className="relative flex items-center space-x-2 font-medium transition-all duration-200 group"
                  style={{
                    backgroundColor: 'rgb(236, 237, 241)',
                    borderRadius: '50px',
                    padding: '10px 16px'
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderRadius: '50px',
                      boxShadow: '0px 0px 0px 0px rgb(250, 251, 255), 0px 0px 0px 0px rgba(0, 125, 252, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: location.pathname.startsWith('/transactions') ? 'rgb(0, 125, 252)' : 'black',
                      transition: 'all 0.2s ease'
                    }}
                    className="group-hover:!text-[rgb(0,125,252)]"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Transactions</span>
                  </div>
                </Link>

                {/* Advanced Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="relative flex items-center space-x-2 font-medium transition-all duration-200 group"
                      style={{
                        backgroundColor: 'rgb(236, 237, 241)',
                        borderRadius: '50px',
                        padding: '10px 16px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0)',
                          borderRadius: '50px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: location.pathname.startsWith('/advanced') ? 'rgb(0, 125, 252)' : 'black',
                          transition: 'all 0.2s ease'
                        }}
                        className="group-hover:!text-[rgb(0,125,252)]"
                      >
                        <Layers className="w-4 h-4" />
                        <span>Advanced</span>
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg">
                    {advancedItems.map((item) => (
                      <DropdownMenuItem
                        key={item.href}
                        onClick={() => navigate(item.href)}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        {item.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Learn Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="relative flex items-center space-x-2 font-medium transition-all duration-200 group"
                      style={{
                        backgroundColor: 'rgb(236, 237, 241)',
                        borderRadius: '50px',
                        padding: '10px 16px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0)',
                          borderRadius: '50px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: location.pathname.startsWith('/learn') ? 'rgb(0, 125, 252)' : 'black',
                          transition: 'all 0.2s ease'
                        }}
                        className="group-hover:!text-[rgb(0,125,252)]"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Learn</span>
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg">
                    <DropdownMenuItem
                      onClick={() => navigate('/learn/patterns')}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      Patterns
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate('/learn/recommendations')}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      Recommendations
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {navItems.slice(3).map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="relative flex items-center space-x-2 font-medium transition-all duration-200 group"
                      style={{
                        backgroundColor: 'rgb(236, 237, 241)',
                        borderRadius: '50px',
                        padding: '10px 16px'
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0)',
                          borderRadius: '50px',
                          boxShadow: '0px 0px 0px 0px rgb(250, 251, 255), 0px 0px 0px 0px rgba(0, 125, 252, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: isActive ? 'rgb(0, 125, 252)' : 'black',
                          transition: 'all 0.2s ease'
                        }}
                        className="group-hover:!text-[rgb(0,125,252)]"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* User Menu / Auth Buttons */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="relative h-10 w-10 rounded-full transition-all"
                      style={{
                        backgroundColor: 'rgb(236, 237, 241)',
                        boxShadow: '-3px -3px 6px 0px rgb(250, 251, 255), 3px 3px 6px 0px rgba(0, 125, 252, 0.15)',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback style={{ backgroundColor: 'rgb(236, 237, 241)', color: 'black' }}>
                          {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs leading-none text-gray-500">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer hover:bg-gray-50">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/rules')} className="cursor-pointer hover:bg-gray-50">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Rules</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/support')} className="cursor-pointer hover:bg-gray-50">
                      <User className="mr-2 h-4 w-4" />
                      <span>Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/invite')} className="cursor-pointer hover:bg-gray-50">
                      <User className="mr-2 h-4 w-4" />
                      <span>Invite Friends</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/shortcuts')} className="cursor-pointer hover:bg-gray-50">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Keyboard Shortcuts</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/manual')} className="cursor-pointer hover:bg-gray-50">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>User Manual</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-gray-50">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <div className="hidden md:flex items-center space-x-2">
                    <Link
                      to="/about"
                      className="relative flex items-center space-x-2 font-medium transition-all duration-200 group"
                      style={{
                        backgroundColor: 'rgb(236, 237, 241)',
                        borderRadius: '50px',
                        padding: '10px 16px'
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0)',
                          borderRadius: '50px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: location.pathname === '/about' ? 'rgb(0, 125, 252)' : 'black',
                          transition: 'all 0.2s ease'
                        }}
                        className="group-hover:!text-[rgb(0,125,252)]"
                      >
                        <span>About</span>
                      </div>
                    </Link>
                    <Link
                      to="/contact"
                      className="relative flex items-center space-x-2 font-medium transition-all duration-200 group"
                      style={{
                        backgroundColor: 'rgb(236, 237, 241)',
                        borderRadius: '50px',
                        padding: '10px 16px'
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0)',
                          borderRadius: '50px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: location.pathname === '/contact' ? 'rgb(0, 125, 252)' : 'black',
                          transition: 'all 0.2s ease'
                        }}
                        className="group-hover:!text-[rgb(0,125,252)]"
                      >
                        <span>Contact</span>
                      </div>
                    </Link>
                  </div>
                  <div className="hidden md:flex items-center space-x-3">
                    <Button
                      variant="outline"
                      asChild
                      style={{
                        boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                      }}
                      className="bg-white border-0 hover:bg-gray-50 rounded-xl h-10 px-6"
                    >
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button
                      asChild
                      style={{
                        boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
                      }}
                      className="bg-black text-white hover:bg-black/95 rounded-xl h-10 px-6"
                    >
                      <Link to="/signup">Get Started</Link>
                    </Button>
                  </div>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden border-t border-border/50 pt-4 pb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {isAuthenticated ? (
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <hr className="border-border/50 my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/about"
                    className="block px-3 py-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    className="block px-3 py-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  <hr className="border-border/50 my-2" />
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 text-primary hover:text-primary-glow"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;