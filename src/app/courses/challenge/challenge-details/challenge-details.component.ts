import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { user } from 'src/app/users/users';
import { UsersService } from 'src/app/users/users.service';
import { ChallengeService } from '../challenge.service';

@Component({
  selector: 'app-challenge-details',
  templateUrl: './challenge-details.component.html',
  styleUrls: ['./challenge-details.component.scss'],
})
export class ChallengeDetailsComponent implements OnInit {
  user: user;
  courseId: number;
  challengeId: number;

  details: any[] = [];

  challenger: any;
  opponent: any;

  status: any = null;

  constructor(
    private UsersService: UsersService,
    private ChallengeService: ChallengeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.user = this.UsersService.getCurrentUser();
    this.courseId = this.route.snapshot.params.id;
    this.challengeId = this.route.snapshot.params.challengeId;

    this.ChallengeService.getChallengeDetails(
      this.challengeId,
      this.courseId,
      this.user.id
    ).subscribe((details) => {
      for (const result of details.results) {
        if (!result.challenger.image) {
          result.challenger.image =
            'https://material.angularjs.org/1.1.1/img/list/60.jpeg';
        }

        if (!result.opponent.image) {
          result.opponent.image =
            'https://material.angularjs.org/1.1.1/img/list/60.jpeg';
        }
      }

      this.details = details.results;

      this.details.reverse();

      this.challenger = details.results[0].challenger;
      this.opponent = details.results[0].opponent;

      if (details.status === 1) {
        if (details.winner === null) {
          this.status = -1;
        } else if (details.winner) {
          this.status = 1;
        } else {
          this.status = 0;
        }
      }
    });
  }

  ngOnInit(): void {}

  back() {
    this.router.navigate(['./courses/', this.courseId, 'challenge']);
  }
}
