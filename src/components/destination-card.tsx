import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PiggyBank, Sparkles, Tag } from "lucide-react";
import type { SuggestDestinationsOutput } from "@/ai/flows/destination-suggestion";

type Destination = SuggestDestinationsOutput['destinations'][0];

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <div className="relative w-full h-48 mb-4">
            <Image
                src={`https://placehold.co/600x400.png`}
                alt={`Image of ${destination.city}`}
                data-ai-hint={`${destination.city} landmark`}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
            />
        </div>
        <CardTitle className="font-headline">{destination.city}</CardTitle>
        <CardDescription>{destination.region}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">
          {destination.description}
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 mt-1 shrink-0 text-primary" />
            <div>
              <h4 className="font-semibold text-sm">Suggested Activities</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {destination.suggestedActivities.slice(0, 3).map((activity, i) => (
                  <Badge key={i} variant="secondary">{activity}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
         <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <PiggyBank className="h-4 w-4 shrink-0 text-primary" />
            <span>Estimated Cost: {destination.estimatedCost}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
