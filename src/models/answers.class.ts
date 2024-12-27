import { FieldValue, Timestamp } from "@angular/fire/firestore";

export class Answer {
    answerText: string;
    emojiOfAnswer: any;
    authorOfAnswer: string;
    timeAnswerPosted: Timestamp | Date | FieldValue; // Erlaube sowohl Date als auch Timestamp
    id: string = '';
    authorName: any;
    emojiInformations: any;
    answerInformations: any;



    constructor(obj?: any) {
        this.answerText = obj ? obj.answerText : '';
        this.emojiOfAnswer = obj ? obj.emojiOfPost : '';
        this.authorOfAnswer = obj ? obj.idOfUser : '';
        this.timeAnswerPosted = obj ? obj.timeAnswerPosted : '';
        this.id = obj ? obj.id : '';

    }

    updateData(data: Partial<Answer>) {
        Object.assign(this, data);
    }

    toJson() {
        return {
            answerText: this.answerText,
            emojiOfPost: this.emojiOfAnswer,
            idOfUser: this.authorOfAnswer,
            timeAnswerPosted: this.timeAnswerPosted,
            id: this.id

            //posts: this.posts,
        }
    }
}