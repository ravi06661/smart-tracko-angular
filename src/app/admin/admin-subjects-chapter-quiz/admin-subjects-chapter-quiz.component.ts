import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isThisHour } from 'date-fns';
import { lastDayOfDecade } from 'date-fns/esm';
import { ChapterQuizeQuestion } from 'src/app/entity/chapter-quize-question';
import { QuestionServiceService } from 'src/app/service/question-service.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-admin-subjects-chapter-quiz',
  templateUrl: './admin-subjects-chapter-quiz.component.html',
  styleUrls: ['./admin-subjects-chapter-quiz.component.scss']
})
export class AdminSubjectsChapterQuizComponent {
  questionId: number = 0;
  questions: ChapterQuizeQuestion[] = []
  id: number = 0;
  question: ChapterQuizeQuestion = new ChapterQuizeQuestion();
  public Editor = ClassicEditor;
  static images: File[] = []
  private editorInstance: any;
  message:string=''
  constructor(private questionService: QuestionServiceService, private route: ActivatedRoute, private router: Router) {

  }
  ngOnInit() {
    this.id = this.route.snapshot.params[('id')];
    this.getAllQuestions();
  }

   public addQuestion(){  
     this.questionService.addQuestion(this.question,this.id).subscribe(
      (data)=>{
        this.question = new ChapterQuizeQuestion();
        this.message='success..'
        console.log(data);
      }
     )
   }
  public getAllQuestions() {
    if (this.id) {
      this.questionService.getAllQuestionByChapterId(this.id).subscribe(
        (data) => {
          this.questions = data;
        }
      )
    }
  }
  public deleteQuestion() {
    this.questionService.deleteQuestionById(this.questionId).subscribe(
      (data) => {
        this.questionId = 0;
        this.ngOnInit();
      },(error)=>{
        this.questionId = 0;
        this.ngOnInit();
      }
    )
  }
  public updateQuestion() {
    const textElement = document.createElement('div');
    textElement.innerHTML = this.editorInstance.getData();
    const text = textElement.innerText.trim();
   this.question.questionContent=text;
    this.questionService.updateQuestionById(this.question,this.id).subscribe(
      (data) => {
      this.question =new ChapterQuizeQuestion();
      this.message ="success.."
      },(error)=>{
      
      }
    )
  }

  public getQuestionById(id: number) {
    this.questionService.getQuestionById(id).subscribe(
      (data) => {
        this.question = data;
      }
    )
  }

  public cancel() {
    this.question = new ChapterQuizeQuestion();
  }
  reload(){
    this.question = new ChapterQuizeQuestion();
    this.getAllQuestions();
    this.message=''
  }
  onEditorReady(eventData: any) {
    this.editorInstance = eventData;
  }
  ckSubmit() {
    const textElement = document.createElement('div');
    textElement.innerHTML = this.editorInstance.getData();
    const text = textElement.innerText.trim();
  }
}
