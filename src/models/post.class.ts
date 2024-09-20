import { FieldValue, serverTimestamp, Timestamp } from "@angular/fire/firestore";
import { Answer } from "./answers.class";


export class Post {
    answers: Array<any> = [];
    emojiOfPost: [];
    authorOfPost: string = '';
    id: string = '';
    textOfPost: string = '';
    dateOfPost: Timestamp | Date | FieldValue; // Erlaube sowohl Date als auch Timestamp
    authorName: any;
    emojiInformations: any;

    constructor(obj?: any) {
        this.answers = obj ? obj.answers : [];
        this.emojiOfPost = obj ? obj.emojiOfPost : [];
        this.authorOfPost = obj ? obj.authorOfPost : '';
        this.id = obj ? obj.id : '';
        this.textOfPost = obj ? obj.textOfPost : '';
        this.dateOfPost = obj ? obj.dateOfPost : new Date();
    }

    // Die toJson Methode, um das Post-Objekt in ein JSON-Format zu konvertieren
    toJson() {
        return {
            answers: this.answers,
            emojiOfPost: this.emojiOfPost,
            authorOfPost: this.authorOfPost,
            id: this.id,
            textOfPost: this.textOfPost,
            dateOfPost: this.dateOfPost instanceof Date ? Timestamp.fromDate(this.dateOfPost) : serverTimestamp(),
        };
    }
}