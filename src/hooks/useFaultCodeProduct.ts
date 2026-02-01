import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type Product = Database['public']['Tables']['products']['Row'];

const FAULTCODE_SLUG = 'faultcode';

export function useFaultCodeProduct() {
  return useQuery({
    queryKey: ['product', FAULTCODE_SLUG],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', FAULTCODE_SLUG)
        .maybeSingle();

      if (error) throw error;
      return data as Product | null;
    },
  });
}
