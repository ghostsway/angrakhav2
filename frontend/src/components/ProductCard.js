import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProductCard({ product, index = 0 }) {
  const { name, slug, price, compare_price, images, category, tags } = product;
  const hasDiscount = compare_price && compare_price > price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="product-card group"
      data-testid={`product-card-${slug}`}
    >
      <Link to={`/products/${slug}`} className="block">
        {/* Image */}
        <div className="img-zoom aspect-[3/4] bg-brand-surface relative">
          <img
            src={images?.[0] || ''}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {tags?.includes('new') && (
            <span className="absolute top-3 left-3 text-[10px] font-sans uppercase tracking-[0.2em] bg-primary text-primary-foreground px-3 py-1" data-testid={`product-tag-new-${slug}`}>
              New
            </span>
          )}
          {tags?.includes('bestseller') && (
            <span className="absolute top-3 right-3 text-[10px] font-sans uppercase tracking-[0.2em] bg-brand-surface/90 text-foreground px-3 py-1 border border-brand-border">
              Bestseller
            </span>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 space-y-1.5">
          <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground">
            {category?.replace('_', ' ')}
          </p>
          <h3 className="font-serif text-lg font-light text-foreground group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-sans text-primary font-medium">
              Rs {price?.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-xs font-sans text-muted-foreground line-through">
                Rs {compare_price?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
