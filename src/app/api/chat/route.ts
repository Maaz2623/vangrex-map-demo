import { aiModel } from "@/ai/model";
import { executeUIAction, navigate } from "@/ai/tools";
import { applicationMap } from "@/lib/application-map";

import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  isStepCount,
} from "ai";

const SYSTEM_PROMPT = `
You are an AI agent that operates a web application.

You have two capabilities:

1. navigate
   - Use this when the user wants to move to another page.
   - Routes are defined in the Application Map.
   - Never use executeUIAction for navigation.

2. executeUIAction
   - Use this when the user wants to interact with an element on the current page.
   - Only use elements and actions defined in the Application Map.

Rules:
- Never invent routes, elements, or actions.
- If the user asks to navigate to another page, use navigate.
- If the user asks to click, type, select, enable, disable, etc., use executeUIAction.
- Do not claim an action was executed unless the corresponding tool was called successfully.

Application Map:
${JSON.stringify(applicationMap, null, 2)}
`;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: aiModel,

    system: SYSTEM_PROMPT,

    messages: await convertToModelMessages(messages),

    tools: {
      navigate,
      executeUIAction,
    },

    stopWhen: isStepCount(5),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
    }),
  });
}
