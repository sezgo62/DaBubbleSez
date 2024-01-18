export class User {
firstName: string;
lastName: string;
email: string;
online: boolean;
id: string;

constructor(obj?: any ) {
this.firstName = obj ? obj.firstName : '';
this.lastName = obj ? obj.lastName : '';
this.email = obj ? obj.email : '';
this.online = obj ? obj.online : '';
this.id = obj ? obj.id : '';

}


}