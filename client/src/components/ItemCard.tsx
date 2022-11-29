import React from "react";

interface Props {
  item: {
    title: string;
    id: number;
    tokkulPrice: number;
    price: number;
    amount: number;
    totalPrice: string;
    image: string;
  };
}

const ItemCard: React.FC<Props> = ({ item }) => {
  return (
    <div className="item-card">
      <div className="item-card-image">
        <img src={item.image} alt={item.title} />
      </div>
      <div className="item-card-info">
        <h3>{item.title}</h3>
        <p>Amount: {item.amount}</p>
        <p>Price: {item.price}</p>
        <p>Tokkul Price: {item.tokkulPrice}</p>
        <p>Total Price: {item.totalPrice}</p>
      </div>
    </div>
  );
};

export default ItemCard;
