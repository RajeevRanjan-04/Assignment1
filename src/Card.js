import React from 'react';
import './Card.css'; 
import tdot from './img/3dot.svg'
const Card = ({ card, user }) => {
  return (
    <div className="card">
     
      <h2 className='card-id'>{card.id}</h2>
      <h3 className="card-title">{card.title}</h3>
      <p className="card-status">Status: {card.status}</p>
       <div className='fl'>
       <div className='tdot' > <img src={tdot}></img> </div>
      <div className="card-tags">
        {card.tag.map((tag, index) => (
          <span key={index} className="card-tag">{tag}</span>
        ))}
      </div>
       </div>
    </div>
  );
};

export default Card;
