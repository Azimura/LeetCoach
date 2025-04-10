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
  GetProblem,
  StartProgress,
  SubmitCodeServer,
  TestCodeServer,
} from "./api";

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
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [displayChatbox, setDisplayChatbox] = useState(false);
  const [displayResult, setDisplayResult] = useState(false);
  const [result, setResult] = useState<any>({});
  const [problem, setProblem] = useState<ProblemResponse>({
    content: "",
    code_template: "",
    difficulty: "",
    problem_id: -1,
    tags: [],
    title: "",
  });
  const TestCode = async (code: string) => {
    setResult({});
    setDisplayResult(true);
    const userID = Number(getCookie("userID"));
    const { id } = await params;
    const result = await TestCodeServer(id, userID, code);
    setResult(result);
  };

  const SubmitCode = async (code: string) => {
    setResult({});
    setDisplayResult(true);
    const userID = Number(getCookie("userID"));
    const { id } = await params;
    const result = await SubmitCodeServer(id, userID, code);
    setResult(result);
  };

  const RetrieveProblem = async () => {
    const { id } = await params;
    const problem = await GetProblem(id);
    setProblem(problem);
  };
  useEffect(() => {
    RetrieveProblem();
    BeginProgress();

    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const BeginProgress = async () => {
    const userID = Number(getCookie("userID"));
    const { id } = await params;
    const response = await StartProgress(id, userID);
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
    <main className="bg-gray-200 overflow-hidden">
      <ResultModal
        visible={displayResult}
        onClose={() => {
          setDisplayResult(false);
        }}
        result={result}
      />
      <div className="tooltip-container absolute bottom-[2rem] right-[3rem] z-10">
        <button
          aria-describedby="help-tooltip"
          className="help-button bg-[#4346f0] text-white border-none p-[12px 24px] text-white border-none rounded-[8px] py-[12px] px-[24px] cursor-pointer text-[16px] font-semibold shadow-[0 6px 12px rgba(0, 0, 0, 0.15)] hover:transform-[translateY(-2px)] hover:shadow-[0 6px 12px rgba(0, 0, 0, 0.15)]"
          onClick={() => {
            setDisplayChatbox(!displayChatbox);
          }}
        >
          Ask LeetCoach!
        </button>
      </div>
      <Chatbox
        active={displayChatbox}
        className="absolute z-10 bottom-[10px] right-[100px]"
      />
      <ReactGridLayout
        className="layout overflow-hidden"
        layout={layout}
        cols={2}
        width={windowSize.width}
        rowHeight={windowSize.height / 2 - 15}
        preventCollision
        allowOverlap={false}
      >
        <div className="bg-white p-0 m-0" key={"Problem Details"}>
          <ProblemText
            content={problem.content}
            title={problem.title}
            difficulty={problem.difficulty}
            tags={problem.tags}
            problemID={problem.problem_id}
          />
        </div>
        <div className="bg-white p-0 m-0" key={"Code Editor"}>
          <CodeEditor
            initialCode={
              "def removeDuplicates(nums):\n    i = 0\n    for j in range(1, len(nums)):\n        if nums[j] != nums[i]:\n            i += 1\n            nums[i] = nums[j]\n    return i + 1"
            }
            TestCode={TestCode}
            SubmitCode={SubmitCode}
          />
        </div>
      </ReactGridLayout>
      <style jsx>
        {`
          .help-button {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
        `}
      </style>
    </main>
  );
}
