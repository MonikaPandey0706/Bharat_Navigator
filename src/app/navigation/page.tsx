'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bus, TramFront, Car, Footprints, Clock, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/use-local-storage';

const routeSchema = z.object({
  start: z.string().min(3, 'Starting point is required.'),
  destination: z.string().min(3, 'Destination is required.'),
});

type RoutePlan = z.infer<typeof routeSchema> & { id: string, routes: any };

export default function NavigationPage() {
  const [routeOptions, setRouteOptions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [savedRoutes, setSavedRoutes] = useLocalStorage<RoutePlan[]>('savedRoutes', []);

  const form = useForm<z.infer<typeof routeSchema>>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      start: '',
      destination: '',
    },
  });

  const generateMockRoutes = (values: z.infer<typeof routeSchema>) => ({
    public: {
      name: 'Public Transit',
      icon: <Bus className="h-5 w-5" />,
      time: '45 min',
      cost: '₹25',
      steps: ['Walk to Bus Stop A', 'Take Bus 123 (5 stops)', 'Get off at Stop B', 'Walk to destination'],
    },
    metro: {
      name: 'Metro',
      icon: <TramFront className="h-5 w-5" />,
      time: '30 min',
      cost: '₹40',
      steps: ['Walk to Metro Station X', 'Take Blue Line towards Y (4 stations)', 'Change to Red Line at Z', 'Get off at Station W', 'Walk to destination'],
    },
    rideShare: {
      name: 'Ride-sharing',
      icon: <Car className="h-5 w-5" />,
      time: '20 min',
      cost: '₹150 - ₹200',
      steps: ['Book a cab via app', 'Driver will follow the optimal route'],
    },
    walking: {
      name: 'Walking',
      icon: <Footprints className="h-5 w-5" />,
      time: '1 hr 15 min',
      cost: 'Free',
      steps: ['Follow the walking path shown on the map.'],
    },
  });

  function onSubmit(values: z.infer<typeof routeSchema>) {
    setIsLoading(true);
    setTimeout(() => {
      setRouteOptions({ ...values, routes: generateMockRoutes(values) });
      setIsLoading(false);
      toast({ title: 'Routes Found!', description: `Showing best options from ${values.start} to ${values.destination}.` });
    }, 1000);
  }

  const saveRoute = () => {
    if (routeOptions) {
        const newRoute = { ...routeOptions, id: new Date().toISOString() };
        setSavedRoutes([...savedRoutes, newRoute]);
        toast({ title: 'Route Saved!', description: 'This route has been saved for later.' });
    }
  }

  const RouteDetails = ({ route }: { route: any }) => (
    <Card className="bg-background">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="text-xl flex items-center gap-2">
                {route.icon} {route.name}
            </CardTitle>
            <span className="text-sm font-semibold rounded-full bg-primary/10 px-3 py-1 text-primary">Best Value</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around items-center mb-6 text-center border-b pb-4">
            <div><p className="font-bold text-lg flex items-center gap-1"><Clock className="h-4 w-4"/>{route.time}</p><p className="text-xs text-muted-foreground">Est. Time</p></div>
            <div><p className="font-bold text-lg flex items-center gap-1"><Wallet className="h-4 w-4"/>{route.cost}</p><p className="text-xs text-muted-foreground">Est. Cost</p></div>
        </div>
        <ol className="relative border-l border-border space-y-4 pl-8">
            {route.steps.map((step: string, index: number) => (
                 <li key={index}>
                    <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground ring-8 ring-background">{index + 1}</span>
                    <p className="text-sm">{step}</p>
                </li>
            ))}
        </ol>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">In-City Navigation</h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Find the best way to get from A to B. We provide smart, multi-modal routing for public transit, ride-sharing, and more.
        </p>
      </section>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Find a Route</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField name="start" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Starting Point</FormLabel><FormControl><Input placeholder="e.g., Connaught Place" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField name="destination" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Destination</FormLabel><FormControl><Input placeholder="e.g., India Gate" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
                    {isLoading ? 'Finding Routes...' : 'Get Directions'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
           {!routeOptions && !isLoading && (
             <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center text-muted-foreground p-8">
                <p>Route options will appear here.</p>
                <p>Enter your start and end points to find the best route.</p>
                </CardContent>
            </Card>
           )}
           {isLoading && <p className="text-center p-8">Finding best routes...</p>}
           {routeOptions && (
             <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold font-headline">Routes for you</h2>
                    <Button variant="outline" onClick={saveRoute}>Save Route</Button>
                </div>
                <Tabs defaultValue="public" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="public">Bus</TabsTrigger>
                        <TabsTrigger value="metro">Metro</TabsTrigger>
                        <TabsTrigger value="rideShare">Cab</TabsTrigger>
                        <TabsTrigger value="walking">Walk</TabsTrigger>
                    </TabsList>
                    <TabsContent value="public"><RouteDetails route={routeOptions.routes.public} /></TabsContent>
                    <TabsContent value="metro"><RouteDetails route={routeOptions.routes.metro} /></TabsContent>
                    <TabsContent value="rideShare"><RouteDetails route={routeOptions.routes.rideShare} /></TabsContent>
                    <TabsContent value="walking"><RouteDetails route={routeOptions.routes.walking} /></TabsContent>
                </Tabs>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
