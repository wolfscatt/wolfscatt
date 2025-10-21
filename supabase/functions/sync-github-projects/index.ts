import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  topics: string[];
  stargazers_count: number;
}

function categorizeRepo(repo: GitHubRepo): string {
  const nameAndDesc = `${repo.name} ${repo.description || ''}`.toLowerCase();
  const topics = repo.topics.map(t => t.toLowerCase());
  const allText = [...topics, nameAndDesc].join(' ');

  // Check for mobile
  if (allText.match(/flutter|android|apk|mobile|ios|react-native/)) {
    return 'mobile';
  }
  
  // Check for games
  if (allText.match(/unity|game|rpg|gaming|godot|unreal/)) {
    return 'games';
  }
  
  // Check for desktop
  if (allText.match(/desktop|windows|wpf|electron|tauri|macos/)) {
    return 'desktop';
  }
  
  // Check for AI/ML
  if (allText.match(/\bml\b|machine-learning|deep-learning|neural|tensorflow|pytorch|ai\b/)) {
    return 'ai';
  }
  
  // Default to web
  return 'web';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Fetching repositories from GitHub...');
    
    // Fetch repos from GitHub
    const response = await fetch('https://api.github.com/users/wolfscatt/repos?per_page=100', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Lovable-Portfolio'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();
    console.log(`Found ${repos.length} repositories`);

    let syncedCount = 0;
    let errorCount = 0;

    for (const repo of repos) {
      try {
        const category = categorizeRepo(repo);
        
        // Check if project already exists
        const { data: existing } = await supabaseClient
          .from('projects')
          .select('id')
          .eq('github_url', repo.html_url)
          .single();

        const projectData = {
          name: repo.name,
          description: repo.description || 'No description provided',
          category,
          github_url: repo.html_url,
          repo_topics: repo.topics,
          stars: repo.stargazers_count,
        };

        if (existing) {
          // Update existing project
          const { error } = await supabaseClient
            .from('projects')
            .update(projectData)
            .eq('id', existing.id);

          if (error) {
            console.error(`Error updating ${repo.name}:`, error);
            errorCount++;
          } else {
            syncedCount++;
          }
        } else {
          // Insert new project
          const { error } = await supabaseClient
            .from('projects')
            .insert(projectData);

          if (error) {
            console.error(`Error inserting ${repo.name}:`, error);
            errorCount++;
          } else {
            syncedCount++;
          }
        }
      } catch (err) {
        console.error(`Error processing ${repo.name}:`, err);
        errorCount++;
      }
    }

    console.log(`Sync complete. Synced: ${syncedCount}, Errors: ${errorCount}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        synced: syncedCount,
        errors: errorCount,
        total: repos.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Sync error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Sync failed';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
