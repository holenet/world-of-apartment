import { RequirementMessage } from "../model";

type Props = {
  message: RequirementMessage;
};
export function TextContent({ message }: Props) {
  return <span class="text-left float-left text-sm text-neutral-700">{message.text}</span>;
}
