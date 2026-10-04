"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2, Mic, MicOff } from "lucide-react";
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

/* -------------------------------------------------------------------------- */
/* Speech Recognition Types                                                   */
/* -------------------------------------------------------------------------- */

type SpeechRecognitionResultEvent = Event & {
  results: SpeechRecognitionResultList;
  resultIndex: number;
};

type SpeechRecognitionErrorEvent = Event & {
  error: string;
  message?: string;
};

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;

  start: () => void;
  stop: () => void;
  abort: () => void;

  onstart: (() => void) | null;
  onend: (() => void) | null;

  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function AIChat() {
  const router = useRouter();

  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");

  /* ------------------------------------------------------------------------ */
  /* Voice refs                                                               */
  /* ------------------------------------------------------------------------ */

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  /*
   * Whether the user still wants voice recognition running.
   *
   * This is different from isListening because Chrome can terminate
   * SpeechRecognition unexpectedly.
   */
  const shouldListenRef = useRef(false);

  /*
   * Prevent multiple simultaneous restart attempts.
   */
  const restartingRef = useRef(false);

  /*
   * SpeechRecognition can return both final and interim results.
   */
  const finalTranscriptRef = useRef("");
  const interimTranscriptRef = useRef("");

  /* ------------------------------------------------------------------------ */
  /* Tool execution                                                           */
  /* ------------------------------------------------------------------------ */

  const processedToolCalls = useRef(new Set<string>());

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  /* ------------------------------------------------------------------------ */
  /* Handle AI tools                                                          */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    for (const message of messages) {
      for (const part of message.parts) {
        /*
         * UI action tool.
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
         * Navigation tool.
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

  /* ------------------------------------------------------------------------ */
  /* Start voice recognition                                                  */
  /* ------------------------------------------------------------------------ */

  const startListening = () => {
    /*
     * If already listening, clicking the microphone should stop it.
     */
    if (shouldListenRef.current) {
      stopListening();
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatus(
        "Voice input isn't supported in this browser. Try Chrome or Edge.",
      );

      return;
    }

    /*
     * Make sure an old recognizer is dead.
     */
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}

      recognitionRef.current = null;
    }

    /*
     * Reset transcript state.
     */
    finalTranscriptRef.current = "";
    interimTranscriptRef.current = "";

    shouldListenRef.current = true;
    restartingRef.current = false;

    /*
     * Clear old input when starting a new voice command.
     *
     * If you want to append voice to existing text instead,
     * remove this line.
     */
    setInput("");

    const recognition = new SpeechRecognition();

    /*
     * Chrome's implementation can stop by itself.
     * We handle that in onend and restart when necessary.
     */
    recognition.continuous = true;

    /*
     * We want interim text so the input updates while the
     * user is speaking.
     */
    recognition.interimResults = true;

    /*
     * Indian English.
     */
    recognition.lang = "en-IN";

    recognition.maxAlternatives = 1;

    /* ---------------------------------------------------------------------- */
    /* Recognition started                                                    */
    /* ---------------------------------------------------------------------- */

    recognition.onstart = () => {
      console.log("Vangrex voice: recognition started");

      setIsListening(true);
      setVoiceStatus("Listening...");
    };

    /* ---------------------------------------------------------------------- */
    /* Recognition result                                                     */
    /* ---------------------------------------------------------------------- */

    recognition.onresult = (event) => {
      console.log("Vangrex voice: result received");

      let finalText = finalTranscriptRef.current;
      let interimText = "";

      /*
       * Only process results from resultIndex onward.
       *
       * This is much safer than rebuilding the entire result array
       * every time Chrome sends an event.
       */
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];

        if (!result || !result[0]) {
          continue;
        }

        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalText += transcript + " ";
        } else {
          interimText += transcript;
        }
      }

      finalTranscriptRef.current = finalText;
      interimTranscriptRef.current = interimText;

      const combinedText = `${finalText}${interimText}`.trim();

      console.log("Vangrex voice transcription:", combinedText);

      if (combinedText) {
        setInput(combinedText);

        if (interimText) {
          setVoiceStatus("Hearing you...");
        } else {
          setVoiceStatus("Listening...");
        }
      }
    };

    /* ---------------------------------------------------------------------- */
    /* Recognition error                                                      */
    /* ---------------------------------------------------------------------- */

    recognition.onerror = (event) => {
      console.error("Vangrex voice ERROR:", {
        error: event.error,
        message: event.message,
      });

      /*
       * Chrome frequently emits no-speech.
       *
       * Don't kill the microphone for this.
       */
      if (event.error === "no-speech") {
        setVoiceStatus("Listening...");
        return;
      }

      /*
       * abort is expected when stopListening() is called.
       */
      if (event.error === "aborted") {
        return;
      }

      /*
       * Microphone could not be accessed.
       */
      if (event.error === "audio-capture") {
        shouldListenRef.current = false;
        recognitionRef.current = null;

        setIsListening(false);
        setVoiceStatus("Microphone unavailable.");

        return;
      }

      /*
       * Browser denied microphone access.
       */
      if (event.error === "not-allowed") {
        shouldListenRef.current = false;
        recognitionRef.current = null;

        setIsListening(false);
        setVoiceStatus("Microphone permission was denied.");

        return;
      }

      /*
       * Network errors are common with browser speech recognition.
       *
       * Keep listening and let onend attempt recovery.
       */
      if (event.error === "network") {
        setVoiceStatus("Reconnecting voice...");
        return;
      }

      /*
       * Anything else is considered fatal.
       */
      shouldListenRef.current = false;
      recognitionRef.current = null;

      setIsListening(false);
      setVoiceStatus(`Voice error: ${event.error}`);
    };

    /* ---------------------------------------------------------------------- */
    /* Recognition ended                                                      */
    /* ---------------------------------------------------------------------- */

    recognition.onend = () => {
      console.log("Vangrex voice: recognition ended");

      recognitionRef.current = null;

      /*
       * If the user didn't press the microphone button,
       * we're actually finished.
       */
      if (!shouldListenRef.current) {
        setIsListening(false);
        setVoiceStatus("");

        return;
      }

      /*
       * Chrome can terminate SpeechRecognition even though
       * the user is still speaking.
       *
       * Restart it automatically.
       */
      if (restartingRef.current) {
        return;
      }

      restartingRef.current = true;

      setVoiceStatus("Reconnecting microphone...");

      window.setTimeout(() => {
        restartingRef.current = false;

        /*
         * User may have clicked stop while the timeout
         * was waiting.
         */
        if (!shouldListenRef.current) {
          return;
        }

        try {
          recognitionRef.current = recognition;

          recognition.start();

          console.log("Vangrex voice: recognition restart requested");
        } catch (error) {
          console.error("Vangrex voice restart failed:", error);

          recognitionRef.current = null;

          /*
           * Don't permanently kill listening immediately.
           * The next user click can start a clean instance.
           */
          shouldListenRef.current = false;

          setIsListening(false);
          setVoiceStatus("Voice input stopped.");
        }
      }, 200);
    };

    /* ---------------------------------------------------------------------- */
    /* Save instance                                                          */
    /* ---------------------------------------------------------------------- */

    recognitionRef.current = recognition;

    setIsListening(true);
    setVoiceStatus("Starting microphone...");

    /* ---------------------------------------------------------------------- */
    /* Start                                                                  */
    /* ---------------------------------------------------------------------- */

    try {
      recognition.start();

      console.log("Vangrex voice: recognition.start() called");
    } catch (error) {
      console.error("Vangrex voice start error:", error);

      recognitionRef.current = null;
      shouldListenRef.current = false;

      setIsListening(false);
      setVoiceStatus("Could not start microphone.");
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Stop voice recognition                                                   */
  /* ------------------------------------------------------------------------ */

  const stopListening = () => {
    console.log("Vangrex voice: stopping");

    /*
     * Tell onend NOT to restart.
     */
    shouldListenRef.current = false;
    restartingRef.current = false;

    const recognition = recognitionRef.current;

    recognitionRef.current = null;

    if (recognition) {
      try {
        recognition.stop();
      } catch {}

      /*
       * abort makes sure Chrome doesn't keep the
       * recognition session alive.
       */
      try {
        recognition.abort();
      } catch {}
    }

    setIsListening(false);
    setVoiceStatus("");
  };

  /* ------------------------------------------------------------------------ */
  /* Submit message                                                           */
  /* ------------------------------------------------------------------------ */

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const text = input.trim();

    if (!text || status !== "ready") {
      return;
    }

    /*
     * Stop microphone before sending the message.
     */
    if (shouldListenRef.current) {
      stopListening();
    }

    sendMessage({
      text,
    });

    setInput("");
  };

  /* ------------------------------------------------------------------------ */
  /* Loading state                                                             */
  /* ------------------------------------------------------------------------ */

  const isLoading = status === "submitted" || status === "streaming";

  /* ------------------------------------------------------------------------ */
  /* UI                                                                       */
  /* ------------------------------------------------------------------------ */

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
        {/* Voice status */}

        {isListening && (
          <div className="px-3 pb-1 text-xs text-muted-foreground">
            {voiceStatus || "Listening..."}
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Input */}

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Ask the AI..."}
            disabled={isLoading}
            className="border-0 shadow-none focus-visible:ring-0"
          />

          {/* Microphone */}

          <Button
            type="button"
            size="icon"
            variant={isListening ? "destructive" : "ghost"}
            onClick={() => {
              if (isListening) {
                stopListening();
              } else {
                startListening();
              }
            }}
            disabled={isLoading}
            title={isListening ? "Stop listening" : "Voice input"}
            className="shrink-0 rounded-xl"
          >
            {isListening ? <MicOff /> : <Mic />}
          </Button>

          {/* Submit */}

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
/* UI ACTION EXECUTION                                                        */
/* ========================================================================== */

/*
 * Execute an action against the real application UI.
 */
function executeUIAction(
  input: UIActionInput,
  setInput: React.Dispatch<React.SetStateAction<string>>,
) {
  let element: HTMLElement | null = null;

  /* ------------------------------------------------------------------------ */
  /* Dynamic collection                                                       */
  /* ------------------------------------------------------------------------ */

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
    /* ---------------------------------------------------------------------- */
    /* Static element                                                         */
    /* ---------------------------------------------------------------------- */

    element = document.getElementById(input.target);
  }

  if (!element) {
    console.error(`Vangrex: element "${input.target}" not found`);

    return;
  }

  /* ------------------------------------------------------------------------ */
  /* Execute action                                                           */
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
      }

      break;

    case "type":
      if (element instanceof HTMLInputElement && input.value !== undefined) {
        setInputValue(element, input.value);
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
      console.warn(`Vangrex: unsupported action "${input.action}"`);
  }
}

/* ========================================================================== */
/* REACT CONTROLLED INPUT HELPER                                              */
/* ========================================================================== */

/*
 * Update a React-controlled input.
 *
 * React maintains its own value tracker, so directly assigning
 * element.value isn't always enough.
 */
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
