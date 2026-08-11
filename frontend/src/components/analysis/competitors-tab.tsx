import { CompetitorData } from '@/types/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X } from 'lucide-react';

export function CompetitorsTab({ data }: { data: CompetitorData }) {
  // Extract all unique features from the matrix
  const allFeatures = Array.from(new Set(
    Object.values(data.feature_matrix).flat()
  ));

  const competitorNames = Object.keys(data.feature_matrix);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Direct Competitors</CardTitle>
            <CardDescription>Companies solving the exact same problem</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.direct_competitors.map((comp, idx) => (
              <div key={idx} className="bg-muted p-4 rounded-lg">
                <h4 className="font-bold text-lg mb-1 text-primary">{comp.name}</h4>
                <p className="text-sm text-muted-foreground">{comp.description}</p>
                {data.competitor_weaknesses[comp.name] && (
                  <div className="mt-3 text-sm">
                    <span className="font-semibold text-destructive">Weakness: </span>
                    {data.competitor_weaknesses[comp.name]}
                  </div>
                )}
              </div>
            ))}
            {data.direct_competitors.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No major direct competitors identified.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Indirect Competitors</CardTitle>
            <CardDescription>Alternatives or adjacent solutions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.indirect_competitors.map((comp, idx) => (
              <div key={idx} className="border p-4 rounded-lg">
                <h4 className="font-bold text-lg mb-1">{comp.name}</h4>
                <p className="text-sm text-muted-foreground">{comp.description}</p>
                {data.competitor_weaknesses[comp.name] && (
                  <div className="mt-3 text-sm">
                    <span className="font-semibold text-destructive">Weakness: </span>
                    {data.competitor_weaknesses[comp.name]}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feature Matrix</CardTitle>
          <CardDescription>How competitors stack up on key features</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Feature</TableHead>
                {competitorNames.map(name => (
                  <TableHead key={name} className="text-center">{name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {allFeatures.map(feature => (
                <TableRow key={feature}>
                  <TableCell className="font-medium">{feature}</TableCell>
                  {competitorNames.map(name => {
                    const hasFeature = data.feature_matrix[name]?.includes(feature);
                    return (
                      <TableCell key={name} className="text-center">
                        {hasFeature ? (
                          <Check className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
