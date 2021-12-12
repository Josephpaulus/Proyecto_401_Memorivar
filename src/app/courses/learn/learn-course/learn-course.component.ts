import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-learn-course',
  templateUrl: './learn-course.component.html',
  styleUrls: ['./learn-course.component.scss'],
})
export class LearnCourseComponent implements OnInit {
  showAnswer: boolean = true;
  showInput: boolean = false;
  showError: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
