// lib/slices/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  productId: string; // product ID
  name: string;
  brand?: string;
  image?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  stock?: number;
  selected: boolean;
  superDeal?: boolean;
  shopInfo?: string; // shop ID
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // cartSlice.ts
    addToCart: (state, action) => {
      const existingIndex = state.items.findIndex(
        (i) => i.id === action.payload.id
      );
      if (existingIndex >= 0) {
        // Increase quantity without exceeding stock
        const stock = state.items[existingIndex].stock;
        if (
          typeof stock === "number" &&
          state.items[existingIndex].quantity < stock
        ) {
          state.items[existingIndex].quantity += action.payload.quantity;
        }
      } else {
        state.items.push(action.payload);
      }
    },

    toggleSelectItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.selected = !item.selected;
    },
    toggleSelectAll: (state, action: PayloadAction<boolean>) => {
      state.items.forEach((i) => (i.selected = action.payload));
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        const newQty = item.quantity + action.payload.quantity;
        item.quantity = newQty > 0 ? newQty : 1;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    // ✅ Remove a single item
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
  },
});

export const {
  addToCart,
  toggleSelectItem,
  toggleSelectAll,
  updateQuantity,
  clearCart,
  removeItem,
} = cartSlice.actions;

export default cartSlice.reducer;
