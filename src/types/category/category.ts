type TIcon = {
  name: string;
  url: string;
};

export type TCategory = {
  _id: string;
  mainCategory?: string;
  name: string;
  slug?: string;
  details: string;
  icon: TIcon;
  image: string;
  bannerImg: string;
  subCategories: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};
