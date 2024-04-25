export class User {
firstLastName: string;
email: string;
online: boolean = false;
image: string;
id: string;

constructor(obj?: any ) {
this.firstLastName = obj ? obj.firstLastName : '';
this.email = obj ? obj.email : '';
this.online = obj ? obj.online : false;
this.image = obj ? obj.image : '';
this.id = obj ? obj.id : '';
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
    }
}
}




