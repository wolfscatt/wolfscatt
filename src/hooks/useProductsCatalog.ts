import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Product = Tables<"products">;

export function useProductsCatalog() {
  return useQuery({
    queryKey: ["products-catalog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data as Product[];
    },
  });
}

export function useProductBySlug(slug?: string) {
  return useQuery({
    queryKey: ["product-by-slug", slug],
    queryFn: async () => {
      if (!slug) {
        return null;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data as Product | null;
    },
    enabled: Boolean(slug),
  });
}
