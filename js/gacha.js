/* --- Gacha System for Hero Acquisition --- */
function openCapsule(capsuleType) {
  // Define hero pool with rarity probabilities.
  // For simplicity, we use a flat list. In a real system, weights can be applied based on capsuleType.
  const heroPool = [
    { name: "Warrior", rarity: "common", stats: { attack: 10, defense: 8 } },
    { name: "Mage", rarity: "common", stats: { attack: 12, defense: 5 } },
    { name: "Archer", rarity: "rare", stats: { attack: 15, defense: 7 } },
    { name: "Paladin", rarity: "rare", stats: { attack: 18, defense: 10 } },
    { name: "Assassin", rarity: "epic", stats: { attack: 25, defense: 6 } },
    { name: "Dragon Knight", rarity: "legendary", stats: { attack: 40, defense: 20 } }
  ];
  const randIndex = Math.floor(Math.random() * heroPool.length);
  return heroPool[randIndex];
}

// Expose openCapsule globally so other modules can use it.
if (typeof window !== 'undefined') {
  window.openCapsule = openCapsule;
} else {
  module.exports = { openCapsule };
}
