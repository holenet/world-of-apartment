import SubwayStationNames from "@/assets/SubwayStationNames.json?raw";
import { Info, Requirement, Type } from "../model";
import { randomChoice } from "../utils";
import { KeyboardOmitRequirement } from "./KeyboardOmit";

export const ALL_REQUIREMENT_CLASSES: { [key: string]: Type<Requirement> } = {
  REMOVE_JUGONG: class extends Requirement {
    _checkSatisfied(name: HTMLDivElement) {
      return !name.innerText.includes("주공");
    }
  },
  ENGLISH: class extends Requirement {
    _checkSatisfied(name: HTMLDivElement) {
      return /[a-zA-Z]/.test(name.innerText);
    }
  },
  ROMAN_DIGIT: class extends Requirement {
    complexNumber: number;
    romanNumber: string;
    _init(info: Info) {
      this.complexNumber = info.COMPLEX_NUMBER;
      this.romanNumber = this.convertToRoman(this.complexNumber);
      this._formatMessageText(this.complexNumber, this.romanNumber);
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
      const SUBWAY_STATION_NAMES = JSON.parse(SubwayStationNames);
      this.subwayStationName = randomChoice(SUBWAY_STATION_NAMES);
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
      this._formatMessageText(p, m);
    }
    _checkSatisfied(name: HTMLDivElement) {
      return name.innerText.replace(/\s/g, "").includes(this.morseCode);
    }
  },
};
