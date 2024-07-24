import { Timestamp } from "@angular/fire/firestore";

export class Answer {
    answerText: string;
    emojiOfAnswer: any;
    idOfUser: string;
    timeAnswerPosted: string;
   

    
    
    constructor(obj?: any ) {
    this.answerText = obj ? obj.answerText : '';
    this.emojiOfAnswer = obj ? obj.emojiOfPost : '';
    this.idOfUser = obj ? obj.idOfUser : '';
    this.timeAnswerPosted = obj ? obj.timeAnswerPosted : '';
   

}
    
    updateData(data: Partial<Answer>) {
        Object.assign(this, data);
    }

    toJson() {
        return {
            answerText: this.answerText,
            emojiOfPost: this.emojiOfAnswer,
            idOfUser: this.idOfUser,
            timeAnswerPosted: this.timeAnswerPosted,
          

            //posts: this.posts,
        }
    }
    }