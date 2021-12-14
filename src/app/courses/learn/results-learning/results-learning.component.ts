import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LearnedConcept } from '../learn';
import { LearnService } from '../learn.service';

@Component({
  selector: 'app-results-learning',
  templateUrl: './results-learning.component.html',
  styleUrls: ['./results-learning.component.scss'],
})
export class ResultsLearningComponent implements OnInit {
  @Input() conceptsLearned!: LearnedConcept[];

  correctAnswers: number = 0;
  pointsForCorrectAnswers: number = 0;

  timeSpent!: string;
  pointsTimeSpent!: number;

  accuracy: number = 0;
  pointsAccuracy: number = 0;

  totalPoints: number = 0;

  concepts!: any[];

  constructor(private LearnService: LearnService, private router: Router) {}

  ngOnInit(): void {
    let correctAnswers: number = 0;
    let timeSpent: number = 0;
    let attempts: number = 0;

    for (const concept of this.conceptsLearned) {
      if (concept.learned) {
        correctAnswers += concept.correct_answers;
        timeSpent += concept.time_spent;
        attempts += concept.attempts;
      }
    }

    this.correctAnswers = correctAnswers;
    this.pointsForCorrectAnswers =
      correctAnswers * this.LearnService.pointsForAnsweingRight;

    this.timeSpent = this.secondsToTime(timeSpent);
    this.pointsTimeSpent = Math.max(
      0,
      this.LearnService.pointsForSpeed - timeSpent
    );

    let answered: number = this.correctAnswers * this.conceptsLearned.length;
    let accuracy: number = answered / (answered + attempts);

    this.accuracy = Math.round(accuracy * 100);
    this.pointsAccuracy = Math.floor(
      this.LearnService.pointsForAccuracy * accuracy
    );

    this.totalPoints =
      this.pointsForCorrectAnswers + this.pointsTimeSpent + this.pointsAccuracy;

    this.LearnService.addPoints(
      this.conceptsLearned[0].user_id,
      this.conceptsLearned[0].concept.course_id,
      this.totalPoints
    ).toPromise();
  }

  exit() {
    this.router.navigate([
      '/courses/',
      this.conceptsLearned[0].concept.course_id,
      'info',
    ]);
  }

  secondsToTime(seconds: number): string {
    let m = Math.floor((seconds % 3600) / 60)
        .toString()
        .padStart(2, '0'),
      s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, '0');

    return `${m}:${s}`;
  }
}
