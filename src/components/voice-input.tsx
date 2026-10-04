"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

import { Button } from "@/components/ui/button";

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
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

type VoiceInputProps = {
  disabled?: boolean;
  onCommand: (command: string) => void;
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function VoiceInput({ disabled = false, onCommand }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");

  /*
   * The recognition object NEVER lives in React state.
   *
   * It survives normal React renders.
   */
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  /*
   * Whether the user still wants the microphone active.
   */
  const shouldListenRef = useRef(false);

  /*
   * Prevent duplicate restart attempts.
   */
  const restartingRef = useRef(false);

  /*
   * Final speech accumulated during this command.
   */
  const finalTranscriptRef = useRef("");

  /*
   * Current interim speech.
   */
  const interimTranscriptRef = useRef("");

  /*
   * Voice command submission debounce.
   */
  const submitTimerRef = useRef<number | null>(null);

  /*
   * Keep the latest callback without recreating recognition.
   */
  const onCommandRef = useRef(onCommand);

  useEffect(() => {
    onCommandRef.current = onCommand;
  }, [onCommand]);

  /*
   * Prevent the browser recognition object from being left alive
   * when the component is actually unmounted.
   */
  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      restartingRef.current = false;

      if (submitTimerRef.current !== null) {
        window.clearTimeout(submitTimerRef.current);
        submitTimerRef.current = null;
      }

      const recognition = recognitionRef.current;

      recognitionRef.current = null;

      if (recognition) {
        try {
          recognition.abort();
        } catch {}
      }
    };
  }, []);

  /* ======================================================================== */
  /* STOP                                                                     */
  /* ======================================================================== */

  const stopListening = () => {
    console.log("Vangrex voice: stopping");

    shouldListenRef.current = false;
    restartingRef.current = false;

    if (submitTimerRef.current !== null) {
      window.clearTimeout(submitTimerRef.current);
      submitTimerRef.current = null;
    }

    const recognition = recognitionRef.current;

    recognitionRef.current = null;

    if (recognition) {
      try {
        recognition.stop();
      } catch {}

      try {
        recognition.abort();
      } catch {}
    }

    setIsListening(false);
    setVoiceStatus("");
  };

  /* ======================================================================== */
  /* SUBMIT                                                                    */
  /* ======================================================================== */

  const submitCommand = (text: string) => {
    const command = text.trim();

    if (!command) {
      return;
    }

    /*
     * Set this BEFORE stopping recognition.
     *
     * This guarantees onend will not restart it.
     */
    shouldListenRef.current = false;

    console.log("Vangrex voice: submitting command:", command);

    if (submitTimerRef.current !== null) {
      window.clearTimeout(submitTimerRef.current);
      submitTimerRef.current = null;
    }

    const recognition = recognitionRef.current;

    recognitionRef.current = null;

    if (recognition) {
      try {
        recognition.stop();
      } catch {}

      try {
        recognition.abort();
      } catch {}
    }

    setIsListening(false);
    setVoiceStatus("");

    onCommandRef.current(command);
  };

  /* ======================================================================== */
  /* START                                                                     */
  /* ======================================================================== */

  const startListening = () => {
    if (disabled) {
      return;
    }

    /*
     * Toggle off.
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
     * Clean up any previous recognition instance.
     */
    const previousRecognition = recognitionRef.current;

    if (previousRecognition) {
      try {
        previousRecognition.abort();
      } catch {}

      recognitionRef.current = null;
    }

    if (submitTimerRef.current !== null) {
      window.clearTimeout(submitTimerRef.current);
      submitTimerRef.current = null;
    }

    finalTranscriptRef.current = "";
    interimTranscriptRef.current = "";

    shouldListenRef.current = true;
    restartingRef.current = false;

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognition.maxAlternatives = 1;

    /* ---------------------------------------------------------------------- */
    /* START                                                                   */
    /* ---------------------------------------------------------------------- */

    recognition.onstart = () => {
      console.log("Vangrex voice: recognition started");

      setIsListening(true);
      setVoiceStatus("Listening...");
    };

    /* ---------------------------------------------------------------------- */
    /* RESULT                                                                  */
    /* ---------------------------------------------------------------------- */

    recognition.onresult = (event) => {
      let finalText = finalTranscriptRef.current;
      let interimText = "";

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

      if (!combinedText) {
        return;
      }

      if (interimText) {
        setVoiceStatus("Hearing you...");
      } else {
        setVoiceStatus("Listening...");
      }

      /*
       * Chrome has produced a final result.
       *
       * Wait 700ms before submitting so that a sentence split across
       * recognition events can finish.
       */
      if (finalText && !interimText) {
        if (submitTimerRef.current !== null) {
          window.clearTimeout(submitTimerRef.current);
        }

        submitTimerRef.current = window.setTimeout(() => {
          submitTimerRef.current = null;

          const command = finalTranscriptRef.current.trim();

          if (!command) {
            return;
          }

          submitCommand(command);
        }, 700);
      }
    };

    /* ---------------------------------------------------------------------- */
    /* ERROR                                                                   */
    /* ---------------------------------------------------------------------- */

    recognition.onerror = (event) => {
      console.error("Vangrex voice ERROR:", {
        error: event.error,
        message: event.message,
      });

      if (event.error === "aborted") {
        return;
      }

      if (event.error === "no-speech") {
        setVoiceStatus("Listening...");
        return;
      }

      if (event.error === "audio-capture") {
        shouldListenRef.current = false;
        recognitionRef.current = null;

        setIsListening(false);
        setVoiceStatus("Microphone unavailable.");

        return;
      }

      if (event.error === "not-allowed") {
        shouldListenRef.current = false;
        recognitionRef.current = null;

        setIsListening(false);
        setVoiceStatus("Microphone permission was denied.");

        return;
      }

      /*
       * Network errors can happen with the browser speech service.
       * onend will attempt recovery.
       */
      if (event.error === "network") {
        setVoiceStatus("Reconnecting voice...");
        return;
      }

      shouldListenRef.current = false;
      recognitionRef.current = null;

      setIsListening(false);
      setVoiceStatus(`Voice error: ${event.error}`);
    };

    /* ---------------------------------------------------------------------- */
    /* END                                                                     */
    /* ---------------------------------------------------------------------- */

    recognition.onend = () => {
      console.log("Vangrex voice: recognition ended");

      recognitionRef.current = null;

      /*
       * This is the critical check.
       *
       * If submitCommand() or stopListening() set this to false,
       * recognition WILL NOT restart.
       */
      if (!shouldListenRef.current) {
        setIsListening(false);
        setVoiceStatus("");

        return;
      }

      if (restartingRef.current) {
        return;
      }

      restartingRef.current = true;

      setVoiceStatus("Reconnecting microphone...");

      window.setTimeout(() => {
        restartingRef.current = false;

        if (!shouldListenRef.current) {
          return;
        }

        /*
         * Create a NEW recognition session rather than trying to
         * reuse the ended instance.
         */
        startListeningSession();
      }, 200);
    };

    recognitionRef.current = recognition;

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

  /* ======================================================================== */
  /* RESTART SESSION                                                          */
  /* ======================================================================== */

  const startListeningSession = () => {
    if (!shouldListenRef.current) {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      shouldListenRef.current = false;
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("Vangrex voice: recognition restarted");

      setIsListening(true);
      setVoiceStatus("Listening...");
    };

    recognition.onresult = (event) => {
      let finalText = finalTranscriptRef.current;
      let interimText = "";

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

      if (!combinedText) {
        return;
      }

      setVoiceStatus(interimText ? "Hearing you..." : "Listening...");

      if (finalText && !interimText) {
        if (submitTimerRef.current !== null) {
          window.clearTimeout(submitTimerRef.current);
        }

        submitTimerRef.current = window.setTimeout(() => {
          submitTimerRef.current = null;

          const command = finalTranscriptRef.current.trim();

          if (command) {
            submitCommand(command);
          }
        }, 700);
      }
    };

    recognition.onerror = (event) => {
      console.error("Vangrex voice ERROR:", event.error);

      if (event.error === "aborted" || event.error === "no-speech") {
        return;
      }

      if (event.error === "not-allowed") {
        shouldListenRef.current = false;
        recognitionRef.current = null;

        setIsListening(false);
        setVoiceStatus("Microphone permission was denied.");
      }
    };

    recognition.onend = () => {
      console.log("Vangrex voice: recognition ended");

      recognitionRef.current = null;

      if (!shouldListenRef.current) {
        setIsListening(false);
        setVoiceStatus("");
        return;
      }

      if (restartingRef.current) {
        return;
      }

      restartingRef.current = true;

      window.setTimeout(() => {
        restartingRef.current = false;

        if (shouldListenRef.current) {
          startListeningSession();
        }
      }, 200);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (error) {
      console.error("Vangrex voice restart failed:", error);

      recognitionRef.current = null;

      if (shouldListenRef.current) {
        setVoiceStatus("Voice input stopped.");
      }
    }
  };

  /* ======================================================================== */
  /* UI                                                                       */
  /* ======================================================================== */

  return (
    <Button
      type="button"
      size="icon"
      variant={isListening ? "destructive" : "ghost"}
      onClick={startListening}
      disabled={disabled}
      title={isListening ? "Stop listening" : "Voice input"}
      className="shrink-0 rounded-xl"
    >
      {isListening ? <MicOff /> : <Mic />}
    </Button>
  );
}
