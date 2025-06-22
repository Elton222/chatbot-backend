exports.getAIResponse = async (userMessage) => {
  const msg = userMessage.toLowerCase();

  if (msg.includes('recommend') || msg.includes('suggest')) {
    return 'Sure! Popular products today include fresh tomatoes, organic onions, and hybrid maize seeds.';
  
  } else if (msg.includes('buy') || msg.includes('purchase')) {
    return 'To buy, just tap the product. You’ll see the seller’s phone number to call and negotiate.';
  
  } else if (msg.includes('sell') || msg.includes('upload')) {
    return 'To sell your product, go to the "Add Product" section and fill in the name, price, image, and category.';
  
  } else if (msg.includes('price') || msg.includes('cost')) {
    return 'Prices vary per product. Tap on any product to see the current price, seller, and region.';
  
  } else if (msg.includes('contact') || msg.includes('call')) {
    return 'To contact a seller, tap on the product to get their phone number and call them directly.';
  
  } else if (msg.includes('payment') || msg.includes('pay')) {
    return 'Payments are made directly between you and the seller. We recommend using mobile money after confirming the product.';
  
  } else if (msg.includes('delivery') || msg.includes('ship')) {
    return 'Delivery arrangements are made between you and the seller. Please confirm terms before paying.';
  
  } else if (msg.includes('trends') || msg.includes('market')) {
    return 'The latest market trend: Tomato prices have increased by 10% due to seasonal demand.';
  
  } else if (msg.includes('report') || msg.includes('issue')) {
    return 'If you want to report a problem or scam, please go to "Settings > Report" or contact support via WhatsApp.';
  
  } else {
    return 'Hi there! I can assist you with buying, selling, product uploads, and price info. How can I help you today?';
  }
};
