import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-answer-error',
  templateUrl: './show-answer-error.component.html',
  styleUrls: ['./show-answer-error.component.scss'],
})
export class ShowAnswerErrorComponent implements OnInit {
  @Input() answerInput!: string;
  @Input() concept!: string;
  @Input() answer!: string;

  constructor() {}

  ngOnInit(): void {}
}
