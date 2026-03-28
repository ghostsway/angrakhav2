import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Search as SearchIcon } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const doSearch = (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearchParams({ q });
    axios.get(`${API}/search?q=${encodeURIComponent(q)}&limit=20`)
      .then(r => { setProducts(r.data.products || []); setTotal(r.data.total || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) { setQuery(q); doSearch(q); }
  }, []);

  return (
    <div className="py-12 lg:py-20" data-testid="search-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={e => { e.preventDefault(); doSearch(query); }} className="flex items-center border border-brand-border bg-brand-surface" data-testid="search-form">
            <SearchIcon className="w-5 h-5 text-muted-foreground ml-4" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for sherwanis, kurtas, bandhgalas..."
              className="flex-1 bg-transparent px-4 py-4 text-base font-sans text-foreground placeholder:text-muted-foreground focus:outline-none"
              data-testid="search-input"
              autoFocus
            />
            <button type="submit" className="bg-primary text-primary-foreground px-6 py-4 text-xs font-sans uppercase tracking-[0.2em]" data-testid="search-submit">
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] bg-brand-surface animate-pulse" />
                <div className="h-4 bg-brand-surface animate-pulse w-3/4" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <p className="text-sm font-sans text-muted-foreground mb-6">{total} result{total !== 1 ? 's' : ''} for "{searchParams.get('q')}"</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6" data-testid="search-results">
              {products.map((p, i) => <ProductCard key={p.product_id} product={p} index={i} />)}
            </div>
          </>
        ) : searchParams.get('q') ? (
          <div className="text-center py-16" data-testid="search-empty">
            <p className="font-serif text-2xl text-foreground mb-4">No results found</p>
            <p className="text-sm font-sans text-muted-foreground mb-8">Try a different search term or browse our collections.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/collections/wedding" className="border border-brand-border px-4 py-2 text-xs font-sans uppercase tracking-[0.2em] text-foreground hover:border-primary transition-colors">Wedding</Link>
              <Link to="/collections/festive" className="border border-brand-border px-4 py-2 text-xs font-sans uppercase tracking-[0.2em] text-foreground hover:border-primary transition-colors">Festive</Link>
              <Link to="/collections/all" className="border border-brand-border px-4 py-2 text-xs font-sans uppercase tracking-[0.2em] text-foreground hover:border-primary transition-colors">All Products</Link>
              <Link to="/contact" className="border border-primary px-4 py-2 text-xs font-sans uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-primary-foreground transition-colors">Contact Styling Team</Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-serif text-2xl text-foreground mb-4">What are you looking for?</p>
            <p className="text-sm font-sans text-muted-foreground">Search by product name, fabric, occasion or style.</p>
          </div>
        )}
      </div>
    </div>
  );
}
