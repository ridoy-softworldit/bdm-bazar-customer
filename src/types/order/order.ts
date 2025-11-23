export type ShippingInfo = {
  name: string;
  type: string;
};

export type TotalAmount = {
  subTotal: number;
  tax: number;
  shipping: ShippingInfo;
  discount: number;
  total: number;
};

// --- Product Info for OrderItem ---
export type ProductInfo = {
  _id: string;
  description: {
    name: string;
    slug?: string;
  };
  productInfo: {
    price: number;
    quantity: number;
    salePrice?: number;
    sku?: string;
  };
  totalAmount: TotalAmount;
};

// --- Each Order Item ---
export interface OrderItem {
  orderBy: string; // user ID
  productInfo: ProductInfo; // full object for confirmation page
  trackingNumber: string;
  status:
    | "pending"
    | "processing"
    | "completed"
    | "cancelled"
    | "out-for-delivery";
  isCancelled: boolean;
  quantity: number;
  totalAmount: TotalAmount;
}

// --- Customer Information ---
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  altPhone?: string;
  address: string;
  area: string;
  city: string;
  postalCode: string;
  country: string;
}

// --- Payload to create order ---
export interface CreateOrderPayload {
  orderInfo: OrderItem[];
  customerInfo: CustomerInfo;
  paymentInfo: "cash-on" | "card" | "online";
  totalAmount: number;
}

// --- API Response type ---
export interface OrderResponse {
  success: boolean;
  data: CreateOrderPayload & {
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
}
