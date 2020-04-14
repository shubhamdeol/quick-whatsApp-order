type Item = {
  name: string;
  quantity: number;
};

type OrderObject = {
  name: string;
  quantity: string;
  address: string;
  note: string;
  items: Item[];
};

export const generateOrderDetailString = (orderInfo: OrderObject) => {
  const details = orderInfo.items.map((item: Item) => {
    const productInfoString = `- \`\`\`${
      item.name
    }\`\`\`\n *x* *${item.quantity.toString()}*\n\n`;
    return productInfoString;
  });

  const greetings = `Hi find my order details\n\n`;

  const orderString = `${greetings}${details.join(" ")}${
    orderInfo.name ? `*Name:* ${orderInfo.name}\n` : ""
  }${orderInfo.address ? `*Address:* ${orderInfo.address}\n` : ""}${
    orderInfo.note ? `*Note:* ${orderInfo.note}\n` : ""
  }\n`;
  return orderString;
};
