import { useEffect, useState } from "preact/hooks";
import classnames from "classnames";
import { Message, RequirementMessage, EventMessage } from "../model";

type RequirementMessageProps = {
  message: RequirementMessage;
};
export function RequirementMessageEntry({ message }: RequirementMessageProps) {
  const [showUp, setShowUp] = useState(false);
  useEffect(() => {
    setTimeout(() => setShowUp(true), 100);
  }, []);

  const ContentComponent = message.requirement.contentComponent;

  return (
    <div
      className={classnames("flex flex-row gap-2 pb-3 items-start transition-all duration-500", {
        "opacity-0": !showUp,
        "translate-x-[30%]": !showUp,
        "translate-x-0": showUp,
      })}
    >
      <div class="w-12 h-12 bg-neutral-300 shadow-sm rounded-full text-white flex justify-center items-center text-4xl pb-1.5 font-bold select-none shrink-0">
        ?
      </div>
      <div
        className={classnames("shadow-sm mt-2 mr-4 px-3 py-1.5 rounded-lg transition-all", {
          "bg-green-100": message.requirement.isSatisfied.value,
          "bg-red-100": !message.requirement.isSatisfied.value,
        })}
      >
        <ContentComponent message={message} />
      </div>
    </div>
  );
}

type EventMessageProps = {
  message: EventMessage;
};
export function EventMessageEntry({ message }: EventMessageProps) {
  const [showUp, setShowUp] = useState(false);
  useEffect(() => {
    setTimeout(() => setShowUp(true), 100);
  }, []);

  return (
    <div
      className={classnames("flex flex-row gap-3 pb-3 items-start transition-all duration-500", {
        "opacity-40": !message.event.isActivated.value,
        "opacity-0": !showUp,
        "translate-x-[30%]": !showUp,
        "translate-x-0": showUp,
      })}
    >
      <div class="w-12 h-12 bg-neutral-300 shadow-sm rounded-full text-white flex justify-center items-center text-3xl pb-1.5 font-bold select-none shrink-0">
        {message.event.iconEmoji}
      </div>
      <div
        className={classnames("shadow-sm outline mt-2 mr-4 px-3 py-1.5 rounded-lg transition-all", {
          "bg-neutral-100 outline-neutral-400": !message.event.isActivated.value,
          "outline-4 outline-red-400": message.event.isActivated.value,
        })}
      >
        <span class="text-left float-left text-sm text-neutral-700 whitespace-pre-wrap">{message.text}</span>
      </div>
    </div>
  );
}

type Props = {
  message: Message;
};
export function MessageEntry({ message }: Props) {
  if ("requirement" in message) return <RequirementMessageEntry message={message as RequirementMessage} />;
  if ("event" in message) return <EventMessageEntry message={message as EventMessage} />;
  return null;
}
