import { useEffect, useRef } from "preact/hooks";
import { Signal, useComputed, useSignal, useSignalEffect } from "@preact/signals";
import { Message } from "./model";
import { MessageEntry } from "./MessageEntry";

type Props = {
  messages: Signal<Message[]>;
};
export default function MessageContainer({ messages }: Props) {
  const containerRef = useRef<HTMLDivElement>();
  const reorderedMessages = useComputed(() =>
    [...messages.value].map((m, i) => ({ ...m, originalIndex: i })).sort((a, b) => a.id - b.id)
  );
  const offsets = useSignal<number[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const observer = new ResizeObserver(() => recalculateOffsets(messages.value));
      observer.observe(container);
      return () => observer.unobserve(container);
    }
  }, []);

  useSignalEffect(() => {
    const _messages = messages.value;
    setTimeout(() => {
      recalculateOffsets(_messages);
    }, 1);
  });

  const messagesLength = useComputed(() => messages.value.length);
  const offsetsLength = useComputed(() => offsets.value.length);
  useSignalEffect(() => {
    const container = containerRef.current;
    if (container && messagesLength.value >= offsetsLength.value) {
      // new message created
      setTimeout(() => container.scrollBy({ top: container.scrollHeight + 128, behavior: "smooth" }), 100);
    }
  });

  const recalculateOffsets = (_messages: Message[]) => {
    const container = containerRef.current;
    if (container) {
      const heights = _messages.map((_) => 0);
      for (let c of container.children) {
        const d = c as HTMLDivElement;
        const requirementIndex = parseInt(d.dataset.requirementIndex);
        const messageIndex = _messages.findIndex((m) => m.id === requirementIndex);
        heights[messageIndex] = d.getBoundingClientRect().height;
      }
      const gap = 4;
      let y = 0;
      const _offsets = [0];
      for (let i = 0; i < _messages.length; ++i) {
        y += heights[i] + gap;
        _offsets.push(y);
      }
      if (offsets.value.length !== _offsets.length || offsets.value.some((o, i) => o !== _offsets[i])) {
        offsets.value = _offsets;
      }
    }
  };

  return (
    <div
      class="flex flex-col items-start gap-4 h-full shadow-md rounded-xl p-2 pb-24 bg-white overflow-y-scroll overflow-x-hidden relative min-w-[512px]"
      ref={containerRef}
    >
      {reorderedMessages.value.map((message) => (
        <div
          class="absolute transition-all duration-500"
          style={{
            transform: `translateY(${offsets.value[message.originalIndex]}px)`,
          }}
          key={message.id}
          data-requirement-index={message.id}
        >
          <MessageEntry message={message} />
        </div>
      ))}
    </div>
  );
}
