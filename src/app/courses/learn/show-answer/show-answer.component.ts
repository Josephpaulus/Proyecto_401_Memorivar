import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-answer',
  templateUrl: './show-answer.component.html',
  styleUrls: ['./show-answer.component.scss'],
})
export class ShowAnswerComponent implements OnInit {
  @Input() answer!: string;
  @Input() concept!: string;

  constructor() {}

  ngOnInit(): void {}
}
