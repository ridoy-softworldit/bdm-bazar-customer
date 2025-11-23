import React from "react";
import { Truck, RefreshCcw, Wallet } from "lucide-react"; // icons

const Ads = () => {
  const features = [
    {
      icon: <Wallet className="w-8 h-8 text-gray-700" />,
      title: "CASH ON DELIVERY",
      desc: "Pay cash at your doorstep",
    },
    {
      icon: <Truck className="w-8 h-8 text-gray-700" />,
      title: "DELIVERY",
      desc: "All over Bangladesh",
    },
    {
      icon: <RefreshCcw className="w-8 h-8 text-gray-700" />,
      title: "HAPPY RETURN",
      desc: "7 days return facility",
    },
  ];

  return (
    <div className="flex justify-center items-center gap-10  py-6">
      {features.map((feature, index) => (
        <div key={index} className="flex gap-4 items-center">
            {feature.icon}
          <div key={index} className="flex flex-col ">
          <h3 className="text-sm font-semibold ">{feature.title}</h3>
          <p className="text-xs text-gray-500">{feature.desc}</p>
        </div>
        </div>
      ))}
    </div>
  );
};

export default Ads;
