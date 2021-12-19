import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { user } from 'src/app/users/users';
import { UsersService } from 'src/app/users/users.service';
import { ChallengeService } from '../challenge.service';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss'],
})
export class ChallengeComponent implements OnInit {
  user!: user;
  courseId!: number;

  history: any[] = [];

  showHistory: boolean = true;

  loaded: boolean = false;

  constructor(
    private UsersService: UsersService,
    private ChallengeService: ChallengeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.user = this.UsersService.getCurrentUser();
    this.courseId = this.route.snapshot.params.id;

    this.ChallengeService.getUserHistory(this.user.id, this.courseId).subscribe(
      (history) => {
        for (const challenge of history) {
          if (!challenge.opponent.image) {
            challenge.opponent.image =
              'https://material.angularjs.org/1.1.1/img/list/60.jpeg';
          }
        }

        if (history.length === 0) {
          this.showHistory = false;
        } else {
          this.loaded = true;
        }

        this.history = history;
      }
    );
  }

  ngOnInit(): void {}

  back() {
    this.router.navigate(['./courses/', this.courseId, 'info']);
  }

  clearHistory() {
    this.ChallengeService.clearHistory(this.courseId, this.user.id).subscribe(
      () => {
        window.location.reload();
      }
    );
  }

  challenge() {
    this.router.navigate(['./courses/', this.courseId, 'challenge', 'users']);
  }

  async challengeDetails(challengeId: number, opponent: boolean) {
    if (opponent) {
      await this.ChallengeService.updateStatus(
        challengeId,
        this.courseId,
        this.user.id,
        1
      ).toPromise();

      this.router.navigate(['./courses/', this.courseId, 'learn'], {
        state: {
          challenge: true,
          challengeId,
          opponentId: this.user.id,
          opponent: true,
        },
      });

      return;
    }

    this.router.navigate([
      './courses/',
      this.courseId,
      'challenge',
      challengeId,
      'details',
    ]);
  }

  formatDate(s: number) {
    return new Date(s * 1000).toLocaleString();
  }
}
