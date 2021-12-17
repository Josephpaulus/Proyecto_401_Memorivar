import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { user } from 'src/app/users/users';
import { UsersService } from 'src/app/users/users.service';
import { course, ListCourses } from '../courses';
import { CoursesService } from '../courses.service';
import { LearnService } from '../learn/learn.service';

@Component({
  selector: 'app-list-courses',
  templateUrl: './list-courses.component.html',
  styleUrls: ['./list-courses.component.scss'],
})
export class ListCoursesComponent implements OnInit {
  courses: ListCourses[] = [];
  user!: user;

  showCourses: boolean = true;
  
  constructor(
    public router: Router,
    private UsersService: UsersService,
    private CoursesService: CoursesService,
    private LearnService: LearnService
  ) {
    this.user = this.UsersService.getCurrentUser();
  }

  ngOnInit(): void {
    this.CoursesService.userCourses(this.user.id).subscribe((courses) => {
      for (const course of courses) {
        this.processCourse(course);
      }

      if (courses.length === 0) {
        this.showCourses = false;
      }
    });
  }

  async processCourse(course: course) {
    if (!course.image) {
      course.image =
        'https://www.welivesecurity.com/wp-content/uploads/2018/04/cursos-online-gratuitos-seguridad-inform%C3%A1tica.jpg';
    }

    const learnedConcepts = await this.LearnService.getLearnedConcepts(
      this.user.id,
      course.id
    ).toPromise();

    const concepts = await this.LearnService.getConcepts(course.id).toPromise();

    const totalLearnedConcepts = learnedConcepts.filter(
      (concept) => concept.learned
    ).length;

    let reviewIn = Math.max(
      ...learnedConcepts.map((concept) => concept.time_review)
    );

    const courseView = {
      ...course,
      conceptsLearned: totalLearnedConcepts,
      totalConcepts: concepts.length,
      progress: Math.floor((totalLearnedConcepts / concepts.length) * 100),
      reviewTime: reviewIn,
    };

    this.courses.push(courseView);

    setInterval(() => {
      courseView.reviewTime = reviewIn;
    }, 1000);
  }

  reviewIn(timeReview: number) {
    if (
      timeReview === 0 ||
      isNaN(timeReview) ||
      Math.abs(timeReview) === Infinity
    ) {
      return '-';
    } else if (timeReview <= this.getTime()) {
      return 'YA';
    } else {
      return this.secondsToTime(timeReview - this.getTime());
    }
  }

  back() {
    this.router.navigate(['/explore']);
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
