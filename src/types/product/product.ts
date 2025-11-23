// types/product/product.ts
export type TCategoryAndTags = {
  publisher?: string; // ObjectId as string
  categories: string[]; // Array of category IDs
  tags?: string[]; // Array of tag IDs

  subCategories?: string[]; // Array of subcategory names
};

export type TDescription = {
  name: string;
  slug?: string;
  description: string;
  status: "publish" | "draft";
  name_bn?: string;
  description_bn?: string;
  keywords?: string[];
  metaTitle?: string;
  metaDescription?: string;
};

export type TExternal = {
  productUrl: string;
  buttonLabel: string;
};

export type TProductInfo = {
  price: number;
  salePrice?: number;
  sku: string;
  width?: string;
  height?: string;
  length?: string;
  isDigital?: boolean;
  digital?: string;
  inStock: boolean;
  quantity: number;
  isExternal?: boolean;
  external?: TExternal;
  discount?: number; // percentage discount
  totalDiscount?: number;
  status: "draft" | "publish" | "low-quantity" | "out-of-stock";
  publicationDate?: string; // ISO date string
  isOnSale?: boolean;
  campaign?: string;
  dimensions?: {
    width?: string;
    height?: string;
    length?: string;
  };
  weight?: string;
};

export type TAuthor = {
  name: string | null;
  image?: string;
  description?: string;
};

export type TSpecification = {
  title?: string;
  authors?: TAuthor[]; // Can be array for multiple authors
  publisher?: string; // ObjectId as string
  edition?: string;
  numberOfPages?: number;
  country?: string;
  language?: string;
  isbn?: string;
  binding?: string;
  Author?: TAuthor; // For cases where API uses capitalized 'Author'
  Publisher?: string; // For cases where API uses capitalized 'Publisher'
};

export type TBookInfo = {
  specification?: TSpecification;
  format?: "hardcover" | "paperback" | "ebook" | "audiobook";
  genre?: string[];
  series?: string;
  translator?: string;
  pages?: number;
};

export interface TProduct {
  _id: string;
  shopId?: string;
  featuredImg: string;
  gallery?: string[];
  previewImg?: string[];
  video?: string;
  brandAndCategories?: {
    brand?: string;
    categories?: string[];
    tags?: string[];
  };
  categoryAndTags?: TCategoryAndTags;
  description: TDescription;
  productType?: "simple" | "configurable" | "bundle";
  productInfo: TProductInfo;
  bookInfo?: TBookInfo;
  averageRating?: number;
  ratingCount?: number;
  reviewCount?: number;
  wishlistCount?: number;
  soldCount?: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export type TProductResponse = {
  success: boolean;
  message: string;
  data: TProduct[];
};

// Additional types for populated data

export type TSubCategory = {
  _id: string;
  name: string;
  slug: string;
  // Add other fields if needed
};

export type TPopulatedCategory = {
  _id: string;
  name: string;
  slug: string;
  details: string;
  bannerImg: string;
  icon: {
    name: string;
    url: string;
  };
  image: string;
  subCategories: TSubCategory[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type TPopulatedCategoryAndTags = {
  publisher?: string;
  categories: TPopulatedCategory[]; // Populated
  tags?: unknown[];
};

export type TPopulatedProduct = Omit<
  TProduct,
  "categoryAndTags" | "bookInfo"
> & {
  categoryAndTags?: TPopulatedCategoryAndTags;
  bookInfo?: TBookInfo;
};

export type TSingleCategoryApiResponse = {
  success: boolean;
  message: string;
  data: TPopulatedCategory;
};
