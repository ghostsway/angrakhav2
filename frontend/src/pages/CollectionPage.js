import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CollectionPage() {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    axios.get(`${API}/collections/${slug}?sort=${sort}&page=1&limit=12`)
      .then(r => {
        setCollection(r.data);
        setProducts(r.data.products || []);
        setTotalPages(r.data.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, sort]);

  const loadMore = () => {
    const nextPage = page + 1;
    axios.get(`${API}/collections/${slug}?sort=${sort}&page=${nextPage}&limit=12`)
      .then(r => {
        setProducts(prev => [...prev, ...(r.data.products || [])]);
        setPage(nextPage);
      });
  };

  return (
    <div className="py-12 lg:py-20" data-testid="collection-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero strip */}
        {collection && (
          <div className="relative h-48 sm:h-64 mb-10 overflow-hidden" data-testid="collection-hero">
            <img src={collection.hero_image} alt={collection.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h1 className="font-serif text-4xl sm:text-5xl font-light text-white mb-2">{collection.name}</h1>
              <p className="text-sm font-sans text-white/70 max-w-lg">{collection.description}</p>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8" data-testid="collection-toolbar">
          <p className="text-sm font-sans text-muted-foreground">
            {collection?.total || 0} product{(collection?.total || 0) !== 1 ? 's' : ''}
          </p>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px] bg-brand-surface border-brand-border text-sm" data-testid="sort-select">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-brand-surface border-brand-border">
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] bg-brand-surface animate-pulse" />
                <div className="h-4 bg-brand-surface animate-pulse w-3/4" />
                <div className="h-3 bg-brand-surface animate-pulse w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6" data-testid="product-grid">
              {products.map((p, i) => <ProductCard key={p.product_id} product={p} index={i} />)}
            </div>
            {page < totalPages && (
              <div className="text-center mt-12">
                <button onClick={loadMore} className="border border-primary text-primary px-8 py-3 text-xs font-sans uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-all" data-testid="load-more-btn">
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-foreground mb-4">No products found</p>
            <Link to="/collections" className="text-sm font-sans text-primary hover:underline">Browse all collections</Link>
          </div>
        )}
      </div>
    </div>
  );
}
