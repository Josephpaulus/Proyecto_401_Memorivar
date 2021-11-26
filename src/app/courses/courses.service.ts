import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddCourse } from './courses';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(private http: HttpClient) {}

  createCourse(course: AddCourse): Observable<AddCourse> {
    return this.http.post<AddCourse>(
      environment.API_URL + '/courses/add',
      course
    );
  }
}
