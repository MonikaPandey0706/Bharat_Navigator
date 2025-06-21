'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/use-local-storage';
import { Utensils, Landmark, Bed, Sun } from 'lucide-react';

const tripSchema = z.object({
  origin: z.string().min(2, 'Origin city is required.'),
  destination: z.string().min(2, 'Destination city is required.'),
  days: z.coerce.number().min(1).max(30),
  budget: z.enum(['Low', 'Mid-range', 'Luxury']),
  interests: z.string().min(3, 'At least one interest is required.'),
});

type TripPlan = z.infer<typeof tripSchema> & { id: string, plan: any[] };

export default function TripPlannerPage() {
  const [plannedTrip, setPlannedTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [savedTrips, setSavedTrips] = useLocalStorage<TripPlan[]>('savedTrips', []);

  const form = useForm<z.infer<typeof tripSchema>>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      origin: '',
      destination: '',
      days: 3,
      budget: 'Mid-range',
      interests: 'History, Food',
    },
  });

  const generateMockPlan = (values: z.infer<typeof tripSchema>) => {
    return Array.from({ length: values.days }).map((_, i) => ({
      day: i + 1,
      title: `Exploring ${values.destination}`,
      activities: [
        { time: '9:00 AM', desc: 'Visit a famous landmark', icon: <Landmark className="h-4 w-4 text-primary" /> },
        { time: '1:00 PM', desc: 'Lunch at a local restaurant', icon: <Utensils className="h-4 w-4 text-primary" /> },
        { time: '3:00 PM', desc: 'Afternoon sightseeing', icon: <Sun className="h-4 w-4 text-primary" /> },
        { time: '8:00 PM', desc: 'Dinner and relax at hotel', icon: <Bed className="h-4 w-4 text-primary" /> },
      ],
    }));
  };

  function onSubmit(values: z.infer<typeof tripSchema>) {
    setIsLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      const plan = generateMockPlan(values);
      setPlannedTrip({ ...values, plan });
      setIsLoading(false);
      toast({ title: 'Trip Plan Generated!', description: 'Your personalized itinerary is ready.' });
    }, 1500);
  }

  const saveTrip = () => {
    if (plannedTrip) {
      const newTrip = { ...plannedTrip, id: new Date().toISOString() };
      setSavedTrips([...savedTrips, newTrip]);
      toast({ title: 'Trip Saved!', description: 'Your itinerary has been saved for later.' });
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Plan My Adventure</h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Create a detailed, day-by-day travel itinerary. Let our intelligence handle the optimization, so you can focus on the experience.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField name="origin" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Origin City</FormLabel><FormControl><Input placeholder="e.g., Mumbai" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField name="destination" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Destination City</FormLabel><FormControl><Input placeholder="e.g., Jaipur" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField name="days" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Number of Days</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="budget" render={({ field }) => (
                    <FormItem><FormLabel>Budget</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Low">Low</SelectItem><SelectItem value="Mid-range">Mid-range</SelectItem><SelectItem value="Luxury">Luxury</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                  <FormField name="interests" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Interests</FormLabel><FormControl><Input placeholder="e.g., History, Food" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
                    {isLoading ? 'Generating Plan...' : 'Generate Trip Plan'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {isLoading && <div className="p-8 text-center">Generating your personalized itinerary...</div>}
          {!isLoading && !plannedTrip && (
             <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center text-muted-foreground p-8">
                <p>Your generated trip plan will appear here.</p>
                <p>Fill out the form to get started!</p>
                </CardContent>
            </Card>
          )}
          {plannedTrip && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Your Itinerary: {plannedTrip.destination}</CardTitle>
                  <Button variant="outline" onClick={saveTrip}>Save Trip</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible defaultValue="item-0">
                  {plannedTrip.plan.map((day: any, index: number) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger className="text-lg font-semibold">Day {day.day}: {day.title}</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-4 pl-4 border-l">
                          {day.activities.map((activity: any, actIndex: number) => (
                             <li key={actIndex} className="relative pl-6">
                               <span className="absolute left-[-10px] top-1 h-5 w-5 bg-background border-2 border-primary rounded-full"></span>
                               <div className="flex items-start gap-3">
                                 <div className="mt-1">{activity.icon}</div>
                                 <div>
                                   <p className="font-semibold">{activity.time}</p>
                                   <p className="text-muted-foreground">{activity.desc}</p>
                                 </div>
                               </div>
                             </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
