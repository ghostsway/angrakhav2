import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const NAV_LINKS = [
  { label: 'Collections', to: '/collections' },
  { label: 'Wedding', to: '/collections/wedding' },
  { label: 'Festive', to: '/collections/festive' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  const { user, login } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = location.pathname === '/';

  return (
    <header className="glass-header fixed top-0 left-0 right-0 z-50 border-b border-brand-border" data-testid="site-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden p-2 text-foreground" data-testid="mobile-menu-btn">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-brand-bg border-brand-border w-[280px]">
              <SheetHeader>
                <SheetTitle className="font-serif text-2xl font-light tracking-[0.25em] text-foreground">
                  ANGARAKHA
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-6">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-sans uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
                    data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link to="/search" onClick={() => setMobileOpen(false)} className="text-sm font-sans uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">
                  Search
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop nav left */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.slice(0, 2).map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors duration-300"
                data-testid={`nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center" data-testid="logo-link">
            <h1 className="font-serif text-2xl lg:text-3xl font-light tracking-[0.25em] text-foreground">
              ANGARAKHA
            </h1>
          </Link>

          {/* Desktop nav right */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.slice(2).map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors duration-300"
                data-testid={`nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/search" className="hidden lg:block p-2 text-muted-foreground hover:text-primary transition-colors" data-testid="search-icon">
              <Search className="w-4 h-4" />
            </Link>
            {user ? (
              <Link to="/account" className="p-2 text-muted-foreground hover:text-primary transition-colors" data-testid="account-icon">
                <User className="w-4 h-4" />
              </Link>
            ) : (
              <button onClick={login} className="p-2 text-muted-foreground hover:text-primary transition-colors" data-testid="login-btn">
                <User className="w-4 h-4" />
              </button>
            )}
            <Link to="/cart" className="p-2 text-muted-foreground hover:text-primary transition-colors relative" data-testid="cart-icon">
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-sans font-medium rounded-full flex items-center justify-center" data-testid="cart-count">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
