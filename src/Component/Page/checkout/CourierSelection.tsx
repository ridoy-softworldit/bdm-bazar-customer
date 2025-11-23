"use client";

import { Truck, Clock, Shield } from "lucide-react";

interface CourierOption {
  id: string;
  name: string;
  deliveryTime: string;
  price: number;
  description: string;
  icon: React.ReactNode;
}

interface CourierSelectionProps {
  selectedCourier: string;
  onCourierChange: (courierId: string) => void;
  city: string;
}

const courierOptions: CourierOption[] = [
  {
    id: "steadfast",
    name: "Steadfast Courier",
    deliveryTime: "1-2 days",
    price: 60,
    description: "Fast and reliable delivery service",
    icon: <Truck className="w-5 h-5" />
  },
  {
    id: "pathao",
    name: "Pathao Courier",
    deliveryTime: "1-3 days", 
    price: 70,
    description: "Quick delivery with tracking",
    icon: <Clock className="w-5 h-5" />
  },
  {
    id: "redx",
    name: "RedX Courier",
    deliveryTime: "2-4 days",
    price: 50,
    description: "Affordable nationwide delivery",
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: "sundarban",
    name: "Sundarban Courier",
    deliveryTime: "3-5 days",
    price: 80,
    description: "Secure delivery service",
    icon: <Truck className="w-5 h-5" />
  }
];

export default function CourierSelection({
  selectedCourier,
  onCourierChange,
  city
}: CourierSelectionProps) {
  
  const getDeliveryPrice = (basePrice: number) => {
    return city.toLowerCase() === "dhaka" ? basePrice : basePrice + 20;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Select Courier Service</h2>
      <p className="text-sm text-gray-600 mb-6">Choose your preferred delivery partner</p>
      
      <div className="space-y-3">
        {courierOptions.map((courier) => {
          const deliveryPrice = getDeliveryPrice(courier.price);
          
          return (
            <div
              key={courier.id}
              onClick={() => onCourierChange(courier.id)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                selectedCourier === courier.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedCourier === courier.id
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}>
                    {selectedCourier === courier.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-blue-600">{courier.icon}</div>
                    <div>
                      <h3 className="font-medium text-gray-900">{courier.name}</h3>
                      <p className="text-sm text-gray-600">{courier.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-gray-900">৳{deliveryPrice}</div>
                  <div className="text-sm text-gray-600">{courier.deliveryTime}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {city.toLowerCase() !== "dhaka" && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-700">
            ℹ️ Additional ৳20 charge applies for delivery outside Dhaka
          </p>
        </div>
      )}
    </div>
  );
}