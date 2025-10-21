import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Github, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { useProject } from '@/hooks/useProjects';

const getCategoryName = (category: string): string => {
  const names: Record<string, string> = {
    mobile: 'Mobile Apps',
    games: 'Games',
    desktop: 'Desktop Apps',
    web: 'Web Apps',
    ai: 'AI & ML'
  };
  return names[category] || category;
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading } = useProject(id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-32">
        <Button
          variant="ghost"
          onClick={() => navigate('/#projects')}
          className="mb-8 hover:text-primary"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Projects
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12 animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-glow mb-2">
              {project.name}
            </h1>
            <p className="text-primary text-lg mb-4">{getCategoryName(project.category)}</p>
            <p className="text-muted-foreground">⭐ {project.stars} stars on GitHub</p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 mb-12 animate-fade-in-up">
            {project.download_link && (
              <a href={project.download_link} download>
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 hover-glow">
                  <Download className="mr-2" size={20} />
                  Download
                </Button>
              </a>
            )}
            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-primary/30 text-primary hover-glow">
                <Github className="mr-2" size={20} />
                View on GitHub
              </Button>
            </a>
          </div>

          {/* Description */}
          <div className="glass-morphism rounded-xl p-8 mb-12 animate-fade-in-up">
            <h2 className="font-display text-2xl font-bold mb-4 text-primary">About This Project</h2>
            <p className="text-foreground/80 leading-relaxed text-lg">
              {project.description}
            </p>
          </div>

          {/* Topics */}
          {project.repo_topics && project.repo_topics.length > 0 && (
            <div className="glass-morphism rounded-xl p-8 mb-12 animate-fade-in-up">
              <h2 className="font-display text-2xl font-bold mb-4 text-primary">Topics</h2>
              <div className="flex flex-wrap gap-3">
                {project.repo_topics.map((tag, index) => (
                  <Badge
                    key={index}
                    className="text-base py-2 px-4 bg-primary/10 border-primary/30 text-primary"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Last updated: {new Date(project.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
