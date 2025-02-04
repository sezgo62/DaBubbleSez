import { FieldValue, Timestamp } from "@angular/fire/firestore";

export class MessageLobby {
    id: string = '';



    constructor(obj?: any) {
        this.id = obj ? obj.id : '';

    }

    updateData(data: Partial<MessageLobby>) {
        Object.assign(this, data);
    }

    toJson() {
        return {
            id: this.id

            //posts: this.posts,
        }
    }
}