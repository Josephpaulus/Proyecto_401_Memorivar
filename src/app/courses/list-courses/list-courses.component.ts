import { Component, OnInit } from '@angular/core';
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

  constructor(
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

    this.courses.push({
      ...course,
      conceptsLearned: totalLearnedConcepts,
      totalConcepts: concepts.length,
      progress: Math.floor((totalLearnedConcepts / concepts.length) * 100),
      reviewTime: 0,
    });
  }
}
