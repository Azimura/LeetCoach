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
  // const messageTextIsEmpty = messageText.trim().length === 0;
  // var eventSourceRef: EventSource | null = null;
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
    // Only add the initial message if the messages array is empty
    setMessages((prevMessages) => {
      if (prevMessages.length === 0) {
        return [
          {
            text: "How can I assist you? For example, you can ask me:\n" +
                "\n" +
                "• Help me to break down the solution into smaller steps\n" +
                "\n" +
                "• Tell me what data structures I should use\n" +
                "\n" +
                "• Give me a suggestion to make my code efficient based on the constraints",
            sender: 'LeetCoach',
            isStreaming: false,
            isError: false,
            isComplete: true,
          },
        ];
      }
      return prevMessages; // If messages already exist, don't modify
    });
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    if (streamId > 0) {
      let isStreaming = true;

      const fetchStream = async () => {
        try {
          const response = await fetch(
              `https://internal-squid-sensibly.ngrok-free.app/chat/stream/${streamId}`,
              {
                method: 'GET',
                headers: {
                  'ngrok-skip-browser-warning': 'any-value',
                  'User-Agent': 'CustomClient/1.0',
                },
              }
          );

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          // @ts-ignore
          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          while (isStreaming) {
            const { done, value } = await reader.read();
            if (done) {
              console.log('Stream completed');
              setMessages((prevMessages) => {
                const streamingIndex = prevMessages.findIndex(
                    (msg) => msg.sender === 'LeetCoach' && msg.isStreaming
                );
                if (streamingIndex !== -1) {
                  const newMessages = [...prevMessages];
                  newMessages[streamingIndex] = {
                    ...newMessages[streamingIndex],
                    isStreaming: false,
                    isComplete: true,
                  };
                  return newMessages;
                }
                return prevMessages;
              });
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                try {
                  const parsedData = JSON.parse(data);
                  console.log('SSE message received:', parsedData);

                  // Handle completion signal
                  if (Object.keys(parsedData).length === 0) {
                    console.log('Received completion signal from server (empty data).');
                    setMessages((prevMessages) => {
                      const streamingIndex = prevMessages.findIndex(
                          (msg) => msg.sender === 'LeetCoach' && msg.isStreaming
                      );
                      if (streamingIndex !== -1) {
                        const newMessages = [...prevMessages];
                        newMessages[streamingIndex] = {
                          ...newMessages[streamingIndex],
                          isStreaming: false,
                          isComplete: true,
                        };
                        return newMessages;
                      }
                      return prevMessages;
                    });
                    return;
                  }

                  // Handle incoming chunk
                  if (parsedData.chunk) {
                    ollamaResponseRef.current += parsedData.chunk;
                    setMessages((prevMessages) => {
                      const streamingIndex = prevMessages.findIndex(
                          (msg) => msg.sender === 'LeetCoach' && msg.isStreaming
                      );

                      if (streamingIndex !== -1) {
                        const newMessages = [...prevMessages];
                        newMessages[streamingIndex] = {
                          ...newMessages[streamingIndex],
                          text: ollamaResponseRef.current,
                        };
                        return newMessages;
                      } else {
                        console.log('Adding new streaming message');
                        return [
                          ...prevMessages,
                          {
                            text: ollamaResponseRef.current,
                            sender: 'LeetCoach',
                            isStreaming: true,
                            isError: false,
                            isComplete: false,
                          },
                        ];
                      }
                    });
                  } else if (parsedData.error) {
                    console.error('Stream reported an error:', parsedData.error);
                    setMessages((prevMessages) => {
                      const streamingIndex = prevMessages.findIndex(
                          (msg) => msg.sender === 'LeetCoach' && msg.isStreaming
                      );
                      if (streamingIndex !== -1) {
                        const newMessages = [...prevMessages];
                        newMessages[streamingIndex] = {
                          ...newMessages[streamingIndex],
                          text: `Error: ${parsedData.error}`,
                          isError: true,
                          isStreaming: false,
                          isComplete: false,
                        };
                        return newMessages;
                      }
                      return [
                        ...prevMessages,
                        {
                          text: `Error: ${parsedData.error}`,
                          sender: 'LeetCoach',
                          isError: true,
                          isStreaming: false,
                          isComplete: false,
                        },
                      ];
                    });
                    return;
                  }
                } catch (error) {
                  console.error('Error parsing SSE event:', error, data);
                  setMessages((prevMessages) => {
                    const streamingIndex = prevMessages.findIndex(
                        (msg) => msg.sender === 'LeetCoach' && msg.isStreaming
                    );
                    if (streamingIndex !== -1) {
                      const newMessages = [...prevMessages];
                      newMessages[streamingIndex] = {
                        ...newMessages[streamingIndex],
                        text: 'Error processing response from server.',
                        isError: true,
                        isStreaming: false,
                        isComplete: false,
                      };
                      return newMessages;
                    }
                    return [
                      ...prevMessages,
                      {
                        text: 'Error processing response from server.',
                        sender: 'LeetCoach',
                        isError: true,
                        isStreaming: false,
                        isComplete: false,
                      },
                    ];
                  });
                  return;
                }
              }
            }
          }
        } catch (error) {
          console.error('Fetch SSE error:', error);
          setMessages((prevMessages) => {
            const streamingIndex = prevMessages.findIndex(
                (msg) => msg.sender === 'LeetCoach' && msg.isStreaming
            );
            if (streamingIndex !== -1) {
              const newMessages = [...prevMessages];
              newMessages[streamingIndex] = {
                ...newMessages[streamingIndex],
                text: 'Connection error with the server.',
                isError: true,
                isStreaming: false,
                isComplete: false,
              };
              return newMessages;
            }
            return [
              ...prevMessages,
              {
                text: 'Connection error with the server.',
                sender: 'LeetCoach',
                isError: true,
                isStreaming: false,
                isComplete: false,
              },
            ];
          });
        } finally {
          setStreamId(null);
        }
      };

      fetchStream();

      return () => {
        console.log('Cleaning up fetch stream.');
        isStreaming = false;
      };
    } else {
      console.log('streamId became null, no cleanup needed.');
    }
  }, [streamId, setMessages]);

  const displayUserMessage = (data: string) => {
    const text = marked(data);
    return (
      <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1 self-end"
           style={{
             maxWidth: '66.67%', // Limits user message to 2/3 of the container width
             wordBreak: 'break-word', // Ensures long words wrap
           }}>
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
      <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1" style={{
        maxWidth: '90%', // Limits  message to 80% of the container width
        wordBreak: 'break-word', // Ensures long words wrap
      }}>
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
