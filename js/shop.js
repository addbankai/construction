// shop.js

(function() {
  // Ensure HERO currency exists (default if not set)
  if (typeof window.heroCurrency === 'undefined') {
    window.heroCurrency = 1000;
  }
  // Ensure the global resources object exists; use window.resources.diamond as defined in index.html/js/main.js.
  if (typeof window.resources === 'undefined') {
    window.resources = { diamond: 500, gold: 1000 };
  }
  if (typeof window.resources.diamond === 'undefined') {
    window.resources.diamond = 500;
  }
  // Ensure playerInventory exists
  if (typeof window.playerInventory === 'undefined') {
    window.playerInventory = [];
  }

  // --- Fallback item images from your items.js ---
  var fallbackItemImages = {
    "Sword": "img/armory/sword1.png",
    "Shield": "img/armory/shield1.png",
    "Armor": "img/armory/armor1.png",
    "Ring": "img/armory/ring1.png",
    "Amulet": "img/armory/amulet1.png",
    "Potion": "img/armory/potion1.png",
    "Scroll": "img/armory/scroll1.png",
    "Boots": "img/armory/boots1.png",
    "Helmet": "img/armory/helmet1.png",
    "Gloves": "img/armory/glove4.png",
    "Bow": "img/armory/bow1.png",
    "Staff": "img/armory/staff1.png",
    "Katana": "img/armory/katana1.png",
    "Dagger": "img/armory/dagger1.png",
    "Knuckles": "img/armory/knuckles1.png",
    "TreasureBox": "img/armory/treasurebox1.png",
    "Capsule": "img/armory/Capsule1.png",
    "PhoenixCapsule": "img/armory/PhoenixCapsule1.png",
    "Enchantedtreasurebox": "img/armory/Enchantedtreasurebox1.png",
    "Enchantedscroll": "img/armory/Enchantedscroll1.png"
  };
  // Use window.itemImages if defined; otherwise use fallback.
  var images = window.itemImages || fallbackItemImages;

  // --- Special Templates for full special items (Hero Shop) ---
  var specialTemplates = {
    "Capsule": {
      name: "Capsule",
      itemType: "Capsule",
      image: images["Capsule"],
      getDescription: function() { return "Open to gain Hero"; },
      level: 1,
      lootable: false,
      upgradeLevel: 0
    },
    "PhoenixCapsule": {
      name: "PhoenixCapsule",
      itemType: "PhoenixCapsule",
      image: images["PhoenixCapsule"],
      getDescription: function() { return "Open To gain Legendary Hero"; },
      level: 1,
      lootable: false,
      upgradeLevel: 0
    },
    "Enchantedtreasurebox": {
      name: "Enchantedtreasurebox",
      itemType: "Enchantedtreasurebox",
      image: images["Enchantedtreasurebox"],
      getDescription: function() { return "Open to Gain legendary items"; },
      level: 1,
      lootable: false,
      upgradeLevel: 0
    },
    "Enchantedscroll": {
      name: "Enchantedscroll",
      itemType: "Enchantedscroll",
      image: images["Enchantedscroll"],
      getDescription: function() { return "Open to gain Skill Scroll"; },
      level: 1,
      lootable: false,
      upgradeLevel: 0
    }
  };

  // --- Helper: Create a styled shop button ---
  function createShopButton(text, onClick) {
    var btn = document.createElement("button");
    btn.innerText = text;
    btn.style.fontFamily = "'Press Start 2P', monospace";
    btn.style.fontSize = "14px";
    btn.style.padding = "10px 15px";
    btn.style.margin = "10px";
    btn.style.border = "2px solid #FFD700";
    btn.style.borderRadius = "8px";
    btn.style.background = "#333";
    btn.style.color = "#FFD700";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "4px 4px 0 #000";
    btn.addEventListener("click", onClick);
    btn.addEventListener("mouseover", function() {
      btn.style.background = "#444";
    });
    btn.addEventListener("mouseout", function() {
      btn.style.background = "#333";
    });
    return btn;
  }

  // --- Helper: Show a modal alert (custom modal instead of window.alert) ---
  function showModalAlert(message) {
    var overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.8)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "4000";

    var modal = document.createElement("div");
    modal.style.position = "relative";
    modal.style.width = "90%";
    modal.style.maxWidth = "400px";
    modal.style.background = "#222";
    modal.style.border = "2px solid #FFD700";
    modal.style.padding = "20px";
    modal.style.fontFamily = "'Press Start 2P', monospace";
    modal.style.fontSize = "14px";
    modal.style.color = "#FFD700";
    modal.style.textAlign = "center";
    modal.style.borderRadius = "8px";

    var msg = document.createElement("p");
    msg.innerText = message;
    msg.style.wordWrap = "break-word";
    modal.appendChild(msg);

    var closeBtn = createShopButton("Close", function() {
      overlay.remove();
    });
    // Position close button at top right.
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    modal.appendChild(closeBtn);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  // --- Helper: Add currency info to a modal ---
  function addCurrencyInfo(modal) {
    var currencyDiv = document.createElement("div");
    currencyDiv.style.position = "absolute";
    currencyDiv.style.top = "10px";
    currencyDiv.style.left = "10px";
    currencyDiv.style.fontFamily = "'Press Start 2P', monospace";
    currencyDiv.style.fontSize = "12px";
    currencyDiv.style.color = "#FFD700";
    currencyDiv.innerText = "$HERO: " + window.heroCurrency + "  |  DIAMOND: " + window.resources.diamond;
    modal.appendChild(currencyDiv);
  }

  // --- Add the "SHOP" button to the rightMenu ---
  function addShopButton() {
    var rightMenu = document.getElementById("rightMenu");
    if (rightMenu) {
      var btn = document.createElement("button");
      btn.innerText = "SHOP";
      btn.style.fontFamily = "'Press Start 2P', monospace";
      btn.style.fontSize = "14px";
      btn.style.padding = "10px 15px";
      btn.style.margin = "5px";
      btn.style.border = "2px solid #FFD700";
      btn.style.borderRadius = "8px";
      btn.style.background = "#333";
      btn.style.color = "#FFD700";
      btn.style.cursor = "pointer";
      btn.style.boxShadow = "4px 4px 0 #000";
      btn.addEventListener("click", function() {
        showShopModal();
      });
      rightMenu.appendChild(btn);
    }
  }

  // --- Main Shop Modal ---
  function showShopModal() {
    var overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.8)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "3000";

    var modal = document.createElement("div");
    modal.style.position = "relative";
    // Set modal to 95% width, max 1000px.
    modal.style.width = "95%";
    modal.style.maxWidth = "1000px";
    modal.style.background = "#222";
    modal.style.border = "2px solid #FFD700";
    modal.style.padding = "20px";
    modal.style.fontFamily = "'Press Start 2P', monospace";
    modal.style.fontSize = "14px";
    modal.style.color = "#FFD700";
    modal.style.textAlign = "center";
    modal.style.borderRadius = "8px";
    modal.style.maxHeight = "80vh";
    modal.style.overflowY = "auto";

    // Add a Close button at top right.
    var closeBtn = createShopButton("X", function() {
      overlay.remove();
    });
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    modal.appendChild(closeBtn);

    addCurrencyInfo(modal);

    var titleElem = document.createElement("h2");
    titleElem.innerText = "Marketplace Shop";
    modal.appendChild(titleElem);

    // Shop category buttons.
    var heroShopBtn = createShopButton("Hero Shop", function() {
      overlay.remove();
      showHeroShop();
    });
    modal.appendChild(heroShopBtn);

    var mysteryShopBtn = createShopButton("Mystery Shop", function() {
      overlay.remove();
      showMysteryShop();
    });
    modal.appendChild(mysteryShopBtn);

    var auctionHouseBtn = createShopButton("Auction House (SOON)", function() {
      overlay.remove();
      showAuctionHouse();
    });
    auctionHouseBtn.disabled = true;
    modal.appendChild(auctionHouseBtn);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  // --- Hero Shop Modal ---
  function showHeroShop() {
    var overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.8)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "3000";

    var modal = document.createElement("div");
    modal.style.position = "relative";
    modal.style.width = "95%";
    modal.style.maxWidth = "1000px";
    modal.style.background = "#222";
    modal.style.border = "2px solid #FFD700";
    modal.style.padding = "20px";
    modal.style.fontFamily = "'Press Start 2P', monospace";
    modal.style.fontSize = "14px";
    modal.style.color = "#FFD700";
    modal.style.textAlign = "center";
    modal.style.borderRadius = "8px";
    modal.style.maxHeight = "80vh";
    modal.style.overflowY = "auto";

    var closeBtn = createShopButton("X", function() {
      overlay.remove();
    });
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    modal.appendChild(closeBtn);

    addCurrencyInfo(modal);

    var titleElem = document.createElement("h2");
    titleElem.innerText = "Hero Shop";
    modal.appendChild(titleElem);

    var currencyDisplay = document.createElement("p");
    currencyDisplay.innerText = "HERO: " + window.heroCurrency;
    modal.appendChild(currencyDisplay);

    // Grid layout for items.
    var itemsContainer = document.createElement("div");
    itemsContainer.style.display = "grid";
    itemsContainer.style.gridTemplateColumns = "repeat(auto-fit, minmax(150px, 1fr))";
    itemsContainer.style.gap = "10px";
    itemsContainer.style.marginTop = "20px";

    // Use capitalized names to match your items.js special types.
    var shopItems = [
      { type: "Capsule", price: 100 },
      { type: "PhoenixCapsule", price: 500 },
      { type: "Enchantedtreasurebox", price: 500 },
      { type: "Enchantedscroll", price: 250 }
    ];

    shopItems.forEach(function(si) {
      // For special items, return a full item object from our template.
      var item;
      if (["Capsule", "PhoenixCapsule", "Enchantedtreasurebox", "Enchantedscroll"].includes(si.type)) {
        // Clone the special template.
        item = Object.assign({}, specialTemplates[si.type]);
      } else {
        item = createShopItem(si.type);
      }
      var itemDiv = document.createElement("div");
      itemDiv.style.border = "1px solid #FFD700";
      itemDiv.style.padding = "10px";
      itemDiv.style.textAlign = "center";
      itemDiv.style.borderRadius = "8px";
      itemDiv.style.background = "#333";
      itemDiv.style.overflowWrap = "break-word";

      // Create a flex container so that the price and button are always at the bottom.
      var contentContainer = document.createElement("div");
      contentContainer.style.display = "flex";
      contentContainer.style.flexDirection = "column";
      contentContainer.style.height = "100%";

      var topContainer = document.createElement("div");
      // Image and text container.
      var img = document.createElement("img");
      img.src = images[si.type] || "https://via.placeholder.com/80";
      img.style.width = "80px";
      img.style.height = "80px";
      img.style.marginBottom = "10px";
      topContainer.appendChild(img);

      var nameDiv = document.createElement("div");
      nameDiv.innerText = item.name;
      nameDiv.style.marginBottom = "5px";
      nameDiv.style.fontWeight = "bold";
      topContainer.appendChild(nameDiv);

      var descDiv = document.createElement("div");
      descDiv.innerText = item.getDescription();
      descDiv.style.fontSize = "10px";
      descDiv.style.marginBottom = "5px";
      topContainer.appendChild(descDiv);

      contentContainer.appendChild(topContainer);

      var bottomContainer = document.createElement("div");
      bottomContainer.style.marginTop = "auto";
      
      var priceDiv = document.createElement("div");
      priceDiv.innerText = si.price + " HERO";
      priceDiv.style.backgroundColor = "#FFD700";
      priceDiv.style.color = "#222";
      priceDiv.style.padding = "3px 6px";
      priceDiv.style.borderRadius = "4px";
      priceDiv.style.marginBottom = "5px";
      priceDiv.style.fontWeight = "bold";
      bottomContainer.appendChild(priceDiv);

      var buyBtn = createShopButton("Buy", function() {
        if (window.heroCurrency >= si.price) {
          window.heroCurrency -= si.price;
          if (window.playerInventory && Array.isArray(window.playerInventory)) {
            window.playerInventory.push(item);
          }
          showModalAlert("Purchase successful! You bought a " + item.name);
          currencyDisplay.innerText = "HERO: " + window.heroCurrency;
        } else {
          showModalAlert("Not enough HERO currency!");
        }
      });
      bottomContainer.appendChild(buyBtn);

      contentContainer.appendChild(bottomContainer);
      itemDiv.appendChild(contentContainer);
      itemsContainer.appendChild(itemDiv);
    });

    modal.appendChild(itemsContainer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  // --- Mystery Shop Modal ---
  // Resets every hour; displays 6 items in a 3–grid layout.
  function showMysteryShop() {
    // Remove any existing mystery shop overlay.
    var existingOverlay = document.querySelector('.mystery-shop-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }
    
    // Retrieve or generate mystery shop data.
    var shopData = localStorage.getItem("mysteryShopData");
    var currentTime = Date.now();
    var oneHour = 3600 * 1000;
    var data;
    if (shopData) {
      try {
        data = JSON.parse(shopData);
      } catch (e) {
        console.error("Error parsing mystery shop data:", e);
        data = null;
      }
    }
    if (!data || (currentTime - data.timestamp) >= oneHour) {
      data = {
        timestamp: currentTime,
        items: []
      };
      for (var i = 0; i < 6; i++) {
        data.items.push(generateMysteryShopItem());
      }
      localStorage.setItem("mysteryShopData", JSON.stringify(data));
    }
    var timeRemaining = oneHour - (currentTime - data.timestamp);

    var overlay = document.createElement("div");
    overlay.className = "mystery-shop-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.8)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "3000";

    var modal = document.createElement("div");
    modal.style.position = "relative";
    modal.style.width = "90%";
    modal.style.maxWidth = "1000px";
    modal.style.background = "#222";
    modal.style.border = "2px solid #FFD700";
    modal.style.padding = "20px";
    modal.style.fontFamily = "'Press Start 2P', monospace";
    modal.style.fontSize = "14px";
    modal.style.color = "#FFD700";
    modal.style.textAlign = "center";
    modal.style.borderRadius = "8px";
    modal.style.maxHeight = "80vh";
    modal.style.overflowY = "auto";

    // Add a Close button at top right.
    var closeBtn = createShopButton("X", function() {
      overlay.remove();
      clearInterval(timerInterval);
    });
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    modal.appendChild(closeBtn);

    addCurrencyInfo(modal);

    var titleElem = document.createElement("h2");
    titleElem.innerText = "Mystery Shop";
    modal.appendChild(titleElem);

    var currencyDisplay = document.createElement("p");
    currencyDisplay.innerText = "DIAMOND: " + window.resources.diamond;
    modal.appendChild(currencyDisplay);

    var resetNote = document.createElement("p");
    resetNote.style.fontSize = "12px";
    resetNote.innerText = "Mystery Shop resets every hour.";
    modal.appendChild(resetNote);

    // Timer display for next shuffle.
    var timerDiv = document.createElement("div");
    timerDiv.style.fontSize = "12px";
    timerDiv.style.marginBottom = "10px";
    modal.appendChild(timerDiv);

    function updateTimer() {
      var now = Date.now();
      var remaining = oneHour - (now - data.timestamp);
      if (remaining < 0) remaining = 0;
      var seconds = Math.floor((remaining / 1000) % 60);
      var minutes = Math.floor((remaining / 1000 / 60) % 60);
      var hours = Math.floor((remaining / 1000 / 3600));
      timerDiv.innerText = "Next shuffle in: " + hours + "h " + minutes + "m " + seconds + "s";
    }
    updateTimer();
    var timerInterval = setInterval(updateTimer, 1000);

    // Grid layout for mystery shop items (3 columns)
    var itemsContainer = document.createElement("div");
    itemsContainer.style.display = "grid";
    itemsContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
    itemsContainer.style.gap = "10px";
    itemsContainer.style.marginTop = "20px";

    data.items.forEach(function(item) {
      var price = computePrice(item);
      var itemDiv = document.createElement("div");
      itemDiv.style.border = "1px solid #FFD700";
      itemDiv.style.padding = "10px";
      itemDiv.style.textAlign = "center";
      itemDiv.style.borderRadius = "8px";
      itemDiv.style.background = "#333";
      itemDiv.style.overflowWrap = "break-word";

      var img = document.createElement("img");
      img.src = item.image || "https://via.placeholder.com/80";
      img.style.width = "80px";
      img.style.height = "80px";
      img.style.marginBottom = "10px";
      itemDiv.appendChild(img);

      var nameDiv = document.createElement("div");
      nameDiv.innerText = item.name;
      nameDiv.style.marginBottom = "5px";
      nameDiv.style.fontWeight = "bold";
      itemDiv.appendChild(nameDiv);

      var descDiv = document.createElement("div");
      descDiv.innerText = item.getDescription();
      descDiv.style.fontSize = "10px";
      descDiv.style.marginBottom = "5px";
      itemDiv.appendChild(descDiv);

      var priceDiv = document.createElement("div");
      priceDiv.innerText = price + " DIAMOND";
      priceDiv.style.backgroundColor = "#FFD700";
      priceDiv.style.color = "#222";
      priceDiv.style.padding = "3px 6px";
      priceDiv.style.borderRadius = "4px";
      priceDiv.style.marginBottom = "5px";
      priceDiv.style.fontWeight = "bold";
      itemDiv.appendChild(priceDiv);

      var buyBtn = createShopButton("Buy", function() {
        if (window.resources.diamond >= price) {
          window.resources.diamond -= price;
          if (window.playerInventory && Array.isArray(window.playerInventory)) {
            window.playerInventory.push(item);
          }
          showModalAlert("Purchase successful! You bought a " + item.name);
          currencyDisplay.innerText = "DIAMOND: " + window.resources.diamond;
        } else {
          showModalAlert("Not enough DIAMOND currency!");
        }
      });
      itemDiv.appendChild(buyBtn);

      itemsContainer.appendChild(itemDiv);
    });

    modal.appendChild(itemsContainer);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  // --- Auction House Modal (Coming Soon) ---
  function showAuctionHouse() {
    var overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.8)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "3000";

    var modal = document.createElement("div");
    modal.style.position = "relative";
    modal.style.width = "95%";
    modal.style.maxWidth = "1000px";
    modal.style.background = "#222";
    modal.style.border = "2px solid #FFD700";
    modal.style.padding = "20px";
    modal.style.fontFamily = "'Press Start 2P', monospace";
    modal.style.fontSize = "14px";
    modal.style.color = "#FFD700";
    modal.style.textAlign = "center";
    modal.style.borderRadius = "8px";
    modal.style.maxHeight = "80vh";
    modal.style.overflowY = "auto";

    var closeBtn = createShopButton("X", function() {
      overlay.remove();
    });
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    modal.appendChild(closeBtn);

    addCurrencyInfo(modal);

    var titleElem = document.createElement("h2");
    titleElem.innerText = "Auction House";
    modal.appendChild(titleElem);

    var info = document.createElement("p");
    info.innerText = "Coming Soon!";
    modal.appendChild(info);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  // --- Helper: Create a shop item object for Hero Shop ---
  function createShopItem(itemType) {
    // For special items, return a full object from our specialTemplates.
    if (["Capsule", "PhoenixCapsule", "Enchantedtreasurebox", "Enchantedscroll"].includes(itemType)) {
      return Object.assign({}, specialTemplates[itemType]);
    }
    // Otherwise, return a minimal object.
    var image = images[itemType] || "https://via.placeholder.com/80";
    var name = itemType.charAt(0).toUpperCase() + itemType.slice(1);
    return {
      name: name,
      itemType: itemType,
      image: image,
      getDescription: function() { return name; } // Minimal description for regular items.
    };
  }

  // --- Helper: Generate a Mystery Shop item ---
  function generateMysteryShopItem() {
    var item;
    do {
      item = window.generateRandomItem();
    } while (
      ["Capsule", "PhoenixCapsule", "Enchantedtreasurebox", "Enchantedscroll"].includes(item.itemType) &&
      Math.random() >= 0.01
    );
    return item;
  }

  // --- Helper: Compute price for mystery shop items ---
  function computePrice(item) {
    var fixedPrices = {
      "Capsule": 100,
      "PhoenixCapsule": 500,
      "Enchantedtreasurebox": 500,
      "Enchantedscroll": 250
    };
    if (!item.power || isNaN(item.power)) {
      return fixedPrices[item.itemType] || 100;
    } else {
      var price = item.power * 10;
      if (price < 100) price = 100;
      if (price > 100000) price = 100000;
      return Math.floor(price);
    }
  }

  // --- Initialize: Add the SHOP button to rightMenu ---
  addShopButton();

})();
