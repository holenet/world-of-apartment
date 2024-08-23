import { render } from "preact";

import "./style.css";
import { useEffect, useRef } from "preact/hooks";
import { batch, useSignal } from "@preact/signals";
import { Message, Requirement, Event, Info, RequirementMessage, EventMessage } from "./model";
import MessageContainer from "./MessageContainer";
import { ALL_REQUIREMENT_CLASSES } from "./requirements";
import { ALL_EVENT_CLASSES } from "./events";
import { randomChoice } from "./utils";

const requirements: Requirement[] = [];
const events: Event[] = [];
const info: Info = { COMPLEX_NUMBER: 0 };

const initInfo = () => {
  info.COMPLEX_NUMBER = ~~(1 + Math.random() * 3999);
};
initInfo();

function App() {
  const nameRef = useRef<HTMLDivElement>();
  const messages = useSignal<Message[]>([]);

  useEffect(() => {
    const name = nameRef.current;
    if (name) {
      name.innerHTML = `<span>주공아파트${info.COMPLEX_NUMBER}단지</span>`;
      setTimeout(addNextRequirement, 100);
    }

    populateEvents();
  }, []);

  const populateEvents = () => {
    for (let EventClass of ALL_EVENT_CLASSES) {
      const event = new EventClass(nameRef, info, onConditionUpdated);
      events.push(event);
    }
  };

  const checkRequirements = () => {
    const name = nameRef.current;
    if (name) {
      batch(() => {
        for (let requirement of requirements) {
          const oldSatisfied = requirement.isSatisfied.value;
          const newSatisfied = requirement.updateSatisfied(name);
          if (oldSatisfied && !newSatisfied) {
            requirement.setTimer(() => {
              const index = messages.value.findIndex((m) => (m as RequirementMessage).requirement === requirement);
              if (index >= 0 && index !== messages.value.length - 1) {
                const message = messages.value.splice(index, 1)[0];
                const ANITIATINGS = [
                  "아니",
                  "그게 아니고…",
                  "잠깐만요 그것보다…",
                  "위에서도 말씀 드렸는데",
                  "다시 말씀 드리지만",
                  "제 이야기는 무시하시나요?",
                  "아까 말씀 드렸는데",
                ];
                messages.value = [
                  ...messages.value,
                  {
                    ...message,
                    text: randomChoice(ANITIATINGS) + " " + requirement.messageText,
                  },
                ];
              }
            }, 100 + Math.random() * 100);
          } else if (!oldSatisfied && newSatisfied) {
            requirement.setTimer(() => {
              const srcIndex = messages.value.findIndex((m) => (m as RequirementMessage).requirement === requirement);
              if (srcIndex >= 0) {
                const message = messages.value.splice(srcIndex, 1)[0];
                let dstIndex = -1;
                for (let i = 0; i < srcIndex; i++) {
                  const m = messages.value[i] as RequirementMessage;
                  if (m.requirement?.isSatisfied.value === false) {
                    dstIndex = i;
                    break;
                  }
                }
                messages.value.splice(dstIndex >= 0 && dstIndex !== srcIndex ? dstIndex : srcIndex, 0, message);
                messages.value = [...messages.value];
              }
            }, 100 + Math.random() * 100);
          }
        }
        if (requirements.every((r) => r.isSatisfied.peek())) {
          addNextRequirement();
        }
      });
    }
  };

  const updateEvents = () => {
    for (let event of events) {
      const hasActivated = event.updateActivation();
      if (hasActivated) {
        onEventActivated(event);
      }
    }
  };

  const addNextRequirement = () => {
    const nextIndex = requirements.length;
    if (nextIndex >= ALL_REQUIREMENT_CLASSES.length) {
      // TODO
      // setTimeout(() => alert("축: 아파트 이름 짓기 성공!"), 500);
      return;
    }
    const RequirementClass = ALL_REQUIREMENT_CLASSES[nextIndex];
    const requirement = new RequirementClass(info, onConditionUpdated);
    requirements.push(requirement);
    messages.value = [
      ...messages.value,
      {
        id: messages.value.length,
        requirement,
        text: requirement.messageText,
        isActive: true,
      } as Message,
    ];

    if (messages.value.length % 5 === 0) {
      setTimeout(() => activateRandomEvent(), 2000);
    }
  };

  const activateRandomEvent = () => {
    if (events.every((e) => e.isActivated.value)) return;
    const event = randomChoice(events);
    event.forceActivate();
    onEventActivated(event);
  };

  const onEventActivated = (event: Event) => {
    const index = messages.value.findIndex((m) => (m as EventMessage).event === event);
    if (index === -1) {
      messages.value = [
        ...messages.value,
        {
          id: messages.value.length,
          event,
          text: event.messageText,
          isActive: true,
        } as Message,
      ];
    } else if (index !== messages.value.length - 1) {
      const message = messages.value.splice(index, 1)[0];
      messages.value = [...messages.value, message];
    }
  };

  const onConditionUpdated = () => {
    if (requirements.length > 0) checkRequirements();
    updateEvents();
  };

  const onInput = (_: InputEvent) => {
    onConditionUpdated();
  };

  return (
    <div class="flex flex-col w-full h-full justify-center items-stretch">
      <div class="p-12 flex flex-col lg:flex-row gap-4 h-full">
        <div class="basis-1/3 shrink-0 grow h-full">
          <div
            contentEditable="true"
            class="border-2 min-w-[256px] h-full text-start px-2"
            ref={nameRef}
            onInput={onInput}
          ></div>
        </div>
        <div class="basis-2/3 grow h-full">
          <MessageContainer messages={messages} />
        </div>
      </div>
    </div>
  );
}

render(<App />, document.getElementById("app"));
