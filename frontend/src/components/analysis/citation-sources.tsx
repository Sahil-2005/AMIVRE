import { SourceInfo } from '@/types/api';
import { ExternalLink, Search, Globe, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function CitationSources({ sources }: { sources: SourceInfo[] }) {
  if (!sources || sources.length === 0) return null;

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('reddit')) return <MessageSquare className="h-3 w-3 mr-1" />;
    if (p.includes('google play') || p.includes('app store')) return <Search className="h-3 w-3 mr-1" />;
    if (p.includes('wikipedia') || p.includes('web')) return <Globe className="h-3 w-3 mr-1" />;
    return <ExternalLink className="h-3 w-3 mr-1" />;
  };

  return (
    <div className="md:col-span-2 rounded-2xl border border-white/5 bg-card overflow-hidden mt-4">
      <div className="px-6 pt-5 pb-4">
        <h3 className="font-bold text-sm mb-3">Sources & Citations</h3>
        <div className="flex flex-wrap gap-2">
          {sources.map((s, i) => (
            <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <Badge variant="outline" className="border-white/10 bg-white/5 text-xs text-muted-foreground hover:text-foreground">
                {getPlatformIcon(s.platform)}
                {s.platform}: {s.title}
              </Badge>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
