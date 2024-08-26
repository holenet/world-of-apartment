import { useEffect, useRef } from "preact/hooks";
import { RequirementMessage } from "../model";
import { marked } from "marked";

const renderer = new marked.Renderer();
renderer.link = function ({ href, title, text }) {
  return '<a target="_blank" href="' + href + '" title="' + (title ?? text) + '">' + text + "</a>";
};

type Props = {
  message: RequirementMessage;
};
export function MarkdownTextContent({ message }: Props) {
  const containerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    containerRef.current.innerHTML = marked.parse(
      message.text + (message.requirement.hint ? ` (힌트: "${message.requirement.hint}")` : ""),
      {
        async: false,
        renderer,
      }
    );
  }, [message.text, message.requirement.hint]);

  return <div class="text-left float-left text-sm text-neutral-700" ref={containerRef}></div>;
}
