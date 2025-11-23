"use client";
import LaptopSaleBanner from '@/Component/Page/LaptopSaleBanner'
import React from 'react'
import ProductShowcase01 from "../../../Component/ProductShowcase/ProductShowcase01"
import ProductShowcase02 from "../../../Component/ProductShowcase/ProductShowcase02"
import ProductShowcase03 from "../../../Component/ProductShowcase/ProductShowcase03"
import Ads from "../../../Component/ads/ads"
const Electronics = () => {
const categories = [
  { name: "Speaker", img: "https://cdn-icons-png.flaticon.com/512/727/727240.png" },
  { name: "Mouse", img: "https://cdn-icons-png.flaticon.com/512/1541/1541496.png" },
  { name: "Power Bank", img: "https://cdn-icons-png.flaticon.com/512/2832/2832782.png" },
  { name: "Router", img: "https://cdn-icons-png.flaticon.com/512/3062/3062634.png" },
  { name: "Headphone", img: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png" },
  { name: "Cable & Converter", img: "https://cdn-icons-png.flaticon.com/512/900/900618.png" },
  { name: "Microphone", img: "https://cdn-icons-png.flaticon.com/512/709/709682.png" },
  { name: "Wifi Repeater", img: "https://cdn-icons-png.flaticon.com/512/3104/3104630.png" },
  { name: "Wifi Repeater", img: "https://cdn-icons-png.flaticon.com/512/3104/3104630.png" },
  { name: "Wifi Repeater", img: "https://cdn-icons-png.flaticon.com/512/3104/3104630.png" },
  { name: "Wifi Repeater", img: "https://cdn-icons-png.flaticon.com/512/3104/3104630.png" },
  { name: "Wifi Repeater", img: "https://cdn-icons-png.flaticon.com/512/3104/3104630.png" },
  { name: "Wifi Repeater", img: "https://cdn-icons-png.flaticon.com/512/3104/3104630.png" },
  { name: "Wifi Repeater", img: "https://cdn-icons-png.flaticon.com/512/3104/3104630.png" },
  { name: "Wifi Repeater", img: "https://cdn-icons-png.flaticon.com/512/3104/3104630.png" },
  { name: "Wifi Repeater", img: "https://cdn-icons-png.flaticon.com/512/3104/3104630.png" },
  { name: "Wifi Repeater", img: "https://cdn-icons-png.flaticon.com/512/3104/3104630.png" },
  { name: "Wifi Repeater", img: "https://cdn-icons-png.flaticon.com/512/3104/3104630.png" },
  { name: "Wifi Repeater", img: "https://cdn-icons-png.flaticon.com/512/3104/3104630.png" },
  { name: "Wifi Repeater", img: "https://cdn-icons-png.flaticon.com/512/3104/3104630.png" },
  { name: "Wifi Repeater", img: "https://cdn-icons-png.flaticon.com/512/3104/3104630.png" },
];
const products = [
  {
    name: "Whirlpool MWO Pro 20SE Solo 20L Oven",
    image: "https://ds.rokomari.store/rokomari110/category/f211591c40b04_image.png", // তোমার project এর image path দাও
    rating: 4,
    price: "৳ 15874",
    discountPrice: "৳ 12708",
    discount: "20% OFF",
    stock: "In Stock",
    brand: "Whirlpool",
  },
  {
    name: "Miyako 32L Convection Electric Oven (MT-32DBL)",
    image: "https://ds.rokomari.store/rokomari110/category/14c6650dd2504_image.png",
    rating: 5,
    price: "৳ 9747",
    discountPrice: "৳ 7974",
    discount: "18% OFF",
    stock: "In Stock",
    brand: "Miyako",
  },
  {
    name: "Vision Micro Oven VSM 30L Rotisserie - 873113",
    image: "https://ds.rokomari.store/rokomari110/ProductNew20190903/45X64/Classic_Metal_Swing_Arm_Desk_Lamp_MT_810-Non_Brand-4049c-414657.jpg",
    rating: 4,
    price: "৳ 18500",
    discountPrice: "৳ 16650",
    discount: "10% OFF",
    stock: "In Stock",
    brand: "Vision",
  },
  {
    name: "Atashii Micro Oven NMW-90D25AL-B8A",
    image: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Xiaomi_Nextool_Torchlight_2000_LM_Flashl-Nextool-3a9bd-327041.png",
    rating: 3,
    price: "৳ 11299",
    discountPrice: "৳ 10847",
    discount: "04% OFF",
    stock: "In Stock",
    brand: "Atashii",
  },
  {
    name: "Sharp EO-35K-3 Electric Oven - 35L",
    image: "https://ds.rokomari.store/rokomari110/category/ff826363fea34_image.png",
    rating: 4,
    price: "৳ 11500",
    discountPrice: "৳ 10650",
    discount: "07% OFF",
    stock: "In Stock",
    brand: "Sharp",
  },
    {
    name: "Sharp EO-35K-3 Electric Oven - 35L",
    image: "https://ds.rokomari.store/rokomari110/category/c7c581426c124_image.png",
    rating: 4,
    price: "৳ 11500",
    discountPrice: "৳ 10650",
    discount: "07% OFF",
    stock: "In Stock",
    brand: "Sharp",
  },
    {
    name: "Sharp EO-35K-3 Electric Oven - 35L",
    image: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Xiaomi_Nextool_Torchlight_2000_LM_Flashl-Nextool-3a9bd-327041.png",
    rating: 4,
    price: "৳ 11500",
    discountPrice: "৳ 10650",
    discount: "07% OFF",
    stock: "In Stock",
    brand: "Sharp",
  },
    {
    name: "Sharp EO-35K-3 Electric Oven - 35L",
    image: "https://ds.rokomari.store/rokomari110/category/14c6650dd2504_image.png",
    rating: 4,
    price: "৳ 11500",
    discountPrice: "৳ 10650",
    discount: "07% OFF",
    stock: "In Stock",
    brand: "Sharp",
  },
    {
    name: "Sharp EO-35K-3 Electric Oven - 35L",
    image: "https://ds.rokomari.store/rokomari110/category/14c6650dd2504_image.png",
    rating: 4,
    price: "৳ 11500",
    discountPrice: "৳ 10650",
    discount: "07% OFF",
    stock: "In Stock",
    brand: "Sharp",
  },
    {
    name: "Sharp EO-35K-3 Electric Oven - 35L",
    image: "https://ds.rokomari.store/rokomari110/category/449cdb5fa50a4_image.png",
    rating: 4,
    price: "৳ 11500",
    discountPrice: "৳ 10650",
    discount: "07% OFF",
    stock: "In Stock",
    brand: "Sharp",
  },
    {
    name: "Sharp EO-35K-3 Electric Oven - 35L",
    image: "https://ds.rokomari.store/rokomari110/category/449cdb5fa50a4_image.png",
    rating: 4,
    price: "৳ 11500",
    discountPrice: "৳ 10650",
    discount: "07% OFF",
    stock: "In Stock",
    brand: "Sharp",
  },
];

  return (
    <section className=' bg-[#F1F2F4] '>
      <div className='w-[80vw] m-auto'>
      <LaptopSaleBanner />
      <ProductShowcase01  title="Recently Sold Products" products={products}/>
      <ProductShowcase03 title= {"Top Categories"} categories = {categories}/>
      <ProductShowcase02 title="Your Daily Electrical Appliances" products={products}/>
      <ProductShowcase01  title="Smart Watch" products={products}/>
      <ProductShowcase02 title="Gear & Gadgets" products={products}/>
      <ProductShowcase01  title="Cooling & Heating" products={products}/>
      <ProductShowcase02 title="Office Supplies" products={products}/>
      <ProductShowcase01  title="Trimmers" products={products}/>
      <ProductShowcase01  title="Rice Cooker" products={products}/>
      <ProductShowcase01  title="Networking Accessories" products={products}/>
      <ProductShowcase01  title="Camera and Accessories" products={products}/>
      <ProductShowcase01  title="Computer Accessories" products={products}/>
      <ProductShowcase01  title="Fan & Ventilator" products={products}/>
      <ProductShowcase01  title="Kitchen Appliances" products={products}/>
      <ProductShowcase01  title="Mobile Accessories" products={products}/>
      <ProductShowcase01  title="Irons" products={products}/>
      <ProductShowcase01  title="Security Essentials" products={products}/>
      <ProductShowcase01  title="Refrigerators" products={products}/>
      <ProductShowcase01  title="Science Kit" products={products}/>
      <ProductShowcase01  title="Blender" products={products}/>
      <ProductShowcase01  title="Electric Kettle" products={products}/>
      <ProductShowcase01  title="Ovens" products={products}/>
      <ProductShowcase01  title="Smart Television" products={products}/>
      <Ads/>
      </div>
    </section>
  )
}

export default Electronics