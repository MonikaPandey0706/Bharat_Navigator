'use server';

/**
 * @fileOverview AI-powered destination suggestion flow.
 *
 * - suggestDestinations - A function that suggests destinations based on user interests.
 * - SuggestDestinationsInput - The input type for the suggestDestinations function.
 * - SuggestDestinationsOutput - The return type for the suggestDestinations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDestinationsInputSchema = z.object({
  interests: z
    .string()
    .describe('A comma-separated list of interests, e.g., History, Adventure, Food, Relaxation, Family-friendly.'),
  budget: z
    .enum(['Low', 'Mid-range', 'Luxury'])
    .describe('The budget for the trip.'),
  duration: z
    .number()
    .describe('The number of days for the trip.'),
});
export type SuggestDestinationsInput = z.infer<typeof SuggestDestinationsInputSchema>;

const SuggestDestinationsOutputSchema = z.object({
  destinations: z.array(
    z.object({
      city: z.string().describe('The name of the city.'),
      region: z.string().describe('The region or state the city is located in.'),
      description: z.string().describe('A short description of the destination.'),
      suggestedActivities: z.array(z.string()).describe('A list of suggested activities in the destination.'),
      estimatedCost: z.string().describe('Estimated cost of the trip based on the budget.'),
    })
  ).describe('A list of suggested destinations based on the user interests, budget and duration.'),
});
export type SuggestDestinationsOutput = z.infer<typeof SuggestDestinationsOutputSchema>;

export async function suggestDestinations(input: SuggestDestinationsInput): Promise<SuggestDestinationsOutput> {
  return suggestDestinationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDestinationsPrompt',
  input: {schema: SuggestDestinationsInputSchema},
  output: {schema: SuggestDestinationsOutputSchema},
  prompt: `You are an AI travel assistant specializing in suggesting travel destinations in India.

  Based on the user's interests, budget, and desired trip duration, suggest a list of destinations in India. For each destination, include a city name, region, short description, suggested activities, and estimated cost.

  Interests: {{{interests}}}
  Budget: {{{budget}}}
  Duration: {{{duration}}} days

  Format the output as a JSON object.
  `,
});

const suggestDestinationsFlow = ai.defineFlow(
  {
    name: 'suggestDestinationsFlow',
    inputSchema: SuggestDestinationsInputSchema,
    outputSchema: SuggestDestinationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
