import { Download, ExternalLink, Github, Code2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/hooks/useProjects';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  layout?: 'grid' | 'card';
}

const ProjectCard = ({ project, layout = 'grid' }: ProjectCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className="bg-card border-border hover-glow transition-all duration-300 hover:-translate-y-2 group cursor-pointer h-full"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <CardHeader>
        <div className="flex items-start justify-between mb-4">
          <div className="text-5xl">
            <Code2 className="w-12 h-12 text-primary" />
          </div>
          <div className="flex gap-2">
            {project.download_link && (
              <a 
                href={project.download_link} 
                download 
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-primary hover:text-primary/80"
                >
                  <Download size={18} />
                </Button>
              </a>
            )}
            <a 
              href={project.github_url} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                size="sm"
                variant="ghost"
                className="text-primary hover:text-primary/80"
              >
                <Github size={18} />
              </Button>
            </a>
          </div>
        </div>
        <CardTitle className="font-display text-2xl group-hover:text-primary transition-colors">
          {project.name}
          <span className="text-sm text-muted-foreground ml-2">★ {project.stars}</span>
        </CardTitle>
        <CardDescription className="text-foreground/70 leading-relaxed line-clamp-3">
          {project.description}
        </CardDescription>
      </CardHeader>
      
      <CardFooter className="flex flex-wrap gap-2">
        {project.repo_topics?.slice(0, 4).map((tag, index) => (
          <Badge
            key={index}
            variant="outline"
            className="border-primary/30 text-primary/90"
          >
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
