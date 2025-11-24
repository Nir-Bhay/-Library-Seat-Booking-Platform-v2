import React from 'react';

const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div 
      className={`card ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
