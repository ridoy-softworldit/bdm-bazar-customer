"use client";

import { redirect } from "next/navigation";

export default function SubcategoryIndexPage() {
  // Redirect to main category page if someone tries to access /category/subcategory directly
  redirect("/category/book");
}