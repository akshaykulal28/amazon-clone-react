import React from 'react';
import ProductCard from './ProductCard';

const ProductCardGrid = ({ 
  products, 
  variant = 'default', 
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  showAnimation = true 
}) => {
  const getColumnClasses = () => {
    const { xs, sm, md, lg, xl } = columns;
    let classes = `row-cols-${xs}`;
    if (sm) classes += ` row-cols-sm-${sm}`;
    if (md) classes += ` row-cols-md-${md}`;
    if (lg) classes += ` row-cols-lg-${lg}`;
    if (xl) classes += ` row-cols-xl-${xl}`;
    return classes;
  };

  return (
    <div className={`row ${getColumnClasses()} g-4`}>
      {products.map((product, index) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          variant={variant}
          style={showAnimation ? { animationDelay: `${index * 0.1}s` } : {}}
          className={showAnimation ? 'animate-in' : ''}
        />
      ))}
    </div>
  );
};

export default ProductCardGrid;
