const GUEST_CART_KEY = "nexatech_guest_cart";

const getStoredUser = () => {
  try {
    const user = localStorage.getItem("nexatech_user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const getCurrentUserId = () => {
  const user = getStoredUser();

  return (
    user?._id ||
    user?.id ||
    user?.user?._id ||
    user?.user?.id ||
    null
  );
};

export const getCartKey = () => {
  const userId = getCurrentUserId();
  return userId ? `nexatech_cart_${userId}` : GUEST_CART_KEY;
};

export const getCart = () => {
  try {
    const cart = localStorage.getItem(getCartKey());
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

export const saveCart = (cart) => {
  localStorage.setItem(getCartKey(), JSON.stringify(cart));

  window.dispatchEvent(
    new CustomEvent("cartUpdated", { detail: cart })
  );
};

export const clearCurrentCart = () => {
  localStorage.removeItem(getCartKey());

  window.dispatchEvent(
    new CustomEvent("cartUpdated", { detail: [] })
  );
};

export const clearGuestCart = () => {
  localStorage.removeItem(GUEST_CART_KEY);

  window.dispatchEvent(
    new CustomEvent("cartUpdated", { detail: [] })
  );
};

// Navbar uses this
export const getCartCount = () => {
  return getCart().reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );
};

export const switchCartContext = () => {
  window.dispatchEvent(
    new CustomEvent("cartUpdated", {
      detail: getCart(),
    })
  );
};