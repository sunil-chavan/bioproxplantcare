import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    getCart,
    addToCartApi,
    updateCartItem,
    removeCartItem,
} from "../api/cartService";

const CartContext = createContext();
export { CartContext };

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const token = localStorage.getItem("customer_token");

    // =========================
    // LOAD CART (DB OR LOCAL)
    // =========================
    const fetchCart = async () => {
        if (token) {
            try {
                const res = await getCart();
                setCartItems(res.data.data || []);
            } catch (err) {
                console.log("DB cart error, loading local cart");
                loadLocalCart();
            }
        } else {
            loadLocalCart();
        }
    };

    const loadLocalCart = () => {
        const localCart =
            JSON.parse(localStorage.getItem("guest_cart")) || [];
        // Filter out invalid items (e.g. legacy format without product details)
        const validCart = localCart.filter(item => item.product && item.id);
        if (validCart.length !== localCart.length) {
            localStorage.setItem("guest_cart", JSON.stringify(validCart));
        }
        setCartItems(validCart);
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // =========================
    // ADD TO CART
    // =========================
    const addToCart = async (product, quantity) => {
        if (token) {
            try {
                await addToCartApi({ product_id: product.id, quantity });
                toast.success("Added to cart");
                await fetchCart();
                return { success: true };
            } catch (error) {
                console.error("API failed, saving locally");
                saveToLocal(product, quantity);
                toast.success("Added to cart (offline)");
                return { success: true };
            }
        } else {
            saveToLocal(product, quantity);
            toast.success("Added to cart");
            return { success: true };
        }
    };

    const saveToLocal = (product, quantity) => {
        let localCart =
            JSON.parse(localStorage.getItem("guest_cart")) || [];

        const existingIndex = localCart.findIndex(
            (item) => item.product_id === product.id
        );

        if (existingIndex > -1) {
            localCart[existingIndex].quantity += quantity;
        } else {
            localCart.push({
                id: Date.now(), // Generate a unique ID for local items
                product_id: product.id,
                quantity,
                product: product // Store full product details
            });
        }

        localStorage.setItem("guest_cart", JSON.stringify(localCart));
        setCartItems(localCart);
    };

    // =========================
    // UPDATE CART
    // =========================
    const updateCart = async (id, quantity) => {
        if (token) {
            try {
                await updateCartItem(id, { quantity });
                toast.success("Cart updated");
                await fetchCart();
            } catch (error) {
                console.error("API update failed, trying local", error);

                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem("customer_token");
                }

                // Fallback: try updating local cart if item exists there
                updateLocalCart(id, quantity);
            }
        } else {
            updateLocalCart(id, quantity);
        }
    };

    const updateLocalCart = (id, quantity) => {
        let localCart = JSON.parse(localStorage.getItem("guest_cart")) || [];

        // Check if item exists in local cart
        const exists = localCart.some(item => item.id === id);
        if (!exists) {
            if (token) toast.error("Failed to update cart");
            return;
        }

        localCart = localCart.map((item) =>
            item.id === id
                ? { ...item, quantity }
                : item
        );

        localStorage.setItem("guest_cart", JSON.stringify(localCart));
        setCartItems(localCart);
        toast.success("Cart updated");
    };

    // =========================
    // REMOVE CART
    // =========================
    const removeCart = async (id) => {
        if (token) {
            try {
                await removeCartItem(id);
                toast.success("Item removed");
                await fetchCart();
            } catch (error) {
                console.error("API remove failed, trying local", error);

                // If unauthorized, clear token to prevent future API calls
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem("customer_token");
                }

                // Fallback
                removeFromLocalCart(id);
            }
        } else {
            removeFromLocalCart(id);
        }
    };

    const removeFromLocalCart = (id) => {
        let localCart = JSON.parse(localStorage.getItem("guest_cart")) || [];

        const exists = localCart.some(item => item.id === id);
        if (!exists) {
            if (token) toast.error("Failed to remove item");
            return;
        }

        localCart = localCart.filter(
            (item) => item.id !== id
        );

        localStorage.setItem("guest_cart", JSON.stringify(localCart));
        setCartItems(localCart);
        toast.success("Item removed");
    };

    // =========================
    // CLEAR CART
    // =========================
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem("guest_cart");
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                updateCart,
                removeCart,
                clearCart,
                fetchCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
