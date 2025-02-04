import { FieldValue, Timestamp } from "@angular/fire/firestore";

export class Message {
    textOfMessage: string;
    authorOfMessage: string;
    timeMessagePosted: Timestamp | Date | FieldValue; // Erlaube sowohl Date als auch Timestamp
    id: string = '';
    authorName: string = '';

    constructor(obj?: any) {
        this.textOfMessage = obj ? obj.textOfMessage : '';
        this.authorOfMessage = obj ? obj.idOfUser : '';
        this.timeMessagePosted = obj ? obj.timeMessagePosted : '';
        this.id = obj ? obj.id : '';
        this.authorName = obj ? obj.id : '';
    }

    updateData(data: Partial<Message>) {
        Object.assign(this, data);
    }

    toJson() {
        return {
            textOfMessage: this.textOfMessage,
            idOfUser: this.authorOfMessage,
            timeMessagePosted: this.timeMessagePosted,
            id: this.id,
            authorName: this.authorName
            //posts: this.posts,
        }
    }
}