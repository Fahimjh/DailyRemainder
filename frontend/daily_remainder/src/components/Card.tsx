import React from "react";
import "./Card.css";

interface Props {
  title: string;
  subtitle?: string;
  onClick?: () => void;
}

const Card: React.FC<Props> = ({ title, subtitle, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <h3>{title}</h3>
      {subtitle && <p className="card-subtitle">{subtitle}</p>}
    </div>
  );
};

export default Card;
