"use client";

import { CartItem, clearCart } from "@/lib/slices/cartSlice";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { z } from "zod";
import CheckoutSummary from "./CheckoutSummary";
import PaymentMethod from "./PaymentMethod";
import ShippingAddress, { CustomerInfo } from "./ShippingAddress";
import CheckoutOptions from "./CheckoutOptions";
import useSettings from "@/hooks/useSettings";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import OrderPreviewModal from "./OrderPreviewModal";

// Zod Schema
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Must be a valid ObjectId string");
const shippingZodSchema = z.object({
  name: z.string().min(1, "Shipping name is required!"),
  type: z.enum(["free", "percentage", "amount"]),
});

const totalAmountZodSchema = z.object({
  subTotal: z.number().min(0),
  tax: z.number().min(0),
  shipping: shippingZodSchema,
  discount: z.number().min(0),
  total: z.number().min(0),
});

const customerInfoZodSchema = z.object({
  firstName: z.string().min(1, "First name is required!"),
  lastName: z.string().min(1, "Last name is required!"),
  email: z.string().email("Must be a valid email!").optional().or(z.literal("")),
  phone: z.string().min(11, "Phone number must be at least 11 digits"),
  address: z.string().min(1, "Address is required!"),
  city: z.string().min(1, "District is required!"),
  area: z.string().min(1, "Upazila/Area is required!"),
  postalCode: z
    .string()
    .regex(/^\d{4}$/, "Postal code must be 4 digits")
    .optional()
    .or(z.literal("")),
  country: z.string().min(1, "Country is required!"),
  pickupLocation: z.string().min(1, "Pickup location is required!"),
  zone: z.string().min(1, "Zone is required!"),
});

const paymentInfoZodSchema = z.literal("cash-on");

const orderInfoZodSchema = z.object({
  orderBy: objectIdSchema.optional(),
  productInfo: objectIdSchema,
  trackingNumber: z.number(),
  status: z
    .enum([
      "pending",
      "processing",
      "at-local-facility",
      "out-for-delivery",
      "cancelled",
      "completed",
    ])
    .optional()
    .default("pending"),
  isCancelled: z.boolean().optional().default(false),
  quantity: z.number().min(1),
  totalAmount: totalAmountZodSchema,
});

const createOrderZodSchema = z.object({
  orderInfo: z.array(orderInfoZodSchema).min(1),
  customerInfo: customerInfoZodSchema,
  paymentInfo: paymentInfoZodSchema,
  deliveryCharge: z.number().min(0, "Delivery charge cannot be negative"),
  totalAmount: z.number().min(0),
});

// Icons
const CalendarIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-yellow-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const GiftIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-yellow-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 13l-4-4h8l-4 4zm0-13a2 2 0 00-2-2h-2a2 2 0 00-2 2v2h8V6a2 2 0 00-2-2h-2z"
    />
  </svg>
);

const CheckOut: React.FC = () => {
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const items = useMemo(() => 
    cartItems.filter((i: CartItem) => i.selected), 
    [cartItems]
  );
  const dispatch = useDispatch();
  const user = useAppSelector(selectCurrentUser);
  const { data: session } = useSession();
  const [checkoutType, setCheckoutType] = useState<"guest" | "user" | null>(null);
  
  // Auto-detect if user is logged in and set checkout type
  useEffect(() => {
    const isLoggedIn = user?._id || session?.user?.id;
    if (isLoggedIn && checkoutType === null) {
      setCheckoutType("user");
    }
  }, [user, session, checkoutType]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    pickupLocation: "home",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    altPhone: "",
    country: "Bangladesh",
    city: "",
    area: "",
    zone: "",
    address: "",
    postalCode: "",
  });

  const [selectedPayment, setSelectedPayment] = useState<
    "cash-on-delivery" | "bkash" | "nagad" | "rocket"
  >("cash-on-delivery");

  const [errors, setErrors] = useState<string[]>([]);
  const [triggerValidation, setTriggerValidation] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const subtotal: number = items.reduce(
    (acc: number, item: CartItem) => acc + item.price * item.quantity,
    0
  );
  const { settings } = useSettings();
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0);



  // Watch for address change
  useEffect(() => {
    if (!customerInfo.city) {
      setDeliveryCharge(0);
      return;
    }

    const { insideDhaka, outsideDhaka } = settings?.data?.deliveryCharge || {};
    const finalPrice = customerInfo.city.toLowerCase() === "dhaka" 
      ? insideDhaka 
      : outsideDhaka;
    setDeliveryCharge(finalPrice || 0);
  }, [customerInfo.city, settings]);

  const tax = 10;
  const discount = 5;

  const handleOrderClick = (): void => {
    // Trigger validation to show all field errors
    setTriggerValidation(true);
    
    // Validate checkout type and user authentication
    if (checkoutType === "user" && !user?._id) {
      Swal.fire({
        icon: "error",
        title: "Authentication Required",
        text: "Please log in to place an order as a user.",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        const currentUrl = window.location.pathname + window.location.search;
        router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`);
      });
      return;
    }

    // Validate detailed address is required
    if (!customerInfo.address || customerInfo.address.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Address Required",
        text: "Please fill in the detailed address field.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    // Validate all required fields
    const missingFields = [];
    if (!customerInfo.firstName) missingFields.push("First Name");
    if (!customerInfo.lastName) missingFields.push("Last Name");
    if (!customerInfo.phone) missingFields.push("Phone Number");
    if (!customerInfo.city) missingFields.push("District");
    if (!customerInfo.area) missingFields.push("Upazila");
    if (!customerInfo.zone) missingFields.push("Zone");
    
    if (missingFields.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Required Fields Missing",
        text: `Please fill in: ${missingFields.join(", ")}`,
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    // Show preview modal
    setShowPreview(true);
  };

  const handleOrderConfirm = async (): Promise<void> => {
    setShowPreview(false);

    const orderInfo = items.map((item: CartItem) => {
      const itemSubtotal = item.price * item.quantity;
      return {
        orderBy: checkoutType === "user" ? user?._id : undefined,
        productInfo: item.id,
        trackingNumber: Math.floor(Math.random() * 900000000) + 100000000,
        status: "pending",
        isCancelled: false,
        quantity: item.quantity,
        totalAmount: {
          subTotal: itemSubtotal,
          tax: 0,
          shipping: {
            name: "Standard Delivery",
            type: "amount" as const,
          },
          discount: 0,
          total: itemSubtotal,
        },
      };
    });

    const payload = {
      orderInfo,
      customerInfo: {
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        email: customerInfo.email || "guest@example.com",
        phone: customerInfo.phone,
        address: `${customerInfo.address}, ${customerInfo.area}, ${customerInfo.city}`,
        city: customerInfo.city,
        area: customerInfo.area,
        postalCode: customerInfo.postalCode || "1205",
        country: customerInfo.country,
        pickupLocation: customerInfo.pickupLocation,
        zone: customerInfo.zone || customerInfo.city || "Dhaka",
      },
      paymentInfo: "cash-on" as const,
      deliveryCharge: deliveryCharge,
      totalAmount: subtotal + deliveryCharge,
    };

    console.log("Email being sent:", customerInfo.email);
    console.log("Full payload:", payload);

    const result = createOrderZodSchema.safeParse(payload);
    if (!result.success) {
      const errorMessages = result.error.issues.map(
        (issue) => `${issue.path.join(".")} - ${issue.message}`
      );
      setErrors(errorMessages);
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        html: `<ul class="list-disc pl-5">${errorMessages
          .map((err) => `<li>${err}</li>`)
          .join("")}</ul>`,
        confirmButtonColor: "#3085d6",
      });
      return;
    }
    setErrors([]);


    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/order/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result.data),
        }
      );
      const data = await res.json();
       JSON.stringify(data, null, 2);
      if (data.success && data.data) {
        const createdOrderId = Array.isArray(data.data)
          ? data.data[0]?._id
          : data.data._id;

        Swal.fire({
          icon: "success",
          title: "Order Placed!",
          text: "Your order has been successfully placed. Redirecting...",
          confirmButtonColor: "#3085d6",
          timer: 1500,
          timerProgressBar: true,
        }).then(() => {
          dispatch(clearCart());
          if (createdOrderId) {
            router.push(`/confirmation/${createdOrderId}`);
          } else {
            router.push("/confirmation");
          }
        });
      } else {
        setErrors([
          `Failed to place order: ${data.message || "Unknown error"}`,
        ]);
        Swal.fire({
          icon: "error",
          title: "Order Failed",
          text:
            data.message ||
            "An unknown error occurred while placing the order.",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (err) {
      console.error(err);
      setErrors(["Failed to place order due to a network error."]);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Failed to place order due to a network issue. Please try again.",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  if (!checkoutType) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans text-gray-800 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <CheckoutOptions
            onGuestCheckout={() => setCheckoutType("guest")}
            onUserCheckout={() => setCheckoutType("user")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back to options */}
        {!user?._id && !session?.user?.id && (
          <div className="mb-4">
            <button
              onClick={() => setCheckoutType(null)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
            >
              ← Back to checkout options
            </button>
            <div className="mt-2 text-sm text-gray-600">
              Checkout as: <span className="font-semibold capitalize">{checkoutType}</span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side */}
          <div className="lg:col-span-2 space-y-6">
            <ShippingAddress
              customerInfo={customerInfo}
              setCustomerInfo={setCustomerInfo}
              isGuestCheckout={checkoutType === "guest"}
              userName={user?.name || session?.user?.name}
              userEmail={user?.email || session?.user?.email}
              userPhone={user?.contactNo}
              triggerValidation={triggerValidation}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
              <div className="bg-white p-4 flex items-center space-x-3">
                <CalendarIcon />
                <span className="font-medium text-sm">7 Days Happy Return</span>
              </div>
              <div className="bg-white p-4 flex items-center space-x-3">
                <GiftIcon />
                <span className="font-medium text-sm">
                  Purchase and Earn Point
                </span>
              </div>
            </div>
            <PaymentMethod
              selectedPayment={
                selectedPayment === "cash-on-delivery" ? "cod" : selectedPayment
              }
              handlePaymentChange={(id) => {
                setSelectedPayment(
                  id === "cod"
                    ? "cash-on-delivery"
                    : (id as "bkash" | "nagad" | "rocket")
                );
              }}
            />
          </div>
          {/* Right Side */}
          <div className="lg-col-span-1">
            <div className="space-y-6 sticky top-4">
              <CheckoutSummary
                mode="confirm"
                subtotal={subtotal}
                deliveryCharge={deliveryCharge}
                onConfirm={handleOrderClick}
              />
              <OrderPreviewModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                onConfirm={handleOrderConfirm}
                onEdit={() => setShowPreview(false)}
                items={items}
                customerInfo={customerInfo}
                subtotal={subtotal}
                deliveryCharge={deliveryCharge}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
