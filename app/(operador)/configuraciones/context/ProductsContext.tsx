"use client";
import React, { createContext, useContext } from "react";
import {
  useProductsByCategory,
  CategoryView,
} from "../hooks/useProductsByCategory";

interface ProductsContextType {
  categories: CategoryView[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined,
);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const productData = useProductsByCategory();

  return (
    <ProductsContext.Provider value={productData}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProductsContext() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error(
      "useProductsContext must be used within a ProductsProvider",
    );
  }
  return context;
}
