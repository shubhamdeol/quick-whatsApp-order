interface IItem {
  name: string;
  quantity: number;
}

type OrderObject = {
  name: string;
  address: string;
  note: string;
  items: IItem[];
};

export const generateOrderDetailString = (orderInfo: OrderObject): string => {
  const details = orderInfo.items.map((item: IItem) => {
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
