import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { course, Words } from '../courses';
import { CoursesService } from '../courses.service';
import { UsersService } from '../../users/users.service';
import { user } from 'src/app/users/users';
import { Router } from '@angular/router';
import { LearnService } from '../learn/learn.service';

@Component({
  selector: 'app-info-course',
  templateUrl: './info-course.component.html',
  styleUrls: ['./info-course.component.scss'],
})
export class InfoCourseComponent implements OnInit {
  @ViewChild('listWords') listWords!: MatTable<Words>;

  displayedColumns: string[] = ['concept', 'answer', 'review'];
  dataSource: Words[] = [];

  courseId!: number;
  course!: course;

  user!: user;

  courseOwner!: string;

  isOwner: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private UsersService: UsersService,
    private CoursesService: CoursesService,
    private LearnService: LearnService
  ) {
    this.user = this.UsersService.getCurrentUser();
    this.courseId = this.route.snapshot.params.id;

    this.setData();
  }

  ngOnInit(): void {}

  async setData() {
    this.course = await this.CoursesService.getCourse(
      this.courseId
    ).toPromise();

    if (!this.course.image) {
      this.course.image =
        'https://www.welivesecurity.com/wp-content/uploads/2018/04/cursos-online-gratuitos-seguridad-inform%C3%A1tica.jpg';
    }

    this.dataSource = this.course.words;

    const learnedConcepts = await this.LearnService.getLearnedConcepts(
      this.user.id,
      this.courseId
    ).toPromise();

    learnedConcepts.forEach((concept, index) => {
      this.course.words[index].timeReview = concept.time_review;
    });

    setInterval(() => {
      learnedConcepts.forEach((concept, index) => {
        this.course.words[index].timeReview = concept.time_review;
      });
    }, 1000);

    this.UsersService.getUser(this.course.user_id).subscribe((user) => {
      this.courseOwner = user.user;

      if (user.id === this.user.id) {
        this.isOwner = true;
      }
    });
  }

  unjoin() {
    this.CoursesService.unjoin(this.user.id, this.courseId).subscribe(() => {
      this.router.navigate(['/courses']);
    });
  }

  restartProgress() {
    this.CoursesService.restartProgress(this.user.id, this.courseId).subscribe(
      () => {
        window.location.reload();
      }
    );
  }

  reviewIn(timeReview: number) {
    if (timeReview === 0 || timeReview === undefined) {
      return '-';
    } else if (timeReview <= this.getTime()) {
      return 'YA';
    } else {
      return this.secondsToTime(timeReview - this.getTime());
    }
  }

  getTime() {
    return Math.round(Date.now() / 1000);
  }

  secondsToTime(seconds: number): string {
    let m = Math.floor((seconds % 3600) / 60)
        .toString()
        .padStart(2, '0'),
      s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, '0');

    return `${m}m ${s}s`;
  }
}
