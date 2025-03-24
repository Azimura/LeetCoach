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
  const ParseContent = (text: string) => {
    text = "<p>" + text + "</p>";
    console.log(
      text
        .trim()
        .replace(/\s+/g, " ") // Remove extra whitespaces
        .replace(/\\n+/g, "</p><p>") // Handle line breaks
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Handle bold
        .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2'>$1</a>")
        .replace(/\\(\*\*|\[|\]|\\|n)/g, "$1") // Handle links
        .replace(/\* (.*?)/g, "&#8226;&#9;")
    );
    return text
      .trim()
      .replace(/\s+/g, " ") // Remove extra whitespaces
      .replace(/\\n+/g, "</p><p>") // Handle line breaks
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Handle bold
      .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2'>$1</a>")
      .replace(/\\(\*\*|\[|\]|\\|n)/g, "$1") // Handle links
      .replace(/\* (.*?)/g, "&#8226;&#9;"); // Handle bullet points
  };
  return (
    <div className="py-5 px-4 flex gap-4 flex-col overflow-y-scroll h-full">
      <div className="title">
        <h1 className="text-[24px] font-semibold leading-[32px] text-black">
          {problemID}. {title}
        </h1>
      </div>
      <div className="difficulty text-[12px] leading-[16px] py-1 px-2 bg-[#0000000f] rounded-full text-teal-400 w-fit">
        {difficulty}
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: ParseContent(content) }}
        className="text-black gap-[1rem] text-[14px] flex flex-col"
      ></div>
    </div>
  );
}
