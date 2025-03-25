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
    return text
      .trim()
      .replace(/\s+/g, " ") // Remove extra whitespaces
      .replace(/\\n+/g, "</p><p>") // Handle line breaks; Creates extra <p></p> tags will handle later
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Handle bold
      .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2'>$1</a>") // Handle links
      .replace(/\\(\*\*|\[|\]|\\|_)/g, "$1") // Handle escapes
      .replace(/\* (.*?)/g, "&#8226;&#9;") // *... => bullet point
      .replace(/<p>\s*<\/p>/g, "") // Remove empty <p></p> tags
      .replace(/`(\d+)\^(\d+)`/g, "$1<sup>$2</sup>") // Handle exponents
      .replace(
        /`(.*?)`/g,
        "<span class='bg-[#000a2008] border-[#0000000d] rounded-[5px] border-[1px] text-[#262626bf] font-[.75rem] p-[.125rem]'>$1</span>"
      ); // `...` => <span>...<span>
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
