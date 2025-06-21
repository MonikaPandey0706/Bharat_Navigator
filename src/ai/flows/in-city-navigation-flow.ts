'use server';
/**
 * @fileOverview AI-powered in-city navigation flow.
 *
 * - getInCityNavigation - A function that generates detailed route options within a city.
 * - InCityNavigationInput - The input type for the getInCityNavigation function.
 * - InCityNavigationOutput - The return type for the getInCityNavigation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InCityNavigationInputSchema = z.object({
  start: z.string().describe('The starting point for the route.'),
  destination: z.string().describe('The destination point for the route.'),
  city: z.string().describe('The city where the navigation is taking place, e.g., Delhi.'),
});
export type InCityNavigationInput = z.infer<typeof InCityNavigationInputSchema>;

const RouteDetailSchema = z.object({
    name: z.string().describe("Name of the transport mode, e.g., 'Public Transit'."),
    time: z.string().describe("Estimated travel time, e.g., '45 min'."),
    cost: z.string().describe("Estimated cost, e.g., '₹25' or '₹150 - ₹200'."),
    distance: z.string().describe("Estimated distance in kilometers, e.g., '5.2 km'."),
    steps: z.array(z.string()).describe("A list of step-by-step directions. Include specific bus numbers or metro lines."),
});

const InCityNavigationOutputSchema = z.object({
    bestOption: z.enum(['public', 'metro', 'rideShare', 'walking']).describe("The recommended best transport option based on a balance of time and cost."),
    routes: z.object({
        public: RouteDetailSchema,
        metro: RouteDetailSchema,
        rideShare: RouteDetailSchema,
        walking: RouteDetailSchema,
    }).describe("An object containing detailed route information for different transport modes."),
});
export type InCityNavigationOutput = z.infer<typeof InCityNavigationOutputSchema>;

export async function getInCityNavigation(input: InCityNavigationInput): Promise<InCityNavigationOutput> {
  return inCityNavigationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'inCityNavigationPrompt',
  input: {schema: InCityNavigationInputSchema},
  output: {schema: InCityNavigationOutputSchema},
  prompt: `You are an expert in-city navigation assistant for India. Your task is to provide realistic and detailed travel options between two points within a specific Indian city.

  User wants to travel from "{{start}}" to "{{destination}}" in {{city}}.

  Generate four route options: Public Transit (Bus), Metro, Ride-sharing (Cab), and Walking.

  For each option, provide:
  - A plausible estimated travel time.
  - A realistic estimated cost in Indian Rupees (₹).
  - A plausible estimated distance in kilometers.
  - A sequence of clear, step-by-step directions.
  - For Public Transit, include a fictional but realistic bus number (e.g., "Bus 412").
  - For Metro, include a fictional but realistic line name (e.g., "Blue Line").

  Based on a good balance of time and cost, decide which of the four options is the 'bestOption' and set the value accordingly. For example, if the metro is significantly faster than the bus and not much more expensive, it could be the best option.

  Strictly format the output as a JSON object matching the provided schema.
  `,
});

const inCityNavigationFlow = ai.defineFlow(
  {
    name: 'inCityNavigationFlow',
    inputSchema: InCityNavigationInputSchema,
    outputSchema: InCityNavigationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
