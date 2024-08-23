export const hasBadchimOnLast = (word: string) => {
  const uni = word.charCodeAt(word.length - 1);
  if (isNaN(uni)) return false;
  if (uni < 44032 || uni > 55203) return false;
  return (uni - 44032) % 28 != 0;
};

export function randomChoice<T>(array: T[]): T {
  return array[~~(Math.random() * array.length)];
}

export const createRangeByLettersOffset = (rootNode: Node, start: number, end: number) => {
  const getOffset = (node: Node, offset: number) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const letters = getLetters(node);
      return { node, offset: letters.slice(0, offset).join("").length };
    }
    for (let child of node.childNodes) {
      const letters = getLetters(child);
      if (offset <= letters.length) {
        return getOffset(child, offset);
      }
      offset -= letters.length;
    }
    return null;
  };
  const startOffset = getOffset(rootNode, start);
  const endOffset = getOffset(rootNode, end);
  if (!startOffset || !endOffset) return null;

  const range = document.createRange();
  range.setStart(startOffset.node, startOffset.offset);
  range.setEnd(endOffset.node, endOffset.offset);
  return range;
};

export const getLetters = (node: Node) => {
  return [...node.textContent];
};

export const deconstructHangulLetter = (hangulLetter: string) => {
  const f = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];
  const s = [
    "ㅏ",
    "ㅐ",
    "ㅑ",
    "ㅒ",
    "ㅓ",
    "ㅔ",
    "ㅕ",
    "ㅖ",
    "ㅗ",
    "ㅘ",
    "ㅙ",
    "ㅚ",
    "ㅛ",
    "ㅜ",
    "ㅝ",
    "ㅞ",
    "ㅟ",
    "ㅠ",
    "ㅡ",
    "ㅢ",
    "ㅣ",
  ];
  const t = [
    "",
    "ㄱ",
    "ㄲ",
    "ㄳ",
    "ㄴ",
    "ㄵ",
    "ㄶ",
    "ㄷ",
    "ㄹ",
    "ㄺ",
    "ㄻ",
    "ㄼ",
    "ㄽ",
    "ㄾ",
    "ㄿ",
    "ㅀ",
    "ㅁ",
    "ㅂ",
    "ㅄ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];

  const uni = hangulLetter.charCodeAt(0) - 44032;

  const fn = ~~(uni / 588);
  const sn = ~~((uni - fn * 588) / 28);
  const tn = uni % 28;

  return [f[fn], s[sn], t[tn]];
};
