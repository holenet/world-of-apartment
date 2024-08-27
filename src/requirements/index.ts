import SubwayStationNames from "@/assets/SubwayStationNames.csv?raw";
import JoseonKings from "@/assets/JoseonKings.csv?raw";
import LATIN from "@/assets/LATIN.csv?raw";
import EnglishWord from "@/assets/EnglishWord.csv?raw";
import CatEmoji from "@/assets/CatEmoji.csv?raw";
import { Info, Requirement, Type } from "../model";
import { loadCSV, randomChoice } from "../utils";
import { KeyboardOmitRequirement } from "./KeyboardOmit";

export const ALL_REQUIREMENT_CLASSES: { [key: string]: Type<Requirement> } = {
  REMOVE_JUGONG: class extends Requirement {
    _checkSatisfied(name: HTMLDivElement) {
      return !name.innerText.includes("주공");
    }
  },
  ENGLISH: class extends Requirement {
    englishWord: string;
    _init(info: Info) {
      this.englishWord = randomChoice(loadCSV(EnglishWord))["EnglishWord"];
      this._formatMessageText(this.englishWord);
    }
    _checkSatisfied(name: HTMLDivElement) {
      return name.innerText.toLowerCase().includes(this.englishWord.toLowerCase());
    }
  },
  ROMAN_DIGIT: class extends Requirement {
    complexNumber: number;
    romanNumber: string;
    _init(info: Info) {
      this.complexNumber = info.COMPLEX_NUMBER;
      this.romanNumber = this.convertToRoman(this.complexNumber);
      this._formatMessageText(this.complexNumber);
      this.hint = this.romanNumber;
    }
    _checkSatisfied(name: HTMLDivElement) {
      return name.innerText.includes(this.romanNumber);
    }
    private convertToRoman(n: number) {
      const ROMANS = [
        ["I", "V"],
        ["X", "L"],
        ["C", "D"],
        ["M", ""],
      ];
      let r = "";
      const s = (~~n).toString().split("").reverse().join("");
      for (let i = 0; i < s.length; ++i) {
        const [one, five] = ROMANS[i];
        const ten = ROMANS[i + 1]?.[0] ?? "";
        let c = parseInt(s[i]);
        let d = "";
        if (c === 9) {
          d += one + ten;
          c -= 9;
        } else if (c >= 5) {
          d += five;
          c -= 5;
        } else if (c === 4) {
          d += one + five;
          c -= 4;
        }
        d += one.repeat(c);
        r = d + r;
      }
      return r;
    }
  },
  NAME_LENGTH: class extends Requirement {
    minLength: number;
    _init(info: Info) {
      this.minLength = 12 + ~~(Math.random() * 19);
      this._formatMessageText(this.minLength);
    }
    _checkSatisfied(name: HTMLDivElement) {
      return name.innerText.length >= this.minLength;
    }
  },
  TERRAIN: class extends Requirement {
    terrainName: string;
    _init(info: Info) {
      const TERRAIN_NAMES = [
        "호수",
        "숲",
        "산",
        "계단",
        "강",
        "바다",
        "사막",
        "계곡",
        "폭포",
        "초원",
        "협곡",
        "늪",
        "절벽",
        "곶",
        "사구",
        "산호초",
        "삼각주",
        "동굴",
        "오아시스",
        "간헐천",
        "화산",
      ];
      this.terrainName = randomChoice(TERRAIN_NAMES);
      this._formatMessageText(this.terrainName);
    }
    _checkSatisfied(name: HTMLDivElement) {
      return name.innerText.includes(this.terrainName);
    }
  },
  SUBWAY_STATION: class extends Requirement {
    subwayStationName: string;
    _init(info: Info) {
      this.subwayStationName = randomChoice(loadCSV(SubwayStationNames).map((n) => n.Name));
      this._formatMessageText(this.subwayStationName);
    }
    _checkSatisfied(name: HTMLDivElement) {
      return name.innerText.includes(this.subwayStationName);
    }
  },
  KEYBOARD_OMIT: KeyboardOmitRequirement,
  MORSE_CODE: class extends Requirement {
    morseCode: string;
    _init(info: Info) {
      const MORSE_CODES = [
        ["LOVEYOU", ".-..---...-.-.-----..-"],
        ["SOS", "...---..."],
      ];
      const [p, m] = randomChoice(MORSE_CODES);
      this.morseCode = m;
      this._formatMessageText(p);
      this.hint = m;
    }
    _checkSatisfied(name: HTMLDivElement) {
      return name.innerText.replace(/\s/g, "").includes(this.morseCode);
    }
  },
  JOSEON_KING: class extends Requirement {
    year: number;
    templeName: string;
    _init(info: Info) {
      const joseonKings: { 재위시작: number; 재위끝: number; 묘호: string }[] = loadCSV(JoseonKings);
      const king = randomChoice(joseonKings.filter((k) => k.재위시작 + 2 <= k.재위끝));
      this.year = ~~(Math.random() * (king.재위끝 - king.재위시작 - 2)) + king.재위시작 + 1;
      this.templeName = king.묘호;
      this._formatMessageText(this.year);
      this.hint = this.templeName;
    }
    _checkSatisfied(name: HTMLDivElement) {
      return name.innerText.includes(this.templeName);
    }
  },
  LATIN: class extends Requirement {
    latinWord: string;
    _init(info: Info) {
      const latin: { 한글: string; 라틴어: string; 발음: string } = randomChoice(loadCSV(LATIN));
      this.latinWord = latin.라틴어;
      this._formatMessageText(latin.한글, latin.라틴어, latin.발음);
    }
    _checkSatisfied(name: HTMLDivElement) {
      return name.innerText.toLowerCase().includes(this.latinWord.toLowerCase());
    }
  },
  SPECIAL_CHARACTER: class extends Requirement {
    specialCharacters: string[];
    _init(info: Info) {
      this.specialCharacters = [..."~`!@#$%^&*()-_=+\\|]}[{'\";:/?.>,<"];
    }
    _checkSatisfied(name: HTMLDivElement) {
      return this.specialCharacters.some((c) => name.innerText.includes(c));
    }
  },
  CAT_EMOJI: class extends Requirement {
    catEmojiList: string[];
    _init(info: Info) {
      this.catEmojiList = loadCSV(CatEmoji).map((m) => m["CAT_EMOJI"]);
    }
    _checkSatisfied(name: HTMLDivElement) {
      return this.catEmojiList.some((c) => name.innerText.includes(c));
    }
  },
};

export class NotImplementedRequirement extends Requirement {
  _init(info: Info) {
    this.messageText = `정의되지 않은 요구사항 입니다. (Code: ${this._metadata.Code})\n자동으로 조건이 만족됩니다.\n~~${this._metadata.Message}~~`;
    setTimeout(this._onConditionUpdated, 1000);
  }
  _checkSatisfied(name: HTMLDivElement) {
    return true;
  }
}
