import { useEffect, useRef, useState } from "react";
import { marked } from "marked";

interface Message {
  text: string;
  sender: string;
  isStreaming: boolean;
  isError: boolean;
  isComplete: boolean;
}

interface ChatboxProps {
  className?: string;
  active: boolean;
  streamId: number;
  sendMessage: Function;
  setStreamId: Function;
}
export default function Chatbox({
  className,
  active,
  streamId,
  setStreamId,
  sendMessage,
}: ChatboxProps) {
  className += `fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 bg-white p-6 rounded-lg border border-[#e5e7eb] w-[1000px] h-[634px] whitespace-normal`;
  const inputBox = useRef<HTMLInputElement>(null);
  const messageEnd = useRef<HTMLDivElement>(null);

  const [messageText, setMessageText] = useState<string>("");
  const [receivedMessages, setMessages] = useState<Array<Message>>([]);
  const messageTextIsEmpty = messageText.trim().length === 0;
  const eventSourceRef = useRef(null);
  const ollamaResponseRef = useRef("");

  const handleFormSubmission = (event: any) => {
    event.preventDefault();
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: messageText,
        sender: "me",
        isStreaming: false,
        isError: false,
        isComplete: true,
      },
    ]);
    sendMessage(messageText);
    setMessageText("");
    ollamaResponseRef.current = "";
  };

  useEffect(() => {
    if (streamId) {
      const eventSource = new EventSource(
        `http://10.152.70.67:4999/chat/stream/${streamId}`
      );
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("SSE message received:", data); // Log all incoming SSE data

          // Explicitly check for the completion signal from the backend (empty object)
          if (Object.keys(data).length === 0) {
            console.log("Received completion signal from server (empty data).");
            // The onclose handler should handle the final state update and cleanup
            return; // Stop processing in onmessage for the completion signal
          }

          if (data.chunk) {
            ollamaResponseRef.current += data.chunk;
            setMessages((prevMessages) => {
              // Find the index of the message currently being streamed using the isStreaming flag
              const streamingOllamaIndex = prevMessages.findIndex(
                (msg) => msg.sender === "ollama" && msg.isStreaming
              );

              if (streamingOllamaIndex !== -1) {
                // Update the text of the streaming message
                const newMessages = [...prevMessages];
                newMessages[streamingOllamaIndex] = {
                  ...newMessages[streamingOllamaIndex],
                  text: ollamaResponseRef.current,
                };
                return newMessages;
              } else {
                // This case should ideally not happen if the placeholder is added correctly in handleSubmit,
                // but as a fallback, add a new message if somehow missed.
                console.warn(
                  "onmessage setMessages: Streaming message placeholder not found during chunk update. Adding a new message."
                );
                return [
                  ...prevMessages,
                  {
                    text: ollamaResponseRef.current,
                    sender: "ollama",
                    isStreaming: true,
                    isError: false,
                    isComplete: false,
                  },
                ]; // Ensure all flags are set
              }
            });
          } else if (data.error) {
            // Handle stream-specific errors by updating the streaming message to an error state
            console.error("Stream reported an error:", data.error);
            setMessages((prevMessages) => {
              const streamingOllamaIndex = prevMessages.findIndex(
                (msg) => msg.sender === "ollama" && msg.isStreaming
              );
              if (streamingOllamaIndex !== -1) {
                const newMessages = [...prevMessages];
                newMessages[streamingOllamaIndex] = {
                  ...newMessages[streamingOllamaIndex],
                  text: `Error in stream: ${data.error}`,
                  sender: "ollama",
                  isError: true,
                  isStreaming: false,
                  isComplete: false,
                };
                return newMessages;
              }
              // Fallback
              console.error(
                "onmessage error setMessages: Error message received but no streaming message found to update."
              );
              return [
                ...prevMessages,
                {
                  text: `Error in stream: ${data.error}`,
                  sender: "ollama",
                  isError: true,
                  isStreaming: false,
                  isComplete: false,
                },
              ];
            });
            eventSource.close();
            setStreamId(null);
          }
        } catch (error) {
          console.error("Error parsing SSE event:", error, event.data);
          setMessages((prevMessages) => {
            const streamingOllamaIndex = prevMessages.findIndex(
              (msg) => msg.sender === "ollama" && msg.isStreaming
            );
            if (streamingOllamaIndex !== -1) {
              const newMessages = [...prevMessages];
              newMessages[streamingOllamaIndex] = {
                ...newMessages[streamingOllamaIndex],
                text: "Error processing response from server.",
                sender: "ollama",
                isError: true,
                isStreaming: false,
                isComplete: false,
              };
              return newMessages;
            }
            console.error(
              "onmessage parse error setMessages: Parsing error but no streaming message found to update."
            );
            return [
              ...prevMessages,
              {
                text: "Error processing response from server.",
                sender: "ollama",
                isError: true,
                isStreaming: false,
                isComplete: false,
              },
            ];
          });
          eventSource.close();
          setStreamId(null);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE error event triggered:", error);
        console.log("Attempting to handle SSE error.");
        // This handler is for connection-level errors.
        // Update the streaming message to a connection error state, BUT check if it was already completed.
        setMessages((prevMessages) => {
          const streamingOllamaIndex = prevMessages.findIndex(
            (msg) => msg.sender === "ollama" && msg.isStreaming
          );
          let newMessages = [...prevMessages];

          if (streamingOllamaIndex !== -1) {
            // Found the message that was streaming
            // Check if this message has already been marked as complete by onclose
            if (newMessages[streamingOllamaIndex].isComplete) {
              console.log(
                "onerror: Stream already marked as complete by onclose, ignoring error for this message."
              );
              // If already complete, do nothing to this message's error state
              return prevMessages; // Return previous state as no change needed for this message
            } else {
              // If not complete, mark it as an error
              console.log(
                "onerror: Stream not complete, marking message as error."
              );
              newMessages[streamingOllamaIndex] = {
                ...newMessages[streamingOllamaIndex],
                text:
                  newMessages[streamingOllamaIndex].text ||
                  "Connection error with the server.", // Keep existing text if any, otherwise set default error
                isError: true,
                isStreaming: false, // No longer streaming
                isComplete: false, // Ensure isComplete is false in case of error
              };
              console.log(
                "onerror setMessages: updated newMessages (error)",
                newMessages
              );
              return newMessages;
            }
          } else {
            // If no streaming message is found with isStreaming: true, this might be a general connection error not tied to a specific active stream.
            console.warn(
              "onerror setMessages: No actively streaming message found to update. Adding a new error message."
            );
            // Add a new error message at the bottom, but avoid duplicates for clarity
            if (
              !prevMessages.some(
                (msg) =>
                  msg.text === "Connection error with the server." &&
                  msg.isError &&
                  !msg.isStreaming &&
                  !msg.isComplete
              )
            ) {
              newMessages = [
                ...prevMessages,
                {
                  text: "Connection error with the server.",
                  sender: "ollama",
                  isError: true,
                  isStreaming: false,
                  isComplete: false,
                },
              ];
              console.log(
                "onerror setMessages: added new error message",
                newMessages
              );
              return newMessages;
            }
            console.log(
              "onerror setMessages: Returning previous state (potential duplicate error message)"
            );
            return prevMessages; // Return current state if duplicate error message already exists
          }
        });
        eventSource.close();
        setStreamId(null);
      };

      eventSource.onclose = () => {
        console.log("SSE connection closed successfully.");
        console.log("Attempting to handle SSE close.");
        // When the stream finishes successfully, mark the message as complete and set isStreaming to false
        setMessages((prevMessages) => {
          const streamingOllamaIndex = prevMessages.findIndex(
            (msg) => msg.sender === "ollama" && msg.isStreaming
          );
          const newMessages = [...prevMessages];
          if (streamingOllamaIndex !== -1) {
            newMessages[streamingOllamaIndex] = {
              ...newMessages[streamingOllamaIndex],
              isStreaming: false,
              isComplete: true, // Mark as complete
            };
            console.log(
              "onclose setMessages: Marked streaming message as complete.",
              newMessages[streamingOllamaIndex]
            );
          } else {
            console.warn(
              "onclose setMessages: SSE close event fired, but no actively streaming message found to mark as complete."
            );
          }
          return newMessages;
        });
        setStreamId(null);
      };

      return () => {
        console.log("Cleaning up EventSource.");
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null; // Clear the ref on cleanup
        }
      };
    } else {
      // Cleanup if streamId becomes null while an event source is active
      if (eventSourceRef.current) {
        console.log("streamId became null, cleaning up active EventSource.");
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    }
  }, [streamId, setMessages]); // Added setMessages to dependency array
  const displayUserMessage = (data: string) => {
    const text = marked(data);
    return (
      <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1 self-end">
        <p className="leading-relaxed">
          <span className="block font-bold text-gray-700">You </span>
          <div dangerouslySetInnerHTML={{ __html: text }} />
        </p>
        <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
          <div className="rounded-full bg-gray-100 border p-1">
            <svg
              stroke="none"
              fill="black"
              strokeWidth="0"
              viewBox="0 0 16 16"
              height="20"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"></path>
            </svg>
          </div>
        </span>
      </div>
    );
  };

  const displayAIMessage = (data: string) => {
    const text = marked(data);
    return (
      <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
        <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
          <div className="rounded-full bg-gray-100 border p-1">
            <svg
              stroke="none"
              fill="black"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
              height="20"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
              ></path>
            </svg>
          </div>
        </span>
        <p className="leading-relaxed">
          <span className="block font-bold text-gray-700">LeetCoach</span>
          <div dangerouslySetInnerHTML={{ __html: text }} />
        </p>
      </div>
    );
  };
  useEffect(() => {
    messageEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [receivedMessages]);

  const messages = receivedMessages.map((message: Message) => {
    const author = message.sender;
    return author == "me"
      ? displayUserMessage(message.text)
      : displayAIMessage(message.text);
  });
  if (!active) {
    return <div></div>;
  }
  return (
    <div className={className}>
      <div className="flex flex-col space-y-1.5 pb-6">
        <h2 className="font-semibold text-lg tracking-tight text-black">
          LeetCoach
        </h2>
        <p className="text-sm text-[#6b7280] leading-3">
          Powered by ThinkLink Gemma-2-2B-IT
        </p>
      </div>
      <div className="chatBody pr-4 h-[474px] min-w-1/1 flex flex-col overflow-auto break-words">
        {messages}
        <div
          ref={(element) => {
            messageEnd.current = element;
          }}
        ></div>
      </div>
      <form onSubmit={handleFormSubmission}>
        <div className="flex items-center pt-0">
          <input
            ref={inputBox}
            className="mr-2 flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
            placeholder="Type your message"
            value={messageText}
            name="message"
            onChange={(event) => {
              setMessageText(event.target.value);
            }}
          />
          <button
            type="submit"
            className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
