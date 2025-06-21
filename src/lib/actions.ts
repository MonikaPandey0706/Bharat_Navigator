
"use server";

import { suggestDestinations, SuggestDestinationsInput, SuggestDestinationsOutput } from "@/ai/flows/destination-suggestion";

export async function getAiSuggestions(input: SuggestDestinationsInput): Promise<SuggestDestinationsOutput> {
  try {
    const result = await suggestDestinations(input);
    return result;
  } catch (error) {
    console.error("AI suggestion error:", error);
    throw new Error("Failed to fetch AI-powered suggestions. Please try again later.");
  }
}
