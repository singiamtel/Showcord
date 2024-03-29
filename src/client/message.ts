import { Optional } from '../utils/generic';

export type MessageType =
  | 'chat'
  | 'rawHTML'
  | 'boxedHTML'
  | 'log'
  | 'announce'
  | 'simple'
  | 'error'
  | 'roleplay'
  | 'uhtmlchange'
  | 'challenge';

export type Message = {
    content: string;
    type: MessageType;
    user?: string;
    timestamp?: Date;
    notify: boolean;
    /** true if message is highlighted, false if not, null if not parsed yet */
    hld: boolean | null
    name?: string; // only defined for uhtml messages
};

export default function ({
    content,
    type,
    user,
    timestamp,
    hld,
    notify,
    name,
}: Omit<Optional<Message, 'hld' | 'notify'>, 'timestamp'> & {
    timestamp?: string;
}): Message {
    if (type === 'uhtmlchange') {
        throw new Error('Received invalid message type uhtmlchange');
    }
    return {
        content,
        type,
        user,
        timestamp: timestamp ? new Date(Number(timestamp) * 1000) : undefined,
        hld: hld ?? null,
        name,
        notify: notify ?? false,
    };
}
