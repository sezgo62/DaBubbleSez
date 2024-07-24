import { Timestamp } from "@angular/fire/firestore";
import { Answer } from "./answers.class";


export class Post {
    answers: Array<Answer> = [];
    emojiOfPost: any;
    authorOfPost: string;
    postOfText: string;
    dateOfPost: Timestamp;
    timePosted: Timestamp;

    
    
    constructor(obj?: any ) {
    this.answers = obj ? obj.answers : '';
    this.emojiOfPost = obj ? obj.emojiOfPost : false;
    this.authorOfPost = obj ? obj.authorOfPost : '';
    this.postOfText = obj ? obj.postOfText : '';
    this.dateOfPost = obj ? obj.dateOfPost : '';
    this.timePosted = obj ? obj.timePosted : '';

}
    
    updateData(data: Partial<Post>) {
        Object.assign(this, data);
    }

    toJson() {
        return {
            answers: this.answers,
            emojiOfPost: this.emojiOfPost,
            authorOfPost: this.authorOfPost,
            postOfText: this.postOfText,
            dateOfPost: this.dateOfPost,
            timePosted: this.timePosted,

            //posts: this.posts,
        }
    }
    }