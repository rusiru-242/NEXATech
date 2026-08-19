function getCurrentUserId() {
  try {
    const raw = localStorage.getItem("nexatech_user");
    if (!raw) return null;
    const user = JSON.parse(raw);
    const id = user?._id || user?.id || user?.user?._id || user?.user?.id;
    return id ? String(id) : null;
  } catch (e) {
    return null;
  }
}

function keyForUser(userId) {
  if (userId) return `nexatech_cart_${userId}`;
  return "nexatech_cart"; // guest key
}

export function getCart() {
  try {
    const userId = getCurrentUserId();
    const key = keyForUser(userId);

    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }

    return [];
  } catch (err) {
    console.error("getCart parse error:", err);
    return [];
  }
}

export function saveCart(cart) {
  try {
    const userId = getCurrentUserId();
    const key = keyForUser(userId);

    const data = Array.isArray(cart) ? cart : [];
    localStorage.setItem(key, JSON.stringify(data));

    // Notify other windows/listeners
    try {
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (e) {
      // ignore
    }
  } catch (err) {
    console.error("saveCart error:", err);
  }
}

// Migrate guest cart (nexatech_cart) into the user's cart key. Merges quantities for same product ids.
export function migrateGuestCartToUser(userId) {
  try {
    if (!userId) return;

    const guestRaw = localStorage.getItem("nexatech_cart");
    if (!guestRaw) return;

    let guest = [];
    try {
      const parsed = JSON.parse(guestRaw);
      if (Array.isArray(parsed)) guest = parsed;
    } catch (e) {
      // if guest cart is corrupted, clear it
      localStorage.removeItem("nexatech_cart");
      return;
    }

    const userKey = keyForUser(userId);
    const userRaw = localStorage.getItem(userKey);
    let userCart = [];

    try {
      const parsedUser = JSON.parse(userRaw || "[]");
      if (Array.isArray(parsedUser)) userCart = parsedUser;
    } catch (e) {
      userCart = [];
    }

    // Merge by _id: prefer userCart quantities and add missing items from guest
    const map = new Map();
    userCart.forEach((item) => map.set(item._id, { ...item }));

    guest.forEach((g) => {
      if (!g || !g._id) return;
      const existing = map.get(g._id);
      if (existing) {
        existing.quantity = Math.max(existing.quantity || 0, g.quantity || 0);
      } else {
        map.set(g._id, { ...g });
      }
    });

    const merged = Array.from(map.values());

    localStorage.setItem(userKey, JSON.stringify(merged));

    // Remove guest cart now that it's merged
    localStorage.removeItem("nexatech_cart");

    try {
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (e) {}
  } catch (err) {
    console.error("migrateGuestCartToUser error:", err);
  }
}

// Copy the user's cart into the guest cart (nexatech_cart) so it's visible after logout.
export function copyUserCartToGuest(userId) {
  try {
    if (!userId) return;

    const userKey = keyForUser(userId);
    const userRaw = localStorage.getItem(userKey);

    if (!userRaw) return;

    let userCart = [];
    try {
      const parsed = JSON.parse(userRaw);
      if (Array.isArray(parsed)) userCart = parsed;
    } catch (e) {
      return;
    }

    if (!userCart.length) return;

    // Write to guest cart key
    localStorage.setItem("nexatech_cart", JSON.stringify(userCart));

    try {
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (e) {}
  } catch (err) {
    console.error("copyUserCartToGuest error:", err);
  }
}

// Remove the guest cart completely (used on logout when we don't want
// the user's items to remain visible to guests).
export function clearGuestCart() {
  try {
    localStorage.removeItem("nexatech_cart");
    try {
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (e) {}
  } catch (err) {
    console.error("clearGuestCart error:", err);
  }
}
