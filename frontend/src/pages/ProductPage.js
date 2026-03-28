import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Minus, Plus, ShoppingBag, ChevronRight, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SIZE_GUIDE = [
  { size: 'S', chest: '36"', waist: '30"', shoulder: '16"' },
  { size: 'M', chest: '38"', waist: '32"', shoulder: '17"' },
  { size: 'L', chest: '40"', waist: '34"', shoulder: '18"' },
  { size: 'XL', chest: '42"', waist: '36"', shoulder: '19"' },
  { size: 'XXL', chest: '44"', waist: '38"', shoulder: '20"' },
];

export default function ProductPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [reviews, setReviews] = useState({ reviews: [], average_rating: 0, total: 0 });
  const [related, setRelated] = useState([]);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`${API}/products/${slug}`),
      axios.get(`${API}/reviews/${slug}`)
    ]).then(([pRes, rRes]) => {
      setProduct(pRes.data);
      setReviews(rRes.data);
      if (pRes.data.sizes?.length) setSelectedSize(pRes.data.sizes[0]);
      // Fetch related products
      const occasion = pRes.data.occasions?.[0] || 'all';
      axios.get(`${API}/products?occasion=${occasion}&limit=4`).then(r => {
        setRelated((r.data.products || []).filter(p => p.slug !== slug).slice(0, 4));
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    if (!selectedSize) { toast.error('Please select a size'); return; }
    try {
      await addItem({
        product_id: product.product_id, product_slug: product.slug,
        name: product.name, image: product.images?.[0] || '',
        size: selectedSize, color: product.color || '', price: product.price, quantity
      });
      toast.success(`${product.name} added to cart`);
    } catch { toast.error('Failed to add to cart'); }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-[3/4] bg-brand-surface animate-pulse" />
        <div className="space-y-4">
          <div className="h-8 bg-brand-surface animate-pulse w-3/4" />
          <div className="h-6 bg-brand-surface animate-pulse w-1/4" />
          <div className="h-24 bg-brand-surface animate-pulse" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-20">
      <p className="font-serif text-2xl text-foreground mb-4">Product not found</p>
      <Link to="/collections" className="text-sm font-sans text-primary hover:underline">Browse collections</Link>
    </div>
  );

  const hasDiscount = product.compare_price && product.compare_price > product.price;

  return (
    <div className="py-8 lg:py-12" data-testid="product-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-sans text-muted-foreground mb-8" data-testid="breadcrumb">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/collections" className="hover:text-primary transition-colors">Collections</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <div className="space-y-4" data-testid="product-gallery">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="aspect-[3/4] bg-brand-surface overflow-hidden">
              <img src={product.images?.[activeImg]} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-16 h-20 border overflow-hidden transition-all ${i === activeImg ? 'border-primary' : 'border-brand-border opacity-60 hover:opacity-100'}`}
                    data-testid={`thumb-${i}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-28 lg:self-start space-y-6">
            <div>
              <p className="text-xs font-sans uppercase tracking-[0.2em] text-primary mb-2">{product.category?.replace('_', ' ')}</p>
              <h1 className="font-serif text-3xl sm:text-4xl font-light text-foreground" data-testid="product-title">{product.name}</h1>
            </div>

            <div className="flex items-center gap-3" data-testid="product-price">
              <span className="font-serif text-2xl text-primary">Rs {product.price?.toLocaleString('en-IN')}</span>
              {hasDiscount && (
                <>
                  <span className="text-sm font-sans text-muted-foreground line-through">Rs {product.compare_price?.toLocaleString('en-IN')}</span>
                  <span className="text-xs font-sans bg-primary/20 text-primary px-2 py-0.5">
                    {Math.round((1 - product.price / product.compare_price) * 100)}% off
                  </span>
                </>
              )}
            </div>

            {reviews.total > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(reviews.average_rating) ? 'fill-primary text-primary' : 'text-brand-border'}`} />
                  ))}
                </div>
                <span className="text-xs font-sans text-muted-foreground">{reviews.average_rating} ({reviews.total} reviews)</span>
              </div>
            )}

            <p className="text-sm font-sans text-muted-foreground leading-relaxed">{product.short_description}</p>

            {/* Size Selector */}
            <div data-testid="size-selector">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-sans uppercase tracking-[0.2em] text-foreground">Size</p>
                <button onClick={() => setShowSizeGuide(!showSizeGuide)} className="text-xs font-sans text-primary underline" data-testid="size-guide-toggle">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`min-w-[48px] h-10 px-3 text-sm font-sans border transition-all ${selectedSize === s ? 'bg-primary text-primary-foreground border-primary' : 'border-brand-border text-foreground hover:border-primary'}`}
                    data-testid={`size-btn-${s}`}>
                    {s}
                  </button>
                ))}
              </div>
              {showSizeGuide && (
                <div className="mt-4 border border-brand-border bg-brand-surface p-4" data-testid="size-guide-table">
                  <table className="w-full text-xs font-sans">
                    <thead>
                      <tr className="border-b border-brand-border">
                        <th className="py-2 text-left text-muted-foreground">Size</th>
                        <th className="py-2 text-left text-muted-foreground">Chest</th>
                        <th className="py-2 text-left text-muted-foreground">Waist</th>
                        <th className="py-2 text-left text-muted-foreground">Shoulder</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SIZE_GUIDE.map(row => (
                        <tr key={row.size} className="border-b border-brand-border/50">
                          <td className="py-2 text-foreground font-medium">{row.size}</td>
                          <td className="py-2 text-muted-foreground">{row.chest}</td>
                          <td className="py-2 text-muted-foreground">{row.waist}</td>
                          <td className="py-2 text-muted-foreground">{row.shoulder}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-2 text-xs text-muted-foreground">Fit: {product.fit} | Model wears size M</p>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div data-testid="quantity-selector">
              <p className="text-xs font-sans uppercase tracking-[0.2em] text-foreground mb-3">Quantity</p>
              <div className="flex items-center border border-brand-border w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2.5 hover:bg-brand-surface transition-colors" data-testid="qty-minus">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-sans" data-testid="qty-value">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2.5 hover:bg-brand-surface transition-colors" data-testid="qty-plus">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3 pt-2">
              <button onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-xs font-sans uppercase tracking-[0.2em] hover:bg-primary/90 transition-all"
                data-testid="add-to-cart-btn">
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>
              <Link to="/cart"
                className="w-full flex items-center justify-center border border-primary text-primary px-8 py-4 text-xs font-sans uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-all"
                data-testid="buy-now-btn"
                onClick={handleAddToCart}>
                Buy Now
              </Link>
            </div>

            {/* Details */}
            <div className="border-t border-brand-border pt-6 space-y-4" data-testid="product-details">
              <h3 className="text-xs font-sans uppercase tracking-[0.2em] text-primary">Product Details</h3>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed">{product.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm font-sans">
                <div><span className="text-muted-foreground">Fabric:</span> <span className="text-foreground">{product.fabric}</span></div>
                <div><span className="text-muted-foreground">Color:</span> <span className="text-foreground">{product.color}</span></div>
                <div><span className="text-muted-foreground">Fit:</span> <span className="text-foreground">{product.fit}</span></div>
                <div><span className="text-muted-foreground">Lining:</span> <span className="text-foreground">{product.lining || 'Standard'}</span></div>
                {product.care && <div className="col-span-2"><span className="text-muted-foreground">Care:</span> <span className="text-foreground">{product.care}</span></div>}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {reviews.total > 0 && (
          <section className="mt-16 lg:mt-24 border-t border-brand-border pt-12" data-testid="reviews-section">
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-foreground mb-8">Customer Reviews</h2>
            <div className="space-y-6 max-w-2xl">
              {reviews.reviews.map(r => (
                <div key={r.review_id} className="border-b border-brand-border pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'fill-primary text-primary' : 'text-brand-border'}`} />
                      ))}
                    </div>
                    <span className="text-xs font-sans text-muted-foreground">{r.user_name}</span>
                  </div>
                  <h4 className="text-sm font-sans font-medium text-foreground mb-1">{r.title}</h4>
                  <p className="text-sm font-sans text-muted-foreground">{r.body}</p>
                  {r.fit_feedback && <p className="text-xs font-sans text-primary mt-1">Fit: {r.fit_feedback}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16 lg:mt-24 border-t border-brand-border pt-12" data-testid="related-products">
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-foreground mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.map((p, i) => <ProductCard key={p.product_id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
