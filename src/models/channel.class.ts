import { Timestamp } from "@angular/fire/firestore";

export class Channel {
    dateOfCreation: Timestamp;  // oder string, wenn du es als ISO-String speichern möchtest
    id: string;
    nameOfChannel: string;
    permittedUsers: Array<string> = [];
    description: string;
    authorOfChannel: string;
    //posts: Post[] = [];

    
    
    constructor(obj?: any ) {
    this.dateOfCreation = obj ? obj.dateOfCreation : '';
    this.id = obj ? obj.id : '';
    this.nameOfChannel = obj ? obj.nameOfChannel : '';
    this.permittedUsers = obj ? obj.permittedUsers : [];
    this.description = obj ? obj.description : '';
    this.authorOfChannel = obj ? obj.authorOfChannel : '';

    //this.posts = obj ? obj.posts : '';
    }
    
    updateData(data: Partial<Channel>) {
        Object.assign(this, data);
    }
    
    toJson() {
        return {
            dateOfCreation: this.dateOfCreation,
            id: this.id,
            nameOfChannel: this.nameOfChannel,
            permittedUsers: this.permittedUsers,
            description: this.description,
            authorOfChannel: this.authorOfChannel

            //posts: this.posts,
        }
    }
    }