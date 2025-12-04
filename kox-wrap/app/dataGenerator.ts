// app/dataGenerator.ts

const seededRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
};

export const generateWrapData = (handle: string, category: string) => {
  const cleanHandle = handle.replace('@', '').toLowerCase();
  
  // 1. Generate Standard Metrics
  const baseDms = Math.floor(seededRandom(cleanHandle + 'dms') * 5000) + 1200;
  
  const couriers = ['Fargo Courier', 'Wells Fargo', 'G4S', 'Rider wa Nduthi', 'Pick-Up Mtaani', 'Sendy (RIP)'];
  const courierIndex = Math.floor(seededRandom(cleanHandle + 'courier') * couriers.length);
  const selectedCourier = couriers[courierIndex];

  const ghostRate = Math.floor(seededRandom(cleanHandle + 'ghost') * 40) + 50; 

  // 2. Category Specific Money Logic
  let moneyMetric = 'Ksh. 8.4M';
  let moneySub = 'Total value of transactions. The economy rests on your shoulders.';
  
  if (category === 'thrift') {
    moneyMetric = 'Ksh. 450,000';
    moneySub = 'Total spent on "Bale ya Camera" that turned out to be pure dust.';
  } else if (category === 'tech') {
    moneyMetric = 'Ksh. 2.1M';
    moneySub = 'Amount currently stuck in "Waiting for client to pay deposit".';
  } else if (category === 'food') {
    moneyMetric = '3,400';
    moneySub = 'Plastic containers currently missing in people\'s houses.';
  }

  // 3. THE ROAST LOGIC (New Feature 🔥)
  let roastText = "";
  const roastMetric = "💀"; // The big emoji
  
  if (category === 'tech') {
    const techRoasts = [
      "You tweeted 'Learning Rust' 50 times but your portfolio is still empty.",
      "You spent more time setting up your VS Code theme than actually coding.",
      "Your GitHub contribution graph looks like a barcode for a pack of orbit gum.",
      "You are one 'Client refused to pay' away from going back to the village."
    ];
    roastText = techRoasts[Math.floor(seededRandom(cleanHandle + 'roast') * techRoasts.length)];
  } 
  else if (category === 'thrift') {
    const thriftRoasts = [
      "You called it 'Vintage' but we know it's Gikomba bottom bale.",
      "You sold a distinct 'Nikee' hoodie and blocked the customer.",
      "Stop lying that the stain will 'wash off'. It has been there since 1999.",
      "Your 'DM for Price' strategy is why you still have stock from January."
    ];
    roastText = thriftRoasts[Math.floor(seededRandom(cleanHandle + 'roast') * thriftRoasts.length)];
  } 
  else if (category === 'food') {
    const foodRoasts = [
      "Your 'Small Platter' feeds a toddler, but the price feeds a family.",
      "You charge 200 bob for delivery then make the customer walk to the stage.",
      "We know you buy those pastries from Supermarket and repackage them.",
      "You claimed 'Sold Out' but you just ate the remaining stock."
    ];
    roastText = foodRoasts[Math.floor(seededRandom(cleanHandle + 'roast') * foodRoasts.length)];
  } 
  else {
    // General Roasts
    const genRoasts = [
      "You replied 'Available' to 400 people and 399 left you on read.",
      "You are the reason M-Pesa sends 'Confirmed' messages at 2 AM.",
      "Your 'Business Phone' is just your personal phone with a WhatsApp status.",
      "You have rebranded 4 times this year. Are you a business or a fugitive?"
    ];
    roastText = genRoasts[Math.floor(seededRandom(cleanHandle + 'roast') * genRoasts.length)];
  }

  // 4. Persona Logic
  const personas = ['The Resilience Merchant', 'The Logistics Warlord', 'The Twitter Admin', 'The Ghosted King', 'The Refund Denier'];
  const personaIndex = Math.floor(seededRandom(cleanHandle + 'persona') * personas.length);
  
  // 5. Return the Data Array (Including the Roast Slide)
  return [
    {
      id: 1,
      title: 'The Customer Service Award',
      metric: baseDms.toLocaleString(),
      subtext: 'Times you replied "Check DM" instead of just answering the question.',
      theme: 'blue',
    },
    {
      id: 2,
      title: 'Logistics Hero',
      metric: selectedCourier,
      subtext: 'Your most trusted partner. They only ignored your calls twice.',
      theme: 'green',
    },
    {
      id: 3,
      title: 'The Reality Check', // <--- THE ROAST SLIDE
      metric: roastMetric,
      subtext: roastText,
      theme: 'red', // Red for danger/roast
    },
    {
      id: 4,
      title: 'Money Moves',
      metric: moneyMetric,
      subtext: moneySub,
      theme: 'purple',
    },
    {
      id: 5,
      title: 'Your 2024 Vendor Persona',
      metric: personas[personaIndex],
      subtext: 'You survived the drag, the inflation, and the slow days. You are a true hustler.',
      theme: 'final',
    },
  ];
};