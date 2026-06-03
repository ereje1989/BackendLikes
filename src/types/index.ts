export interface IBroadcast {
    type: string;
    payload: Payload | Payload[];
}

interface Payload {
    messageId: string | string[];
}
