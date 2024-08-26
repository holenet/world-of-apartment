import { signal } from "@preact/signals";
import { JSX } from "preact";
import { MutableRef } from "preact/hooks";
import { MarkdownTextContent } from "./requirements/MarkdownTextContent";
import { formatText } from "./utils";

export interface Type<T> extends Function {
  new (...args: any[]): T;
}

export type RequirementMetadata = {
  Code: string;
  ProfileImage: string;
  ProfileName: string;
  Message: string;
};

export type Info = {
  COMPLEX_NUMBER: number;
  JUGONG_NAME: string;
  getRequirementMetadata: (code: string) => RequirementMetadata | undefined;
};

export abstract class Requirement {
  messageText: string;
  isSatisfied = signal(false);
  hint: string;
  contentComponent: (props: { message: RequirementMessage }) => JSX.Element = MarkdownTextContent;
  protected _onConditionUpdated: () => void;
  protected _metadata: RequirementMetadata;
  private _timer: NodeJS.Timeout;

  constructor(info: Info, requirementMetadata: RequirementMetadata, onConditionUpdated: () => void) {
    this.messageText = requirementMetadata.Message;
    this._metadata = requirementMetadata;
    this._onConditionUpdated = onConditionUpdated;
    this._init(info);
  }

  protected _init(info: Info) {}

  protected _checkSatisfied(name: HTMLDivElement) {
    return false;
  }

  protected _formatMessageText(...args: any[]) {
    this.messageText = formatText(this._metadata.Message, ...args);
  }

  updateSatisfied(name: HTMLDivElement) {
    const isSatisfied = this._checkSatisfied(name);
    this.isSatisfied.value = isSatisfied;
    return isSatisfied;
  }

  setTimer(func: () => void, timeout: number) {
    if (this._timer) {
      clearTimeout(this._timer);
    }
    this._timer = setTimeout(func, timeout);
  }
}

export abstract class Event {
  iconEmoji: string;
  messageText: string;
  isActivated = signal(false);
  protected tickPeriod = 1000;

  private _nameRef: MutableRef<HTMLDivElement>;
  private _info: Info;
  private _onConditionUpdated: () => void;
  private intervalTimer: NodeJS.Timeout;

  constructor(nameRef: MutableRef<HTMLDivElement>, info: Info, onConditionUpdated: () => void) {
    this._nameRef = nameRef;
    this._info = info;
    this._onConditionUpdated = onConditionUpdated;
  }

  protected _init(name: HTMLDivElement, info: Info) {}

  protected _tick(name: HTMLDivElement) {}

  protected _shouldActivate(name: HTMLDivElement) {
    return false;
  }
  protected _shouldDeactivate(name: HTMLDivElement) {
    return !this._shouldActivate(name);
  }

  private _activate() {
    if (this.isActivated.value) return;
    this.isActivated.value = true;

    const name = this._nameRef.current;
    if (name) {
      const lastNameString = name.textContent;
      this._init(name, this._info);
      if (lastNameString !== name.textContent) this._onConditionUpdated();
    }
    this.intervalTimer = setInterval(() => {
      const name = this._nameRef.current;
      if (name && this.isActivated.value) {
        const lastNameString = name.textContent;
        this._tick(name);
        if (lastNameString !== name.textContent) this._onConditionUpdated();
      }
    }, this.tickPeriod);
  }

  private _deactivate() {
    if (!this.isActivated.value) return;
    this.isActivated.value = false;
    clearInterval(this.intervalTimer);
  }

  updateActivation() {
    const name = this._nameRef.current;
    if (!name) return false;

    if (!this.isActivated.value) {
      if (this._shouldActivate(name)) {
        this._activate();
        return true;
      }
    } else {
      if (this._shouldDeactivate(name)) this._deactivate();
    }
    return false;
  }

  forceActivate() {
    this._activate();
  }
}

export interface Message {
  id: number;
  text: string;
}

export interface RequirementMessage extends Message {
  requirement: Requirement;
}

export interface EventMessage extends Message {
  event: Event;
}
