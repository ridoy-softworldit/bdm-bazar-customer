import { addToCart } from "@/lib/slices/cartSlice";
import { AppDispatch } from "@/redux/store";
import { TProduct } from "@/types/product/product";
import toast from "react-hot-toast";

// dispatch pass koro, hook call korte hobe component theke
export const handleAddToCart = (product: TProduct, dispatch: AppDispatch) => {
  if (!product.productInfo.inStock || product.productInfo.quantity <= 0) {
    toast.error("This product is out of stock!");
    return;
  }

  const price = product.productInfo.salePrice ?? product.productInfo.price;
  const authorName =
    product.bookInfo?.specification?.authors?.[0]?.name ?? "Unknown";

  dispatch(
    addToCart({
      id: product._id,
      name: product.description.name ?? "Unknown Product",
      brand: authorName,
      price,
      originalPrice: product.productInfo.price,
      stock: product.productInfo.quantity,
      superDeal: !!product.productInfo.discount,
      selected: true,
      quantity: 1,
      image: product.featuredImg ?? "",
    })
  );
  
  toast.success(`"${product.description.name}" added to cart!`);
};
