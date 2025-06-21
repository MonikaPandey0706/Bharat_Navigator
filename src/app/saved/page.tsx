'use client';

import { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Map, Plane, Trash2 } from 'lucide-react';
import type { TripPlannerOutput } from '@/ai/flows/trip-planner-flow';

type SavedTrip = { 
  id: string; 
  destination: string; 
  origin: string; 
  days: number; 
  plan: TripPlannerOutput['plan'];
};
type RoutePlan = { id: string; start: string; destination: string; routes: any };

export default function SavedPage() {
  const [savedTrips, setSavedTrips] = useLocalStorage<SavedTrip[]>('savedTrips', []);
  const [savedRoutes, setSavedRoutes] = useLocalStorage<RoutePlan[]>('savedRoutes', []);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const deleteTrip = (id: string) => {
    setSavedTrips(savedTrips.filter(trip => trip.id !== id));
  };

  const deleteRoute = (id: string) => {
    setSavedRoutes(savedRoutes.filter(route => route.id !== id));
  };
  
  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">My Saved Plans</h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Access your saved trip itineraries and in-city routes. Your adventures, all in one place.
        </p>
      </section>

      <Tabs defaultValue="trips" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="trips"><Plane className="h-4 w-4 mr-2"/>Saved Trips</TabsTrigger>
          <TabsTrigger value="routes"><Map className="h-4 w-4 mr-2"/>Saved Routes</TabsTrigger>
        </TabsList>
        <TabsContent value="trips">
          <Card>
            <CardHeader>
              <CardTitle>Saved Trip Itineraries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {savedTrips.length === 0 ? (
                <p className="text-muted-foreground">You have no saved trips. Plan one from the 'Trip Planner' page!</p>
              ) : (
                savedTrips.map((trip) => (
                  <Card key={trip.id} className="p-4">
                     <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold">{trip.destination}</h3>
                            <p className="text-sm text-muted-foreground">{trip.origin} → {trip.destination} ({trip.days} days)</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteTrip(trip.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                     </div>
                     <Accordion type="single" collapsible className="w-full mt-2">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>View Itinerary</AccordionTrigger>
                            <AccordionContent>
                                {trip.plan.map((day, index) => (
                                    <div key={index} className="mb-4">
                                        <h4 className="font-semibold">Day {day.day}: {day.title}</h4>
                                        <ul className="list-disc pl-5 text-sm text-muted-foreground mt-2 space-y-1">
                                            {day.activities.map((act, i) => <li key={i}><span className="font-medium">{act.time}:</span> {act.description}</li>)}
                                        </ul>
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="routes">
          <Card>
            <CardHeader>
              <CardTitle>Saved In-City Routes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {savedRoutes.length === 0 ? (
                <p className="text-muted-foreground">You have no saved routes. Find one from the 'In-City Navigation' page!</p>
              ) : (
                savedRoutes.map((route) => (
                  <Card key={route.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                          <h3 className="font-bold">{route.start} to {route.destination}</h3>
                          <p className="text-sm text-muted-foreground">Multi-modal route options saved.</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteRoute(route.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
