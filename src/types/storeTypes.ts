// src/types/storeTypes.ts
import { Product } from "./productTypes";

export interface RootState {
  product: {
    items: Product[];
    loading: boolean;
    error: string | null;
  };
}