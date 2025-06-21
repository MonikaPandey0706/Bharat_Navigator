'use server';
/**
 * @fileOverview AI-powered trip planning flow.
 *
 * - planTrip - A function that generates a detailed travel itinerary.
 * - TripPlannerInput - The input type for the planTrip function.
 * - TripPlannerOutput - The return type for the planTrip function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TripPlannerInputSchema = z.object({
  origin: z.string().describe('The starting city for the trip.'),
  destination: z.string().describe('The main destination city for the trip.'),
  days: z.number().min(1).max(30).describe('The total number of days for the trip.'),
  budget: z.enum(['Low', 'Mid-range', 'Luxury']).describe('The budget for the trip.'),
  interests: z
    .string()
    .describe('A comma-separated list of interests, e.g., History, Adventure, Food, Relaxation, Shopping.'),
});
export type TripPlannerInput = z.infer<typeof TripPlannerInputSchema>;

const ActivitySchema = z.object({
    time: z.string().describe("Suggested time for the activity, e.g., '9:00 AM'."),
    description: z.string().describe("A detailed description of the activity."),
    activityType: z.enum(['sightseeing', 'food', 'activity', 'accommodation', 'travel']).describe("The type of activity to help select an icon. 'sightseeing' for landmarks, 'food' for meals, 'activity' for specific actions like shopping or rafting, 'accommodation' for hotel check-ins, 'travel' for transit between places.")
});

const TripPlannerOutputSchema = z.object({
  plan: z.array(z.object({
      day: z.number().describe("The day number of the itinerary."),
      title: z.string().describe("A short, catchy title for the day's plan, e.g., 'Royal Palaces and Bazaars'."),
      activities: z.array(ActivitySchema).describe("A list of activities planned for the day.")
  })).describe("A detailed day-by-day itinerary for the trip.")
});
export type TripPlannerOutput = z.infer<typeof TripPlannerOutputSchema>;

export async function planTrip(input: TripPlannerInput): Promise<TripPlannerOutput> {
  return tripPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tripPlannerPrompt',
  input: {schema: TripPlannerInputSchema},
  output: {schema: TripPlannerOutputSchema},
  prompt: `You are an expert travel planner for trips within India. Create a detailed, day-by-day itinerary based on the user's preferences.

The user is planning a trip from {{origin}} to {{destination}} for {{days}} days.
Their budget is {{budget}} and they are interested in {{interests}}.

Please generate a logical and enjoyable itinerary.
- For each day, provide a title and a list of activities.
- Group attractions that are geographically close to each other to minimize travel time.
- Suggest specific places (monuments, restaurants, markets, etc.).
- Be realistic about the number of activities per day.
- Structure the output as a JSON object that strictly follows the provided schema.
- For each activity, specify a time, a detailed description, and an appropriate activityType.
  `,
});

const tripPlannerFlow = ai.defineFlow(
  {
    name: 'tripPlannerFlow',
    inputSchema: TripPlannerInputSchema,
    outputSchema: TripPlannerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
