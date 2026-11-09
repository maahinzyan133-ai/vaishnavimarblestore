const WHATSAPP_NUMBER = '917003948297';

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function whatsappProductOrder(productName: string, price: string, quantity: number = 1): string {
  const msg = `Hello Vaishnavi Marble,\n\nI would like to order:\n\nProduct: ${productName}\nPrice: ${price}\nQuantity: ${quantity}\n\nPlease confirm availability and delivery details.\n\nThank you.`;
  return whatsappLink(msg);
}

export function whatsappCartOrder(items: { name: string; price: string; quantity: number }[], total: string): string {
  let msg = `Hello Vaishnavi Marble,\n\nI would like to place an order:\n\n`;
  items.forEach((item, i) => {
    msg += `${i + 1}. ${item.name}\n   Price: ${item.price} | Qty: ${item.quantity}\n`;
  });
  msg += `\nTotal: ${total}\n\nPlease confirm availability and delivery details.\n\nThank you.`;
  return whatsappLink(msg);
}

export function whatsappEnquiry(message: string): string {
  return whatsappLink(`Hello Vaishnavi Marble,\n\n${message}`);
}
