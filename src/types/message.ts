import { IdItem, Reference } from "pony-platypus-firestore-api";

export declare type MessageBase = {
  text: string;
  createdWhen: number;
  author: string;
  authorId: string;
};
export declare type MessageIndex = Reference & MessageBase;
export declare function getMessageIndex(
  id: string,
  idea: Message
): MessageIndex;

export declare type Message = IdItem & MessageBase;
