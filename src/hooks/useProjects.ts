import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Project {
  id: string;
  name: string;
  description: string;
  category: 'mobile' | 'games' | 'desktop' | 'web' | 'ai';
  github_url: string;
  download_link: string | null;
  repo_topics: string[];
  stars: number;
  created_at: string;
  updated_at: string;
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('stars', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    },
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Project;
    },
    enabled: !!id,
  });
}

export async function syncGitHubProjects() {
  const { data, error } = await supabase.functions.invoke('sync-github-projects');
  
  if (error) throw error;
  return data;
}
