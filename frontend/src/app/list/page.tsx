import React from "react";

const 상품 = [
  { id: 1, name: "사진1", price: 20 },
  { id: 2, name: "사진2", price: 20 },
  { id: 3, name: "사진3", price: 20 },
];
const List = () => {
  return (
    <div>
      <h4>상품 목록</h4>
      {상품.map((item) => (
        <div key={item.id}>
          <h4>
            {item.name} {item.price}$
          </h4>
        </div>
      ))}
    </div>
  );
};

export default List;
