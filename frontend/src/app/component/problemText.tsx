interface ProblemTextProps {
  content: string;
  title: string;
  difficulty: string;
  tags: Array<string>;
  problemID: number;
}

export default function ProblemText({
  content,
  title,
  difficulty,
  tags,
  problemID,
}: ProblemTextProps) {
  return (
    <div className="py-5 px-4 flex gap-4 flex-col overflow-y-auto ">
      <div className="title">
        <h1 className="text-[24px] font-semibold leading-[32px]">
          {problemID}. {title}
        </h1>
      </div>
      <div className="difficulty text-[12px] leading-[16px] py-1 px-2 bg-[#0000000f] rounded-full text-teal-400 w-fit">
        {difficulty}
      </div>
    </div>
  );
}
