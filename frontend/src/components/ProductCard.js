import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../Services/api';

const ProductCard = ({ product }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [qty, setQty] = useState(1);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      window.location.href = '/login';
      return;
    }
    
    try {
      setIsAddingToCart(true);
      await api.post('/cartwishlist/cart', { productId: product._id, qty: qty });
      alert('Added to cart successfully!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to wishlist');
      window.location.href = '/login';
      return;
    }
    
    try {
      setIsAddingToWishlist(true);
      await api.post('/cartwishlist/wishlist', { productId: product._id });
      alert('Added to wishlist successfully!');
    } catch (err) {
      console.error('Failed to add to wishlist:', err);
      alert('Failed to add to wishlist. Please try again.');
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  return (
    <div className="card" style={{ 
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      background: '#0b0b0b',
      border: '1px solid #333',
      color: '#e5e7eb'
    }}>
      {/* Product Image */}
      <div style={{ 
        position: 'relative', 
        height: '200px', 
        overflow: 'hidden',
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <img 
          src={product.image || '/api/placeholder/300/200'} 
          alt={product.name} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transition: 'transform 0.2s ease'
          }}
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
          }}
        />
        
        {/* Stock Badge */}
        {product.stock <= 0 && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: '#ef4444',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            Out of Stock
          </div>
        )}
        
        {/* Quick Actions */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          opacity: 0,
          transition: 'opacity 0.2s ease'
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToWishlist();
            }}
            disabled={isAddingToWishlist}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}
          >
            {isAddingToWishlist ? '⏳' : '❤️'}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div style={{ padding: '0 4px' }}>
        <h3 style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          color: '#ffffff', 
          marginBottom: '8px',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.name}
        </h3>
        
        <p style={{ 
          color: '#cbd5e1', 
          fontSize: '14px', 
          marginBottom: '12px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.4'
        }}>
          {product.description}
        </p>

        {/* Price and Rating */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div>
            <span style={{ 
              fontSize: '20px', 
              fontWeight: '700', 
              color: '#ffffff' 
            }}>
              ${product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={{ 
                fontSize: '14px', 
                color: '#94a3b8', 
                textDecoration: 'line-through',
                marginLeft: '8px'
              }}>
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          {product.averageRating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '14px', color: '#fbbf24' }}>⭐</span>
              <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                {product.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Stock Status */}
        <div style={{ marginBottom: '16px' }}>
          {product.stock > 0 ? (
            <span style={{ 
              fontSize: '12px', 
              color: '#166534',
              background: '#dcfce7',
              padding: '4px 8px',
              borderRadius: '4px',
              fontWeight: '500'
            }}>
              {product.stock} in stock
            </span>
          ) : (
            <span style={{ 
              fontSize: '12px', 
              color: '#dc2626',
              background: '#fecaca',
              padding: '4px 8px',
              borderRadius: '4px',
              fontWeight: '500'
            }}>
              Out of stock
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              aria-label="Decrease quantity"
              onClick={() => setQty(prev => Math.max(1, prev - 1))}
              style={{ width: 32, height: 32, borderRadius: 6, background: '#000', color: '#fff', border: '1px solid #222', fontSize: 18, lineHeight: 1 }}
            >−</button>
            <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 600 }}>{qty}</span>
            <button
              aria-label="Increase quantity"
              onClick={() => setQty(prev => Math.min(product.stock || 99, prev + 1))}
              style={{ width: 32, height: 32, borderRadius: 6, background: '#000', color: '#fff', border: '1px solid #222', fontSize: 18, lineHeight: 1 }}
            >+</button>
          </div>

          <Link 
            to={`/product/${product._id}`}
            style={{ 
              flex: 1,
              padding: '10px 16px',
              background: '#000',
              color: '#fff',
              border: '1px solid #222',
              borderRadius: '6px',
              textDecoration: 'none',
              textAlign: 'center',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            View Details
          </Link>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || isAddingToCart}
            style={{
              flex: 1,
              padding: '10px 16px',
              background: product.stock <= 0 ? '#444' : '#000',
              color: '#fff',
              border: '1px solid #222',
              borderRadius: '6px',
              cursor: product.stock <= 0 ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              opacity: product.stock <= 0 ? 0.6 : 1
            }}
          >
            {isAddingToCart ? 'Adding...' : product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
  </div>
);
};

export default ProductCard;