"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VoiceInput } from "@/components/voice-input";

type UIActionInput = {
  target: string;
  action: string;
  value?: string;
  item?: string;
  element?: string;
};

type NavigateOutput = {
  success?: boolean;
  path?: string;
};

export function AIChat() {
  const router = useRouter();

  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  /*
   * Prevent duplicate streamed tool execution.
   */
  const processedToolCalls = useRef(new Set<string>());

  /* ======================================================================== */
  /* TOOL EXECUTION                                                            */
  /* ======================================================================== */

  useEffect(() => {
    for (const message of messages) {
      for (const part of message.parts) {
        /* ------------------------------------------------------------------ */
        /* UI ACTION                                                           */
        /* ------------------------------------------------------------------ */

        if (
          part.type === "tool-executeUIAction" &&
          part.state === "input-available"
        ) {
          const actionInput = part.input as UIActionInput;

          const toolId = `${message.id}:executeUIAction:${JSON.stringify(
            actionInput,
          )}`;

          if (processedToolCalls.current.has(toolId)) {
            continue;
          }

          processedToolCalls.current.add(toolId);

          executeUIAction(actionInput, setInput);
        }

        /* ------------------------------------------------------------------ */
        /* NAVIGATION                                                          */
        /* ------------------------------------------------------------------ */

        if (
          part.type === "tool-navigate" &&
          part.state === "output-available"
        ) {
          const output = part.output as NavigateOutput | undefined;

          if (!output?.success || !output.path) {
            continue;
          }

          const toolId = `${message.id}:navigate:${JSON.stringify(output)}`;

          if (processedToolCalls.current.has(toolId)) {
            continue;
          }

          processedToolCalls.current.add(toolId);

          console.log("Vangrex navigation:", output.path);

          router.push(output.path);
        }
      }
    }
  }, [messages, router]);

  /* ======================================================================== */
  /* SEND COMMAND                                                              */
  /* ======================================================================== */

  const sendCommand = (text: string) => {
    const command = text.trim();

    if (!command) {
      return;
    }

    if (status !== "ready") {
      console.log("Vangrex: AI is busy");
      return;
    }

    console.log("Vangrex command:", command);

    setInput("");

    sendMessage({
      text: command,
    });
  };

  /* ======================================================================== */
  /* MANUAL SUBMIT                                                             */
  /* ======================================================================== */

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    sendCommand(input);
  };

  const isLoading = status === "submitted" || status === "streaming";

  /* ======================================================================== */
  /* UI                                                                        */
  /* ======================================================================== */

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[min(600px,calc(100vw-2rem))] -translate-x-1/2">
      {/* ------------------------------------------------------------------ */}
      {/* Messages                                                            */}
      {/* ------------------------------------------------------------------ */}

      {messages.length > 0 && (
        <div className="mb-3 max-h-80 overflow-y-auto rounded-2xl border bg-background/95 p-4 shadow-lg backdrop-blur">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                {message.parts.map((part, index) => {
                  if (part.type === "text") {
                    return (
                      <div
                        key={index}
                        className="mb-2 max-w-[80%] rounded-xl bg-muted px-3 py-2 text-sm"
                      >
                        {part.text}
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Input                                                               */}
      {/* ------------------------------------------------------------------ */}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border bg-background/95 p-2 shadow-lg backdrop-blur"
      >
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the AI..."
            disabled={isLoading}
            className="border-0 shadow-none focus-visible:ring-0"
          />

          {/* -------------------------------------------------------------- */}
          {/* VOICE                                                           */}
          {/* -------------------------------------------------------------- */}

          <VoiceInput disabled={isLoading} onCommand={sendCommand} />

          {/* -------------------------------------------------------------- */}
          {/* SEND                                                            */}
          {/* -------------------------------------------------------------- */}

          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="shrink-0 rounded-xl"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <ArrowUp />}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ========================================================================== */
/* REALTIME UI ACTION EXECUTION                                               */
/* ========================================================================== */

function executeUIAction(
  input: UIActionInput,
  setInput: React.Dispatch<React.SetStateAction<string>>,
) {
  let element: HTMLElement | null = null;

  /* ------------------------------------------------------------------------ */
  /* DYNAMIC COLLECTION                                                       */
  /* ------------------------------------------------------------------------ */

  if (input.item && input.element) {
    const collection = document.getElementById(input.target);

    if (!collection) {
      console.error(`Vangrex realtime: collection "${input.target}" not found`);

      return;
    }

    const item = findDynamicItem(collection, input.item);

    if (!item) {
      console.error(
        `Vangrex realtime: item "${input.item}" not found in "${input.target}"`,
      );

      return;
    }

    element = item.querySelector(
      `[data-ai-element="${CSS.escape(input.element)}"]`,
    ) as HTMLElement | null;

    if (!element) {
      console.error(
        `Vangrex realtime: element "${input.element}" not found inside item "${input.item}"`,
      );

      return;
    }
  } else {
    /* ---------------------------------------------------------------------- */
    /* STATIC ELEMENT                                                         */
    /* ---------------------------------------------------------------------- */

    element = document.getElementById(input.target);
  }

  if (!element) {
    console.error(`Vangrex realtime: element "${input.target}" not found`);

    return;
  }

  console.log("Vangrex realtime action:", {
    target: input.target,
    item: input.item,
    element: input.element,
    action: input.action,
    value: input.value,
  });

  /* ------------------------------------------------------------------------ */
  /* ACTION                                                                   */
  /* ------------------------------------------------------------------------ */

  switch (input.action) {
    case "click":
      element.click();
      break;

    case "focus":
      element.focus();
      break;

    case "clear":
      if (element instanceof HTMLInputElement) {
        setInputValue(element, "");
        setInput("");
      }
      break;

    case "type":
      if (element instanceof HTMLInputElement && input.value !== undefined) {
        setInputValue(element, input.value);
        setInput(input.value);
      }
      break;

    case "check":
      if (element instanceof HTMLInputElement && element.type === "checkbox") {
        if (!element.checked) {
          element.click();
        }
      } else {
        element.click();
      }
      break;

    case "uncheck":
      if (element instanceof HTMLInputElement && element.type === "checkbox") {
        if (element.checked) {
          element.click();
        }
      } else {
        element.click();
      }
      break;

    case "enable":
    case "disable": {
      const shouldEnable = input.action === "enable";

      const currentState = element.getAttribute("aria-checked") === "true";

      if (currentState !== shouldEnable) {
        element.click();
      }

      break;
    }

    default:
      console.warn(`Vangrex realtime: unsupported action "${input.action}"`);
  }
}

/* ========================================================================== */
/* DYNAMIC ITEM                                                               */
/* ========================================================================== */

function findDynamicItem(
  collection: HTMLElement,
  itemId: string,
): HTMLElement | null {
  const item = collection.querySelector(`[data-ai-id="${CSS.escape(itemId)}"]`);

  return item instanceof HTMLElement ? item : null;
}

/* ========================================================================== */
/* INPUT HELPER                                                               */
/* ========================================================================== */

function setInputValue(element: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;

  setter?.call(element, value);

  element.dispatchEvent(
    new Event("input", {
      bubbles: true,
    }),
  );

  element.dispatchEvent(
    new Event("change", {
      bubbles: true,
    }),
  );
}
