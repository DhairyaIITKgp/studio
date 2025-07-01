"use server";

import { personalizedFocusCoach, PersonalizedFocusCoachInput, PersonalizedFocusCoachOutput } from "@/ai/flows/personalized-focus-coach";
import { z } from "zod";

const PersonalizedFocusCoachInputSchema = z.object({
  focusSessionHistory: z.string(),
  userPreferences: z.string(),
});

export async function getCoaching(input: PersonalizedFocusCoachInput): Promise<PersonalizedFocusCoachOutput | { error: string }> {
  const parsedInput = PersonalizedFocusCoachInputSchema.safeParse(input);

  if (!parsedInput.success) {
    return { error: "Invalid input." };
  }

  try {
    const result = await personalizedFocusCoach(parsedInput.data);
    return result;
  } catch (e) {
    console.error("Error getting coaching:", e);
    return { error: "An unexpected error occurred while getting your coaching advice. Please try again later." };
  }
}
