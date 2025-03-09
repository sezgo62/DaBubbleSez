export class User {
firstLastName: string;
email: string;
online: boolean = false;
image: string;
id: string;
conversations: Array<string> = [];
allMessages: Array<any> = [];

constructor(obj?: any ) {
this.firstLastName = obj ? obj.firstLastName : '';
this.email = obj ? obj.email : '';
this.online = obj ? obj.online : false;
this.image = obj ? obj.image : '';
this.id = obj ? obj.id : '';
this.conversations = obj ? obj.conversations : [];
}

updateData(data: Partial<User>) {
    Object.assign(this, data);
}

toJson() {
    return {
        firstLastName: this.firstLastName,
        email: this.email,
        online: this.online,
        image: this.image,
        id: this.id,
        conversations: this.conversations
    }
}
}




