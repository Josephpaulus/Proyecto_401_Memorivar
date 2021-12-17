import { Component, OnInit } from '@angular/core';
import { course } from '../courses';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-explore-courses',
  templateUrl: './explore-courses.component.html',
  styleUrls: ['./explore-courses.component.scss'],
})
export class ExploreCoursesComponent implements OnInit {
  courses: course[] = [];

  constructor(private CoursesService: CoursesService) {}

  ngOnInit(): void {
    this.CoursesService.explore().subscribe((courses) => {
      for (const course of courses) {
        if (!course.image) {
          course.image =
            'https://www.welivesecurity.com/wp-content/uploads/2018/04/cursos-online-gratuitos-seguridad-inform%C3%A1tica.jpg';
        }
      }

      this.courses = courses;
    });
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
