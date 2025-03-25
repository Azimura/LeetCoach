"use client";
import ReactGridLayout from "react-grid-layout";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CodeEditor from "@/app/component/codeEditor";
import "./problem.module.css";
import Chatbox from "@/app/component/chatBox";
import ProblemText from "@/app/component/problemText";
import ResultModal from "@/app/component/resultModal";

interface ProblemResponse {
  code_template: string;
  content: string;
  difficulty: string;
  problem_id: number;
  tags: Array<string>;
  title: string;
}

const GetProblem = async (
  setProblem: Dispatch<SetStateAction<ProblemResponse>>
) => {
  //TODO: retrieve problem details via API
  setProblem({
    code_template: "def removeDuplicates(nums):",

    content:
      "Given an integer array `nums` sorted in **non-decreasing order**, remove the duplicates [**in-place**](https://en.wikipedia.org/wiki/In-place_algorithm) such that each unique element appears only **once**. The **relative order** of the elements should be kept the **same**. Then return _the number of unique elements in_ `nums`.\\n\\nConsider the number of unique elements of `nums` be `k`, to get accepted, you need to do the following things:\\n\\n*   Change the array `nums` such that the first `k` elements of `nums` contain the unique elements in the order they were present in `nums` initially. The remaining elements of `nums` are not important as well as the size of `nums`.\\n*   Return `k`.\\n\\n**Custom Judge:**\\n\\nThe judge will test your solution with the following code:\\n\\nint\\[\\] nums = \\[...\\]; // Input array\\nint\\[\\] expectedNums = \\[...\\]; // The expected answer with correct length\\n\\nint k = removeDuplicates(nums); // Calls your implementation\\n\\nassert k == expectedNums.length;\\nfor (int i = 0; i < k; i++) {\\n    assert nums\\[i\\] == expectedNums\\[i\\];\\n}\\n\\nIf all assertions pass, then your solution will be **accepted**.\\n\\n**Example 1:**\\n\\n**Input:** nums = \\[1,1,2\\]\\n**Output:** 2, nums = \\[1,2,\\_\\]\\n**Explanation:** Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.\\nIt does not matter what you leave beyond the returned k (hence they are underscores).\\n\\n**Example 2:**\\n\\n**Input:** nums = \\[0,0,1,1,1,2,2,3,3,4\\]\\n**Output:** 5, nums = \\[0,1,2,3,4,\\_,\\_,\\_,\\_,\\_\\]\\n**Explanation:** Your function should return k = 5, with the first five elements of nums being 0, 1, 2, 3, and 4 respectively.\\nIt does not matter what you leave beyond the returned k (hence they are underscores).\\n\\n**Constraints:**\\n\\n*   `1 <= nums.length <= 3 * `10^4``\\n*   `-100 <= nums[i] <= 100`\\n*   `nums` is sorted in **non-decreasing** order.",

    difficulty: "Easy",

    problem_id: 26,

    tags: ["Two Pointers"],

    title: "Remove Duplicates from Sorted Array",
  });
};

const TestCodeServer = (
  code: string,
  setResult: Dispatch<SetStateAction<{}>>
) => {
  //TODO: Call API to test code
};

const SubmitCodeServer = (
  code: string,
  setResult: Dispatch<SetStateAction<Object>>
) => {
  // TODO: Call API to submit code
};

const StartProgress = () => {
  // TODO: Call API to start progress
};

export default function Problem({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [displayChatbox, setDisplayChatbox] = useState(false);
  const [displayResult, setDisplayResult] = useState(true);
  const [result, setResult] = useState<any>({
    error_message: {
      error: "Expected 2, but got 1",
      input: "nums = [1, 1, 2]",
      result: 0,
    },
    pass: 0,
    submission_id: 38,
    test_cases: 2,
  });
  const [problem, setProblem] = useState<ProblemResponse>({
    content: "",
    code_template: "",
    difficulty: "",
    problem_id: -1,
    tags: [],
    title: "",
  });
  const TestCode = (code: string) => {
    TestCodeServer(code, setResult);
  };

  const SubmitCode = (code: string) => {
    SubmitCodeServer(code, setResult);
  };
  useEffect(() => {
    GetProblem(setProblem);

    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            initialCode={problem.code_template}
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
