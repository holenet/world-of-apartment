import { useEffect, useRef } from "preact/hooks";
import { RequirementMessage } from "../model";
import { marked } from "marked";

type Props = {
  message: RequirementMessage;
};
export function MarkdownTextContent({ message }: Props) {
  const containerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    containerRef.current.innerHTML = marked.parse(message.text, { async: false });
  }, [message.text]);

  return (
    <div class="text-left float-left text-sm text-neutral-700" ref={containerRef}>
      {message.text}
    </div>
  );
}
