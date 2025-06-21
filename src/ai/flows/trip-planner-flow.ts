'use server';
/**
 * @fileOverview AI-powered trip planning flow with flight and hotel suggestions.
 *
 * - planTrip - A function that generates a detailed travel itinerary.
 * - TripPlannerInput - The input type for the planTrip function.
 * - TripPlannerOutput - The return type for the planTrip function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Tool to find flights (mock implementation)
const findFlights = ai.defineTool(
    {
      name: 'findFlights',
      description: 'Finds available flights for a given route and date.',
      inputSchema: z.object({
        origin: z.string().describe('The departure city.'),
        destination: z.string().describe('The arrival city.'),
        date: z.string().describe('The date of travel in YYYY-MM-DD format.'),
      }),
      outputSchema: z.array(z.object({
          airline: z.string(),
          flightNumber: z.string(),
          departureTime: z.string(),
          arrivalTime: z.string(),
          price: z.number(),
      })),
    },
    async ({origin, destination, date}) => {
      // In a real app, this would call a flight API.
      // For this demo, we'll return mock data.
      console.log(`Searching for flights from ${origin} to ${destination} on ${date}`);
      return [
        { airline: 'IndiGo', flightNumber: '6E 204', departureTime: '08:30 AM', arrivalTime: '10:00 AM', price: 4500 },
        { airline: 'Vistara', flightNumber: 'UK 990', departureTime: '09:15 AM', arrivalTime: '10:45 AM', price: 5200 },
        { airline: 'Air India', flightNumber: 'AI 502', departureTime: '02:00 PM', arrivalTime: '03:30 PM', price: 4800 },
        { airline: 'SpiceJet', flightNumber: 'SG 8169', departureTime: '06:45 PM', arrivalTime: '08:15 PM', price: 4300 },
      ];
    }
  );

// Tool to find hotels (mock implementation)
const findHotels = ai.defineTool(
    {
      name: 'findHotels',
      description: 'Finds available hotels in a city based on budget.',
      inputSchema: z.object({
        city: z.string().describe('The city where the hotel is located.'),
        budget: z.enum(['Low', 'Mid-range', 'Luxury']).describe('The user\'s budget.'),
      }),
      outputSchema: z.array(z.object({
          name: z.string(),
          rating: z.number(),
          priceRange: z.string(),
      })),
    },
    async ({city, budget}) => {
        // Mock hotel data based on budget
        console.log(`Searching for ${budget} hotels in ${city}`);
        const hotels = {
            'Low': [
                { name: 'Hotel Pearl Palace', rating: 4.2, priceRange: '₹1500-2500' },
                { name: 'Zostel Jaipur', rating: 4.5, priceRange: '₹800-1800' },
            ],
            'Mid-range': [
                { name: 'ITC Rajputana, a Luxury Collection Hotel', rating: 4.6, priceRange: '₹5000-8000' },
                { name: 'Jai Mahal Palace', rating: 4.7, priceRange: '₹7000-12000' },
            ],
            'Luxury': [
                { name: 'Rambagh Palace', rating: 4.9, priceRange: '₹25000+' },
                { name: 'The Oberoi Rajvilas', rating: 4.8, priceRange: '₹30000+' },
            ]
        };
        // Return hotels for the requested city, defaulting to Jaipur for demo
        return hotels[budget] || hotels['Mid-range'];
    }
);


const TripPlannerInputSchema = z.object({
  origin: z.string().describe('The starting city for the trip.'),
  destination: z.string().describe('The main destination city for the trip.'),
  startDate: z.string().describe("The start date for the trip in 'YYYY-MM-DD' format."),
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

const FlightInfoSchema = z.object({
    details: z.string().describe("Details of the recommended flight, e.g., 'IndiGo 6E-204 at 8:30 AM'."),
    alternatives: z.string().describe("Alternative flight options, especially if no morning flights are available. Mention at least one other option."),
});

const HotelInfoSchema = z.object({
    name: z.string().describe("Name of the suggested hotel."),
    suggestionReason: z.string().describe("A brief reason for suggesting this hotel, related to budget and interests.")
});

const TripPlannerOutputSchema = z.object({
  flightInfo: FlightInfoSchema,
  hotelInfo: HotelInfoSchema,
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
  tools: [findFlights, findHotels],
  prompt: `You are an expert travel planner for trips within India. Create a detailed, day-by-day itinerary based on the user's preferences.

The user is planning a trip from {{origin}} to {{destination}} for {{days}} days, starting on {{startDate}}.
Their budget is {{budget}} and they are interested in {{interests}}.

Your task is to:
1.  **Find Flights**: Use the 'findFlights' tool to find flights from {{origin}} to {{destination}} for the start date.
    - Recommend the best morning flight.
    - If no morning flights are available, recommend the best available option and list other options (e.g., afternoon, evening) in the 'alternatives' field.
2.  **Find a Hotel**: Use the 'findHotels' tool to find a suitable hotel in {{destination}} that matches the user's {{budget}}. Select the best one and provide a reason for your choice.
3.  **Create Itinerary**: Generate a logical and enjoyable day-by-day itinerary for the {{days}} days.
    - The first day should include traveling to the airport, the flight itself, and checking into the suggested hotel.
    - For each day, provide a title and a list of activities.
    - Group attractions that are geographically close to each other to minimize travel time.
    - Suggest specific places (monuments, restaurants, markets, etc.).
    - Be realistic about the number of activities per day.
    - For each activity, specify a time, a detailed description, and an appropriate activityType.

Strictly structure the output as a JSON object that follows the provided schema.
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
