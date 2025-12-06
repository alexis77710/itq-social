export class Message {
    constructor(
        public _id: string,
        public text: string,
        public viewed: string,
        public created_at: any,
        public emitter: any,
        public receiver: any
    ){}
}