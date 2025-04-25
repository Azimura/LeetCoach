"use client";
import ReactGridLayout from "react-grid-layout";
import { useEffect, useState } from "react";
import CodeEditor from "@/app/component/codeEditor";
import "./problem.module.css";
import Chatbox from "@/app/component/chatBox";
import ProblemText from "@/app/component/problemText";
import ResultModal from "@/app/component/resultModal";
import { getCookie } from "cookies-next/client";
import {
  Chat,
  GetProblem,
  MoveToNextProblem,
  Refine,
  SkipProblem,
  StartProgress,
  Submit,
  Test,
} from "../../component/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockFour } from "@fortawesome/free-regular-svg-icons";
import { Editor } from "@monaco-editor/react";
import ErrorModal from "@/app/component/errorModal";
import LoadingModal from "@/app/component/loadingModal";
import { get } from "http";

interface ProblemResponse {
  code_template: string;
  content: string;
  difficulty: string;
  problem_id: number;
  tags: Array<string>;
  title: string;
}

export default function Problem({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  "use client";
  console.log(Number(getCookie("userID")));
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [displayChatbox, setDisplayChatbox] = useState(false);
  const [displayResult, setDisplayResult] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displayRefinedCode, setDisplayRefinedCode] = useState(false);
  const [displayLoading, setDisplayLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState({});
  const [refinedCode, setRefinedCode] = useState("");
  const [streamId, setStreamId] = useState(-1);
  const [completed, setCompleted] = useState(false);
  const [problem, setProblem] = useState<ProblemResponse>({
    content: "",
    code_template: "",
    difficulty: "",
    problem_id: -1,
    tags: [],
    title: "",
  });
  const [time, setTime] = useState<number>(600);
  const [timeUp, setTimeUp] = useState<boolean>(false);
  const [code, setCode] = useState("");
  const TestCode = async (code: string) => {
    setResult({});
    setDisplayResult(true);
    const userID = Number(getCookie("userID"));
    const { id } = await params;
    const result = await Test(id, userID, code);
    setResult(result);
  };

  const SubmitCode = async (code: string) => {
    setResult({});
    setDisplayResult(true);
    const userID = Number(getCookie("userID"));
    const { id } = await params;
    const result = await Submit(id, userID, code);
    if (result.error_message.result) {
      setCompleted(true);
    }
    setResult(result);
  };

  const RefineCode = async (code: string) => {
    setLoadingMessage("Refining Code...");
    setDisplayLoading(true);
    const userID = Number(getCookie("userID"));
    const { id } = await params;
    const result = await Refine(userID, id, code);
    setLoadingMessage("");
    setDisplayLoading(false);
    if (result.result) {
      const refinedCode = stripCodeFence(result.message);
      setRefinedCode(refinedCode);
      setDisplayRefinedCode(true);
      console.log("ran");
    } else {
      setError(result.message);
      setDisplayError(true);
    }
  };

  const RetrieveProblem = async () => {
    const { id } = await params;
    const problem = await GetProblem(id);
    console.log(problem);
    setProblem(problem);
    setCode(problem.code_template);
  };

  const SendMessage = async (message: string) => {
    const data = await Chat(message);
    setStreamId(data.stream_id);
  };

  function stripCodeFence(str: string) {
    let lines = str.trim().split("\n");

    if (lines[0].startsWith("```python")) {
      lines.shift();
    }

    if (lines[lines.length - 1].trim() === "```") {
      lines.pop();
    }

    return lines.join("\n");
  }
  useEffect(() => {
    RetrieveProblem();
    BeginProgress();

    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          setTimeUp(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    window.addEventListener("resize", handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const BeginProgress = async () => {
    const userID = Number(getCookie("userID"));
    const { id } = await params;
    const response = await StartProgress(id, userID);
    console.log(response);
  };

  const Skip = async () => {
    const { id } = await params;
    console.log("skipping");
    SkipProblem(id);
  };

  const FormatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${minutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    if (!displayResult) {
      setResult({});
    }
  }, [displayResult]);
  const layout = [
    { i: "Problem Details", x: 0, y: 0, w: 1, h: 2, static: true },
    { i: "Code Editor", x: 1, y: 0, w: 1, h: 2, static: true },
  ];
  return (
    <div className="bg-gray-200 overflow-hidden w-full h-screen flex flex-col">
      <ResultModal
        visible={displayResult}
        onClose={() => {
          setDisplayResult(false);
          if (completed) {
            MoveToNextProblem();
          }
        }}
        result={result}
      />
      <ErrorModal
        visible={displayError}
        errorMessage={error}
        onClose={() => {
          setDisplayError(false);
        }}
      />
      <LoadingModal
        visible={displayLoading}
        loadingMessage={loadingMessage}
        onClose={() => {
          setDisplayLoading(false);
        }}
        closeable={false}
      />
      <div className="tooltip-container absolute bottom-[2rem] right-[3rem] z-10">
        {Number(getCookie("userID")) % 2 != 0 && (
          <button
            aria-describedby="help-tooltip"
            className="help-button bg-[#4346f0] text-white border-none p-[12px 24px] text-white border-none rounded-[8px] py-[12px] px-[24px] cursor-pointer text-[16px] font-semibold shadow-[0 6px 12px rgba(0, 0, 0, 0.15)] hover:transform-[translateY(-2px)] hover:shadow-[0 6px 12px rgba(0, 0, 0, 0.15)]"
            onClick={() => {
              setDisplayChatbox(!displayChatbox);
            }}
          >
            Ask LeetCoach!
          </button>
        )}
      </div>
      <Chatbox
        active={displayChatbox}
        className="absolute z-10 bottom-[10px] right-[100px]"
        streamId={streamId}
        sendMessage={SendMessage}
        setStreamId={setStreamId}
      />
      <div className="h-10 flex items-center justify-center p-2">
        <div className="flex items-center gap-2 mt-5">
          {timeUp ? (
            <button
              onClick={() => {
                Skip();
              }}
              className="cursor-pointer self-end py-1.5 font-medium items-center whitespace-nowrap focus:outline-none inline-flex bg-fill-3 bg-[#2db55d] hover:bg-[#269a4f] h-[32px] select-none px-5 text-[12px] leading-[1.25rem] text-white text-sm rounded-lg ml-2"
            >
              Skip Problem
            </button>
          ) : (
            <>
              <FontAwesomeIcon icon={faClockFour} className="text-gray-600" />
              <p className="text-gray-600">{FormatTime(time)}</p>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-row h-full gap-5 p-5">
        <div
          className="bg-white p-0 m-0 flex-1 w-500 overflow-auto"
          key={"Problem Details"}
        >
          <ProblemText
            content={problem.content}
            title={problem.title}
            difficulty={problem.difficulty}
            tags={problem.tags}
            problemID={problem.problem_id}
          />
        </div>
        <div
          className="bg-white p-0 m-0 flex flex-row flex-1"
          key={"Code Editor"}
        >
          <div className="h-full w-full flex flex-col justify-between">
            <div className="flex justify-between px-5 py-5 shadow-lg">
              <h1 className="font-bold text-2xl text-black"> Code Editor </h1>
              <div>
                <button
                  onClick={() => {
                    TestCode(code);
                  }}
                  className="text-black cursor-pointer self-end py-1.5 font-medium items-center whitespace-nowrap focus:outline-none inline-flex bg-fill-3 bg-[#000a200d] hover:bg-[#000a201a] h-[32px] select-none px-5 text-[12px] leading-[1.25rem] text-sm rounded-lg ml-2"
                >
                  Run
                </button>
                <button
                  onClick={() => {
                    RefineCode(code);
                  }}
                  className="text-black cursor-pointer self-end py-1.5 font-medium items-center whitespace-nowrap focus:outline-none inline-flex bg-fill-3 bg-[#000a200d] hover:bg-[#000a201a] h-[32px] select-none px-5 text-[12px] leading-[1.25rem] text-sm rounded-lg ml-2"
                >
                  Refine
                </button>
                <button
                  onClick={() => {
                    SubmitCode(code);
                  }}
                  className="cursor-pointer self-end py-1.5 font-medium items-center whitespace-nowrap focus:outline-none inline-flex bg-fill-3 bg-[#2db55d] hover:bg-[#269a4f] h-[32px] select-none px-5 text-[12px] leading-[1.25rem] text-white text-sm rounded-lg ml-2"
                >
                  Submit
                </button>
              </div>
            </div>
            <div className="h-full flex flex-row overflow-hidden">
              {displayRefinedCode ? (
                <>
                  <div className="w-full border-r-1 p-2">
                    <h2 className="font-bold text-xl text-black">
                      Original Code:
                    </h2>
                    <Editor
                      height={"100%"}
                      language="python"
                      value={code}
                      options={{
                        fontSize: 14,
                        minimap: {
                          enabled: false,
                        },

                        autoClosingBrackets: "languageDefined",
                        lineNumbers: "on",
                      }}
                      onChange={(value) => {
                        if (value) {
                          setCode(value);
                        }
                      }}
                      className="pt-5"
                    />
                  </div>
                  <div className="w-full border-l-1 p-2">
                    <div className="flex flex-row justify-between">
                      <h2 className="font-bold text-xl text-black">
                        Refined Code:
                      </h2>
                      <button
                        onClick={() => {
                          setDisplayRefinedCode(false);
                          setRefinedCode("");
                        }}
                        className="cursor-pointer py-1.5 font-medium items-center whitespace-nowrap focus:outline-none inline-flex bg-fill-3 bg-red-500 hover:bg-red-600 h-[32px] select-none px-5 text-[12px] leading-[1.25rem] text-white text-sm rounded-lg ml-2 z-5"
                      >
                        Hide Refined Code
                      </button>
                    </div>
                    <Editor
                      key={displayRefinedCode ? "displayed" : "hidden"}
                      height={"100%"}
                      language="python"
                      value={refinedCode}
                      options={{
                        fontSize: 14,
                        minimap: {
                          enabled: false,
                        },

                        autoClosingBrackets: "languageDefined",
                        lineNumbers: "on",
                        readOnly: true,
                      }}
                      className="pt-5"
                    />
                  </div>
                </>
              ) : (
                <CodeEditor
                  initialCode={code}
                  setCode={setCode}
                  key={displayRefinedCode ? "half" : "full"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .help-button {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
        `}
      </style>
    </div>
  );
}
