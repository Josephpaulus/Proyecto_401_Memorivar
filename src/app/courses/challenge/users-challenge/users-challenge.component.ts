import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { user } from 'src/app/users/users';
import { UsersService } from 'src/app/users/users.service';
import { CoursesService } from '../../courses.service';

@Component({
  selector: 'app-users-challenge',
  templateUrl: './users-challenge.component.html',
  styleUrls: ['./users-challenge.component.scss'],
})
export class UsersChallengeComponent implements OnInit {
  user!: user;
  users!: user[];
  courseId: number;

  showUsers: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private UsersService: UsersService,
    private CoursesService: CoursesService
  ) {
    this.user = this.UsersService.getCurrentUser();
    this.courseId = this.route.snapshot.params.id;

    this.CoursesService.getUsersCourse(this.courseId).subscribe((users) => {
      for (const user of users) {
        if (!user.image) {
          user.image = 'https://material.angularjs.org/1.1.1/img/list/60.jpeg';
        }
      }

      users.splice(
        users.findIndex((user: user) => user.id === this.user.id),
        1
      );

      if (users.length === 0) {
        this.showUsers = false;
      }

      this.users = users;
    });
  }

  ngOnInit(): void {}

  challenge(opponentId: number) {
    this.router.navigate(['./courses/', this.courseId, 'learn'], {
      state: {
        challenge: true,
        opponentId,
      },
    });
  }

  back() {
    this.router.navigate(['./courses/', this.courseId, 'challenge']);
  }
}
