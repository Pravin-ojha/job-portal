import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, Briefcase, User, LogOut, ChevronDown } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate('/');
  };

  const menuItems = [
    { label: 'Search Jobs', path: '/jobs' },
    ...(user && user.userType === 'job_seeker' ? [{ label: 'My Jobs', path: '/my-jobs' }] : []),
    ...(user && user.userType === 'job_seeker' ? [{ label: 'Applications', path: '/applications' }] : []),
    ...(user && user.userType === 'job_seeker' ? [{ label: 'Saved Jobs', path: '/saved-jobs' }] : []),
    ...(user && user.userType === 'employer' ? [{ label: 'Post Job', path: '/post-job' }] : []),
    ...(user ? [{ label: 'Dashboard', path: '/dashboard' }] : []),
    ...(user && user.role === 'admin' ? [{ label: 'Admin', path: '/admin' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg tracking-tight">JobPortal</span>
          </Link>
          <nav className="hidden md:flex ml-6 items-center gap-6 text-sm font-medium">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          {!user ? (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button onClick={() => navigate('/signup')} className="bg-primary text-primary-foreground">
                Sign up
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex relative">
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center border border-border">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium">{user.firstName}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>

              {profileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-border bg-popover p-1 shadow-md z-50 animate-in fade-in zoom-in duration-150">
                    <div className="px-2 py-1.5 text-sm font-medium border-b border-border mb-1">
                      {user.firstName} {user.lastName}
                      <span className="block text-xs text-muted-foreground font-normal">
                        {user.userType === 'employer' ? 'Employer' : 'Job Seeker'}
                      </span>
                    </div>
                    {menuItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.path}
                        className="block w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-secondary transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-destructive rounded-sm hover:bg-secondary transition-colors mt-1 border-t border-border"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          <button
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-md hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-3">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="text-sm font-medium text-foreground/80 hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {!user ? (
              <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border">
                <Button variant="outline" className="w-full justify-center" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>
                  Log in
                </Button>
                <Button className="w-full justify-center" onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }}>
                  Sign up
                </Button>
              </div>
            ) : (
              <div className="mt-2 pt-2 border-t border-border">
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 text-sm font-medium text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
