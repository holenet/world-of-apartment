import { Info, Event, Type } from "./model";
import { createRangeByLettersOffset, getLetters, randomChoice } from "./utils";

export const ALL_EVENT_CLASSES: Type<Event>[] = [
  class extends Event {
    iconEmoji = "🔥";
    messageText = "아파트에 화재가 발생했습니다!\n이름이 다 타기 전에 불씨🔥를 꺼뜨리세요!";
    _init(name: HTMLDivElement, info: Info) {
      this.tickPeriod = 2000;
      const letters = getLetters(name);
      const i = randomChoice(Array.from({ length: letters.length + 1 }).map((_, i) => i));
      const range = createRangeByLettersOffset(name, i, i);
      range.insertNode(document.createTextNode("🔥🔥"));
    }
    _tick(name: HTMLDivElement) {
      const deleteIndicesSet = new Set<number>();
      let letters = getLetters(name);
      for (let i = 0; i < letters.length; ++i) {
        const curr = letters[i];
        if (curr !== "🔥") continue;

        const prev = letters[i - 1];
        const hasPrevFuel = prev && prev !== "🔥";

        const next = letters[i + 1];
        const hasNextFuel = next && next !== "🔥";

        if (hasPrevFuel && Math.random() <= 0.5) {
          deleteIndicesSet.add(i - 1);
        }
        if (hasNextFuel && Math.random() <= 0.5) {
          deleteIndicesSet.add(i + 1);
        }

        const prob = hasNextFuel || hasPrevFuel ? 0 : 0.6;
        if (Math.random() <= prob) {
          deleteIndicesSet.add(i);
        }
      }

      const deleteIndices = Array.from(deleteIndicesSet)
        .sort((a, b) => a - b)
        .reverse();
      for (let index of deleteIndices) {
        const range = createRangeByLettersOffset(name, index, index + 1);
        range.deleteContents();
      }

      letters = getLetters(name);
      for (let i = 0; i < letters.length; ++i) {
        const curr = letters[i];
        if (curr !== "🔥") continue;

        const prev = letters[i - 1];
        const hasPrevFuel = prev && prev !== "🔥";

        const next = letters[i + 1];
        const hasNextFuel = next && next !== "🔥";

        const fuelCount = (hasPrevFuel ? 1 : 0) + (hasNextFuel ? 1 : 0);
        const prob = 0.4 * fuelCount;
        if (Math.random() <= prob) {
          const range = createRangeByLettersOffset(name, i, i);
          range.insertNode(document.createTextNode("🔥"));
        }
      }
    }
    _shouldActivate(name: HTMLDivElement) {
      return name.innerText.includes("🔥");
    }
  },
];
