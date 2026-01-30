import React from 'react';

const DANGEROUS_PROPS = ['dangerouslySetInnerHTML', 'suppressContentEditableWarning', 'suppressHydrationWarning'];

const Card = ({ children, className = '', hover = true, ...props }) => {
  const safeProps = { ...props };
  DANGEROUS_PROPS.forEach((key) => delete safeProps[key]);

  return (
    <div
      className={`card-base ${hover ? 'hover:shadow-lg hover:shadow-purple-400/10' : ''} ${className}`}
      {...safeProps}
    >
      {children}
    </div>
  );
};

export default Card;

