import classNames from "classnames";
import { Info, Requirement, RequirementMessage } from "../model";
import { Signal, signal } from "@preact/signals";
import { deconstructHangulLetter } from "../utils";

const ALPHABET_TO_HANGUL = {
  Q: "ㅂㅃ:ㄼㅄ",
  W: "ㅈㅉ:ㄵ",
  E: "ㄷㄸ:",
  R: "ㄱㄲ:ㄳㄺ",
  T: "ㅅㅆ:ㄳㄽㅄ",
  Y: "ㅛ:",
  U: "ㅕ:",
  I: "ㅑ:",
  O: "ㅐㅒ:ㅙ",
  P: "ㅔㅖ:ㅞ",
  A: "ㅁ:ㄻ",
  S: "ㄴ:ㄵㄶ",
  D: "ㅇ:",
  F: "ㄹ:ㄺㄻㄼㄽㄾㄿㅀ",
  G: "ㅎ:ㄶㅀ",
  H: "ㅗ:ㅘㅙㅚ",
  J: "ㅓ:ㅝ",
  K: "ㅏ:ㅘ",
  L: "ㅣ:ㅚㅟㅢ",
  Z: "ㅋ:",
  X: "ㅌ:ㄾ",
  C: "ㅊ:",
  V: "ㅍ:ㄿ",
  B: "ㅠ:",
  N: "ㅜ:ㅝㅞㅟ",
  M: "ㅡ:ㅢ",
};

export class KeyboardOmitRequirement extends Requirement {
  messageText = "제가요… 꿈을 꿨는데요… 키보드 중에 자판 1개를 무조건 빼야 한대요… 아니면 집값이 떨어진대요…";
  contentComponent = KeyboardOmitContent;
  selectedKey: Signal<string>;
  _init(info: Info) {
    this.selectedKey = signal("");
    this.selectedKey.subscribe((key) => {
      if (key) this._onConditionUpdated();
    });
  }
  _checkSatisfied(name: HTMLDivElement) {
    const key = this.selectedKey.value;
    if (name.innerText.includes(key) || name.innerText.includes(key.toLowerCase())) return false;
    const hanguls = ALPHABET_TO_HANGUL[key].replace(":", "");
    for (let letter of name.innerText) {
      if (/[ㄱ-ㅎ|ㅏ-ㅣ]/.test(letter)) {
        if (hanguls.includes(letter)) return false;
      } else if (/[가-힣]/.test(letter)) {
        const [a, b, c] = deconstructHangulLetter(letter);
        if (hanguls.includes(a)) return false;
        if (hanguls.includes(b)) return false;
        if (c && hanguls.includes(c)) return false;
      }
    }
    return true;
  }
}

type Props = {
  message: RequirementMessage;
};
function KeyboardOmitContent({ message }: Props) {
  const TOP = "QWERTYUIOP";
  const MIDDLE = "ASDFGHJKL";
  const BOTTOM = "ZXCVBNM ";
  const LINES = [TOP, MIDDLE, BOTTOM];

  const requirement = message.requirement as KeyboardOmitRequirement;
  const getFirstHangulOfKey = (key: string) => ALPHABET_TO_HANGUL[key]?.split(":")[0][0];
  const getSecondHangulOfKey = (key: string) => ALPHABET_TO_HANGUL[key]?.split(":")[0][1];

  return (
    <div class="flex flex-col gap-2">
      <span class="text-left float-left text-sm text-neutral-700">{message.text}</span>
      <div class="bg-neutral-400 bg-opacity-30 rounded-md shadow-sm mb-1 p-2">
        <div class="flex flex-col items-center gap-1">
          {LINES.map((line) => (
            <div class="flex gap-1">
              {line.split("").map((key) => (
                <button
                  disabled={key === " "}
                  className={classNames(
                    "rounded-sm shadow-sm w-8 h-10 flex flex-col items-center justify-between text-xs text-neutral-600 font-bold p-0.5 select-none",
                    {
                      "hover:bg-neutral-100": key !== " " && requirement.selectedKey.value !== key,
                      "hover:bg-neutral-200": key !== " " && requirement.selectedKey.value === key,
                      "bg-white": requirement.selectedKey.value !== key,
                      "bg-neutral-100": requirement.selectedKey.value === key,
                      "outline outline-neutral-600": requirement.selectedKey.value === key,
                    }
                  )}
                  onClick={() => (requirement.selectedKey.value = key)}
                >
                  <div class="self-start pl-0.5">{key}</div>
                  <div class="flex flex-row-reverse items-baseline gap-0.5 self-end flex-nowrap">
                    <span>{getFirstHangulOfKey(key)}</span>
                    <span>{getSecondHangulOfKey(key)}</span>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
