import React from 'react';

export default function AccLogo({ name, className }) {
  return (
    <div className={className}>
      <span>{name?.slice(0, 1)}</span>
    </div>
  );
};
