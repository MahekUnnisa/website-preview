import React from 'react';

const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div
      className={`card-base ${hover ? 'hover:shadow-lg hover:shadow-purple-400/10' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

