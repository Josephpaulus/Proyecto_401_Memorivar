import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddCourse, course } from './courses';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(private http: HttpClient) {}

  create(course: AddCourse): Observable<AddCourse> {
    return this.http.post<AddCourse>(
      environment.API_URL + '/courses/add',
      course
    );
  }

  explore(): Observable<course[]> {
    return this.http.get<course[]>(
      environment.API_URL + '/courses'
    );
  }

  getCourse(id: number): Observable<course> {
    return this.http.get<course>(
      environment.API_URL + '/courses/' + id
    );
  }
}
