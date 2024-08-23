import { Info, Event, Type } from "./model";
import { createRangeByLettersOffset, getLetters, randomChoice } from "./utils";

export const ALL_EVENT_CLASSES: Type<Event>[] = [
  class extends Event {
    iconEmoji = "🔥";
    messageText = "아파트에 화재가 발생했습니다!\n이름이 다 타기 전에 불씨🔥를 꺼뜨리세요!";
    _init(name: HTMLDivElement, info: Info) {
      this.tickPeriod = 2000;
      const letters = getLetters(name);
      if (letters.includes("🔥")) return;

      const i = randomChoice(Array.from({ length: letters.length }).map((_, i) => i));
      const range = createRangeByLettersOffset(name, i, i + 1);
      range.deleteContents();
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
  class extends Event {
    iconEmoji = "🌊";
    messageText = "지구 온난화로 인해 기록적인 홍수🌊가 발생했습니다! 빨리 물을 퍼 날라 이름을 지키세요!";
    step: number;
    _init(name: HTMLDivElement, info: Info) {
      this.tickPeriod = 500;
      this.step = 0;
      const letters = getLetters(name);
      if (letters.includes("🌊")) return;

      const range = createRangeByLettersOffset(name, 0, 0);
      range.insertNode(document.createTextNode("🌊"));
    }
    _tick(name: HTMLDivElement) {
      this.step += 1;
      if (this.step <= 10) {
        const range = createRangeByLettersOffset(name, 0, 0);
        range.insertNode(document.createTextNode("🌊"));
      }

      const swap = (i: number, j: number) => {
        if (i > j) return swap(j, i);
        const rightRange = createRangeByLettersOffset(name, j, j + 1);
        const letter = rightRange.toString();
        rightRange.deleteContents();
        createRangeByLettersOffset(name, i, i).insertNode(document.createTextNode(letter));
      };

      let letters = getLetters(name);
      let waveStack = 0;
      for (let i = 0; i < letters.length; ++i) {
        const curr = letters[i];
        if (curr !== "🌊") {
          waveStack = 0;
          continue;
        }
        waveStack += 1;

        const prev = letters[i - 1];
        const hasPrev = prev && prev !== "🌊";

        const next = letters[i + 1];
        const hasNext = next && next !== "🌊";

        if (hasPrev && hasNext && Math.random() <= 0.5) {
          swap(i - 1, i + 1);
        } else if (hasPrev && Math.random() <= 0.25) {
          swap(i - 1, i);
        } else if (hasNext && Math.random() <= 0.5 + 0.05 * waveStack) {
          swap(i, i + 1);
        } else if (!next && Math.random() <= 0.5) {
          createRangeByLettersOffset(name, i, i + 1).deleteContents();
        }
      }
    }
    _shouldActivate(name: HTMLDivElement) {
      return false;
    }
    _shouldDeactivate(name: HTMLDivElement) {
      return !name.innerHTML.includes("🌊");
    }
  },
];
