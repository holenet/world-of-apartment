import subwayStations from "@/assets/subwayStations.json?raw";
import { Info, Requirement, Type } from "../model";
import { hasBadchimOnLast, randomChoice } from "../utils";
import { KeyboardOmitRequirement } from "./KeyboardOmit";

export const ALL_REQUIREMENT_CLASSES: Type<Requirement>[] = [
  class extends Requirement {
    messageText = "아이참… 주공이라는 이름 붙어있음 집값 내려가는 거 몰라요? 주공부터 빼죠";
    _checkSatisfied(name: HTMLDivElement) {
      return !name.innerText.includes("주공");
    }
  },
  class extends Requirement {
    messageText = "글로벌 시대니까 영어로 일단 지어보죠?";
    _checkSatisfied(name: HTMLDivElement) {
      return /[a-zA-Z]/.test(name.innerText);
    }
  },
  class extends Requirement {
    complexNumber: number;
    romanNumber: string;
    _init(info: Info) {
      this.complexNumber = info.COMPLEX_NUMBER;
      this.romanNumber = this.convertToRoman(this.complexNumber);
      this.messageText = `근데 ${this.complexNumber}단지니까 ${this.complexNumber}를 로마 숫자로 넣으면 어떨까요? (답:${this.romanNumber})`;
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
  class extends Requirement {
    minLength: number;
    _init(info: Info) {
      this.minLength = 12 + ~~(Math.random() * 19);
      this.messageText = `제가 유명한 무당분이랑 이야기 하고 왔는데요, 글자수가 ${this.minLength}글자는 넘어야 한다네요?`;
    }
    _checkSatisfied(name: HTMLDivElement) {
      return name.innerText.length >= this.minLength;
    }
  },
  class extends Requirement {
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
      this.messageText = `저희 아파트 주변에 ‘${this.terrainName}’${
        hasBadchimOnLast(this.terrainName) ? "이" : "가"
      } 있잖아요, 이것도 이름에 넣죠?`;
    }
    _checkSatisfied(name: HTMLDivElement) {
      return name.innerText.includes(this.terrainName);
    }
  },
  class extends Requirement {
    subwayStationName: string;
    _init(info: Info) {
      const SUBWAY_STATION_NAMES = JSON.parse(subwayStations);
      this.subwayStationName = randomChoice(SUBWAY_STATION_NAMES);
      this.messageText = `우리 아파트 주변에 ${this.subwayStationName}역이 있잖아요, 그러니까 당연히 ${
        this.subwayStationName
      }${hasBadchimOnLast(this.subwayStationName) ? "이라는" : "라는"} 이름은 들어가야지요`;
    }
    _checkSatisfied(name: HTMLDivElement) {
      return name.innerText.includes(this.subwayStationName);
    }
  },
  KeyboardOmitRequirement,
  class extends Requirement {
    morseCode: string;
    _init(info: Info) {
      const MORSE_CODES = [
        ["LOVEYOU", ".-..---...-.-.-----..-"],
        ["SOS", "...---..."],
      ];
      const [p, m] = randomChoice(MORSE_CODES);
      this.morseCode = m;
      this.messageText = `제가 모스부호 장인인데요. ‘${p}’를 모스부호로 넣도록 하죠 (답:${m})`;
    }
    _checkSatisfied(name: HTMLDivElement) {
      return name.innerText.replace(/\s/g, "").includes(this.morseCode);
    }
  },
];
