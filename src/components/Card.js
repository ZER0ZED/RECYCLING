import React from 'react';

const Card = ({ symbols }) => {
  return (
    <div className="card">
      {symbols.map((symbol, index) => (
        <span key={index} className="symbol">{symbol}</span>
      ))}
    </div>
  );
};

export default Card;
