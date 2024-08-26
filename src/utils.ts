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

export const formatText = (format: string, ...args: string[]) => {
  let formatted = format;
  const badchimVariationReplacer = (baseWord: string) => (match, p1, p2, offset, string) =>
    hasBadchimOnLast(baseWord) ? p1 : p2;
  for (let i = 0; i < args.length; ++i) {
    const base = new RegExp("\\{" + i + "\\}", "g");
    formatted = formatted.replace(base, args[i]);
    const badchimVariation = new RegExp("\\{" + i + ":(.*)/(.*)\\}", "g");
    formatted = formatted.replace(badchimVariation, badchimVariationReplacer(args[i]));
  }
  return formatted;
};

export const loadCSV = (rawText: string) => {
  const parseCSV =
    /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
  const CSV2Array = (text: string) => {
    const values = [];
    text.replace(parseCSV, (m0, m1, m2, m3) => {
      if (m1 !== undefined) values.push(m1.replace(/\\'/g, "'"));
      else if (m2 !== undefined) values.push(m2.replace(/\\"/g, '"'));
      else if (m3 !== undefined) values.push(m3);
      return "";
    });
    if (/,\s*$/.test(text)) values.push("");
    return values;
  };
  const lines = rawText.trim().split("\n");
  const header = CSV2Array(lines[0].trim());
  const result = [];
  for (let line of lines.slice(1)) {
    const values = CSV2Array(line.trim());
    const dict = {};
    for (let i = 0; i < header.length; ++i) {
      const value = values[i].replace("\\n", "\n");
      dict[header[i]] = value === "" || isNaN(+value) ? value : +value;
    }
    result.push(dict);
  }
  return result;
};
