
"use server";

import { suggestDestinations, SuggestDestinationsInput, SuggestDestinationsOutput } from "@/ai/flows/destination-suggestion";
import { planTrip, TripPlannerInput, TripPlannerOutput } from "@/ai/flows/trip-planner-flow";

export async function getAiSuggestions(input: SuggestDestinationsInput): Promise<SuggestDestinationsOutput> {
  try {
    const result = await suggestDestinations(input);
    return result;
  } catch (error) {
    console.error("AI suggestion error:", error);
    throw new Error("Failed to fetch AI-powered suggestions. Please try again later.");
  }
}

export async function getTripPlan(input: TripPlannerInput): Promise<TripPlannerOutput> {
  try {
    const result = await planTrip(input);
    return result;
  } catch (error) {
    console.error("AI trip plan error:", error);
    throw new Error("Failed to generate trip plan. Please try again later.");
  }
}
