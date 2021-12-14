import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-msg-learn',
  templateUrl: './msg-learn.component.html',
  styleUrls: ['./msg-learn.component.scss'],
})
export class MsgLearnComponent implements OnInit {
  @Input() msg!: string;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  back() {
    this.router.navigate(['/courses']);
  }
}
