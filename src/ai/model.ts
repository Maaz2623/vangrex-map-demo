import "server-only";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const aiModel = google("gemini-3.5-flash-lite");
