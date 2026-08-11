import { MarketData } from '@/types/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function MarketTab({ data }: { data: MarketData }) {
  // Convert currency strings to numbers for chart, assuming format like "$10B" or "10B"
  const parseValue = (val: string) => {
    const num = parseFloat(val.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const chartData = [
    { name: 'TAM', value: parseValue(data.total_addressable_market), label: data.total_addressable_market },
    { name: 'SAM', value: parseValue(data.serviceable_addressable_market), label: data.serviceable_addressable_market },
    { name: 'SOM', value: parseValue(data.serviceable_obtainable_market), label: data.serviceable_obtainable_market },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Market Size (TAM/SAM/SOM)</CardTitle>
          <CardDescription>Estimated market opportunity based on target demographics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}B`} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-md shadow-sm p-3">
                          <p className="font-semibold">{payload[0].payload.name}</p>
                          <p className="text-primary font-bold text-lg">{payload[0].payload.label}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" fill="currentColor" className="fill-primary" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Growth & Saturation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Estimated CAGR</h4>
            <p className="text-3xl font-bold">{data.growth_rate}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Market Saturation</h4>
            {data.is_saturated ? (
              <Badge variant="destructive" className="mb-2">Highly Saturated</Badge>
            ) : (
              <Badge className="bg-green-500/10 text-green-500 mb-2">Room for Growth</Badge>
            )}
            <p className="text-sm leading-relaxed">{data.saturation_justification}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Verticals & Regulations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Top Target Verticals</h4>
            <div className="flex flex-wrap gap-2">
              {data.top_verticals.map((v, i) => (
                <Badge key={i} variant="secondary">{v}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Regulatory Considerations</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              {data.regulatory_considerations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
