import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Answer } from '../learn';

@Component({
  selector: 'app-show-answer-input',
  templateUrl: './show-answer-input.component.html',
  styleUrls: ['./show-answer-input.component.scss'],
})
export class ShowAnswerInputComponent implements OnInit {
  @Input() concept!: string;
  @Input() answer!: string;

  @Output() messageEvent = new EventEmitter<string>();

  @ViewChild('input') input!: ElementRef;

  status: number = Answer.none;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout(() => this.input.nativeElement.focus(), 0);
  }

  checkAnswer(event: any) {
    const value = event.target.value;

    this.messageEvent.emit(value);
  }

  setStatus(status: number) {
    this.status = status;
  }
}
