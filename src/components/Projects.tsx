import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useProjects, syncGitHubProjects } from '@/hooks/useProjects';
import ProjectCard from './ProjectCard';
import { Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ProjectCategory = 'mobile' | 'games' | 'desktop' | 'web' | 'ai';

const getCategoryName = (category: ProjectCategory): string => {
  const names = {
    mobile: 'Mobile Apps',
    games: 'Games',
    desktop: 'Desktop Apps',
    web: 'Web Apps',
    ai: 'AI & ML'
  };
  return names[category];
};

const Projects = () => {
  const [activeTab, setActiveTab] = useState<ProjectCategory>('mobile');
  const [syncing, setSyncing] = useState(false);
  const { data: projects, isLoading, refetch } = useProjects();
  const { toast } = useToast();

  const categories: ProjectCategory[] = ['mobile', 'games', 'desktop', 'web', 'ai'];

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncGitHubProjects();
      await refetch();
      toast({
        title: "Success",
        description: "Projects synced from GitHub successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync projects",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const getGridClass = (category: ProjectCategory) => {
    if (category === 'web') {
      return 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto';
    }
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto';
  };

  return (
    <section id="projects" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-glow">
            Featured Projects
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            Explore projects across different domains — from mobile apps to AI systems
          </p>
          <Button
            onClick={handleSync}
            disabled={syncing}
            variant="outline"
            className="gap-2"
          >
            {syncing ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
            {syncing ? 'Syncing...' : 'Sync from GitHub'}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProjectCategory)}>
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5 mb-12">
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {getCategoryName(category).split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          ) : (
            categories.map((category) => (
              <TabsContent key={category} value={category} className="animate-fade-in">
                <div className={getGridClass(category)}>
                  {projects
                    ?.filter(p => p.category === category)
                    .map((project, index) => (
                      <div
                        key={project.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <ProjectCard project={project} />
                      </div>
                    ))}
                  {projects?.filter(p => p.category === category).length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      No projects in this category yet
                    </div>
                  )}
                </div>
              </TabsContent>
            ))
          )}
        </Tabs>
      </div>
    </section>
  );
};

export default Projects;
