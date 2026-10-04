"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  const processedToolCalls = useRef(new Set<string>());

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  useEffect(() => {
    for (const message of messages) {
      for (const part of message.parts) {
        /*
         * ----------------------------------------
         * UI ACTION
         * ----------------------------------------
         */
        if (
          part.type === "tool-executeUIAction" &&
          part.state === "input-available"
        ) {
          const toolId = `${message.id}:${part.type}:${JSON.stringify(
            part.input,
          )}`;

          if (processedToolCalls.current.has(toolId)) {
            continue;
          }

          processedToolCalls.current.add(toolId);

          executeUIAction(part.input as UIActionInput, setInput);
        }

        /*
         * ----------------------------------------
         * NAVIGATION
         * ----------------------------------------
         */
        if (
          part.type === "tool-navigate" &&
          part.state === "output-available"
        ) {
          const toolId = `${message.id}:${part.type}:${JSON.stringify(
            part.output,
          )}`;

          if (processedToolCalls.current.has(toolId)) {
            continue;
          }

          processedToolCalls.current.add(toolId);

          const output = part.output as NavigateOutput | undefined;

          if (output?.success && output.path) {
            router.push(output.path);
          }
        }
      }
    }
  }, [messages, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const text = input.trim();

    if (!text || status !== "ready") {
      return;
    }

    sendMessage({ text });

    setInput("");
  };

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[min(600px,calc(100vw-2rem))] -translate-x-1/2">
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

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-2xl border bg-background/95 p-2 shadow-lg backdrop-blur"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the AI..."
          disabled={isLoading}
          className="border-0 shadow-none focus-visible:ring-0"
        />

        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isLoading}
          className="shrink-0 rounded-xl"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <ArrowUp />}
        </Button>
      </form>
    </div>
  );
}

function executeUIAction(
  input: UIActionInput,
  setInput: React.Dispatch<React.SetStateAction<string>>,
) {
  let element: HTMLElement | null = null;

  /*
   * ==========================================
   * DYNAMIC COLLECTION ELEMENT
   * ==========================================
   *
   * Example:
   *
   * target  = ai-customers-list
   * item    = maaz
   * element = emailButton
   */
  if (input.item && input.element) {
    const collection = document.getElementById(input.target);

    if (!collection) {
      console.error(`Vangrex: collection "${input.target}" not found`);

      return;
    }

    const item = collection.querySelector(
      `[data-ai-element="customer"][data-ai-id="${CSS.escape(input.item)}"]`,
    );

    if (!item) {
      console.error(
        `Vangrex: item "${input.item}" not found in collection "${input.target}"`,
      );

      return;
    }

    element = item.querySelector(
      `[data-ai-element="${CSS.escape(input.element)}"]`,
    ) as HTMLElement | null;

    if (!element) {
      console.error(
        `Vangrex: element "${input.element}" not found inside item "${input.item}"`,
      );

      return;
    }
  } else {

  /*
   * ==========================================
   * STATIC ELEMENT
   * ==========================================
   */
    element = document.getElementById(input.target);
  }

  if (!element) {
    console.error(`Vangrex: element "${input.target}" not found`);

    return;
  }

  /*
   * ==========================================
   * ACTION EXECUTION
   * ==========================================
   */
  switch (input.action) {
    case "click": {
      element.click();
      break;
    }

    case "focus": {
      element.focus();
      break;
    }

    case "clear": {
      if (element instanceof HTMLInputElement) {
        setInputValue(element, "");
      }

      break;
    }

    case "type": {
      if (element instanceof HTMLInputElement && input.value !== undefined) {
        setInputValue(element, input.value);
      }

      break;
    }

    case "check": {
      if (element instanceof HTMLInputElement && element.type === "checkbox") {
        if (!element.checked) {
          element.click();
        }
      } else {
        element.click();
      }

      break;
    }

    case "uncheck": {
      if (element instanceof HTMLInputElement && element.type === "checkbox") {
        if (element.checked) {
          element.click();
        }
      } else {
        element.click();
      }

      break;
    }

    case "enable":
    case "disable": {
      const shouldEnable = input.action === "enable";

      const currentState = element.getAttribute("aria-checked") === "true";

      if (currentState !== shouldEnable) {
        element.click();
      }

      break;
    }

    default: {
      console.warn(`Vangrex: unsupported action "${input.action}"`);
    }
  }
}

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
