export interface Response {
    message: string;
    state: State;
    data: any;
}

export enum State {
    ERROR = "ERROR", SUCCESS = "SUCCESS"
}
