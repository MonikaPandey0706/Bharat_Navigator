'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAiSuggestions } from '@/lib/actions';
import { SuggestDestinationsOutput } from '@/ai/flows/destination-suggestion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import DestinationCard from './destination-card';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  interests: z.string().min(3, { message: 'Please tell us at least one interest.' }),
  budget: z.enum(['Low', 'Mid-range', 'Luxury']),
  duration: z.coerce.number().min(1, { message: 'Trip must be at least 1 day.' }).max(30, { message: 'Trip cannot exceed 30 days.' }),
});

export default function HomePageClient() {
  const [result, setResult] = useState<SuggestDestinationsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: '',
      budget: 'Mid-range',
      duration: 7,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const suggestions = await getAiSuggestions(values);
      setResult(suggestions);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to get suggestions. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
          Discover Your Next Indian Adventure
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Tell us your travel preferences, and our AI will craft personalized destination suggestions just for you.
        </p>
      </section>

      <section className="max-w-2xl mx-auto p-8 border rounded-lg bg-card shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What are your interests?</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., History, Adventure, Food, Beaches" {...field} />
                  </FormControl>
                  <FormDescription>
                    Separate interests with a comma.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a budget" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Mid-range">Mid-range</SelectItem>
                        <SelectItem value="Luxury">Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (in days)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg" disabled={loading}>
              {loading ? 'Crafting Itinerary...' : 'Plan My Adventure'}
            </Button>
          </form>
        </Form>
      </section>
      
      <section className="mt-12">
        {loading && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[225px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}
        {result?.destinations && result.destinations.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-8 font-headline">Your Personalized Suggestions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {result.destinations.map((destination, index) => (
                <DestinationCard key={index} destination={destination} />
              ))}
            </div>
          </div>
        )}
         {result?.destinations && result.destinations.length === 0 && !loading && (
             <Alert>
             <Terminal className="h-4 w-4" />
             <AlertTitle>No Suggestions Found</AlertTitle>
             <AlertDescription>
               We couldn&apos;t find any destinations matching your criteria. Try being more general with your interests.
             </AlertDescription>
           </Alert>
         )}
      </section>
    </>
  );
}
