import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskQuestionComponent } from './task-question.component';

describe('TaskQuestionComponent', () => {
  let component: TaskQuestionComponent;
  let fixture: ComponentFixture<TaskQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskQuestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
