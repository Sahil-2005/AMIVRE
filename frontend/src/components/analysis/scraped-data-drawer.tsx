"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FileSearch } from "lucide-react";

interface ScrapedDataDrawerProps {
  scrapedData?: Record<string, any>;
}

export function ScrapedDataDrawer({ scrapedData }: ScrapedDataDrawerProps) {
  if (!scrapedData) return null;

  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2">
        <FileSearch className="h-4 w-4" />
        View Scraper Receipts
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-none flex flex-col h-full border-l border-white/10 bg-black/95 backdrop-blur-xl">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl font-bold tracking-tight text-white">Raw Scraper Data</SheetTitle>
          <SheetDescription className="text-white/60">
            Inspect the exact JSON arrays and raw text data gathered by the autonomous agents across the web.
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="market_scout" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10">
            <TabsTrigger value="market_scout" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">Web</TabsTrigger>
            <TabsTrigger value="sentiment_analyst" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">Reddit</TabsTrigger>
            <TabsTrigger value="competitor_tracker" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">Reviews</TabsTrigger>
            <TabsTrigger value="trend_forecaster" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">Trends</TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0 mt-4 border border-white/10 rounded-md bg-black/50 overflow-hidden relative">
             <ScrollArea className="h-full w-full absolute inset-0">
               <div className="p-4">
                  <TabsContent value="market_scout" className="m-0 border-0 p-0">
                    <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap break-words">
                      {JSON.stringify(scrapedData.market_scout || {}, null, 2)}
                    </pre>
                  </TabsContent>
                  
                  <TabsContent value="sentiment_analyst" className="m-0 border-0 p-0">
                    <pre className="text-xs text-orange-400 font-mono whitespace-pre-wrap break-words">
                      {JSON.stringify(scrapedData.sentiment_analyst || {}, null, 2)}
                    </pre>
                  </TabsContent>

                  <TabsContent value="competitor_tracker" className="m-0 border-0 p-0">
                    <pre className="text-xs text-blue-400 font-mono whitespace-pre-wrap break-words">
                      {JSON.stringify(scrapedData.competitor_tracker || {}, null, 2)}
                    </pre>
                  </TabsContent>

                  <TabsContent value="trend_forecaster" className="m-0 border-0 p-0">
                    <pre className="text-xs text-purple-400 font-mono whitespace-pre-wrap break-words">
                      {JSON.stringify(scrapedData.trend_forecaster || {}, null, 2)}
                    </pre>
                  </TabsContent>
               </div>
            </ScrollArea>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
