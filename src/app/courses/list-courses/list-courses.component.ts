import { Component, OnInit } from '@angular/core';
import { ListCourses } from '../courses';

@Component({
  selector: 'app-list-courses',
  templateUrl: './list-courses.component.html',
  styleUrls: ['./list-courses.component.scss'],
})
export class ListCoursesComponent implements OnInit {
  listCourses: ListCourses[] = [];

  constructor() {}

  ngOnInit(): void {
    for (let i = 0; i < 10; i++) {
      const course: ListCourses = {
        name: `Curso #${i + 1}`,
        image: `../assets/${i + 1}.png`,
        wordsLearned: i + 1 + i * 2,
        totalWords: i + 30 + i * 5,
        progress: ((i + 1 + i * 2) / (i + 30 + i * 5)) * 100,
        reviewIn: this.rand(1, 6),
      };
      this.listCourses.push(course);
    }
  }

  rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}
