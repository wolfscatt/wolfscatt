import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Github, Loader2, ExternalLink, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

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

  const hasReadme = Boolean(project.readme_content && project.readme_content.trim().length > 0);
  const resolveReadmeAssetUrl = (src?: string): string => {
    if (!src) return '';

    // GitHub blob URL ise raw URL'ye çevir
    const githubBlobMatch = src.match(
      /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/
    );

    if (githubBlobMatch) {
      const [, owner, repo, branch, path] = githubBlobMatch;
      return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
    }

    // Zaten tam URL ise direkt kullan
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
      return src;
    }

    // README URL'den owner, repo ve branch bilgisini çıkar
    const readmeUrlMatch = project.readme_url?.match(
      /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\//
    );

    if (!readmeUrlMatch) {
      return src;
    }

    const [, owner, repo, branch] = readmeUrlMatch;
    const cleanPath = src.replace(/^\.?\//, '');

    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${cleanPath}`;
  };

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

            {project.readme_url && (
              <a href={project.readme_url} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/30 text-primary hover-glow"
                >
                  <FileText className="mr-2" size={20} />
                  View README
                </Button>
              </a>
            )}
          </div>

          {/* Description */}
          <div className="glass-morphism rounded-xl p-8 mb-12 animate-fade-in-up">
            <h2 className="font-display text-2xl font-bold mb-4 text-primary">About This Project</h2>
            <p className="text-foreground/80 leading-relaxed text-lg">
              {project.description || 'No description provided.'}
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

          {/* README */}
          <div className="glass-morphism rounded-xl p-8 mb-12 animate-fade-in-up">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="font-display text-2xl font-bold text-primary">
                README Documentation
              </h2>

              {project.readme_url && (
                <a
                  href={project.readme_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  Open on GitHub
                  <ExternalLink className="ml-1" size={14} />
                </a>
              )}
            </div>

            {hasReadme ? (
              <div className="max-w-none text-foreground/80">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="font-display text-3xl font-bold text-foreground mt-8 mb-4 first:mt-0">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="leading-7 mb-4 text-foreground/80">
                        {children}
                      </p>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {children}
                      </a>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-6 mb-4 space-y-2">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-7 text-foreground/80">
                        {children}
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-4">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children, className }) => {
                      const isBlock = className?.includes('language-');

                      if (isBlock) {
                        return (
                          <code className="block bg-black/40 border border-primary/20 rounded-lg p-4 my-4 overflow-x-auto text-sm text-foreground">
                            {children}
                          </code>
                        );
                      }

                      return (
                        <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm">
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="bg-black/40 border border-primary/20 rounded-lg p-4 my-4 overflow-x-auto">
                        {children}
                      </pre>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-6">
                        <table className="w-full border-collapse border border-primary/20 text-sm">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-primary/20 bg-primary/10 px-4 py-2 text-left text-foreground">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-primary/20 px-4 py-2 text-foreground/80">
                        {children}
                      </td>
                    ),
                    img: ({ src, alt }) => (
                      <img
                        src={resolveReadmeAssetUrl(src)}
                        alt={alt || 'README image'}
                        loading="lazy"
                        className="inline-block rounded-xl border border-primary/20 shadow-lg my-4 mx-2 max-w-full h-auto"
                      />
                    ),
                    div: ({ children }) => (
                      <div className="flex flex-wrap justify-center gap-4 my-6">
                        {children}
                      </div>
                    ),
                  }}
                >
                  {project.readme_content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="text-muted-foreground">
                <p>This project does not have a README.md file yet.</p>
              </div>
            )}

            {project.readme_fetched_at && (
              <p className="text-xs text-muted-foreground mt-6">
                README last synced:{' '}
                {new Date(project.readme_fetched_at).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Metadata */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Last updated:{' '}
              {project.updated_at
                ? new Date(project.updated_at).toLocaleDateString()
                : 'Unknown'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
