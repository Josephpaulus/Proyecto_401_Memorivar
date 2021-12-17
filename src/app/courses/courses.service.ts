import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { course } from './courses';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(private http: HttpClient) {}

  create(course: course): Observable<any> {
    return this.http.post<any>(environment.API_URL + '/courses/add', course);
  }

  delete(id: number): Observable<any> {
    return this.http.get<any>(environment.API_URL + '/courses/delete/' + id);
  }

  update(course: course): Observable<any> {
    return this.http.post<any>(environment.API_URL + '/courses/update', course);
  }

  explore(): Observable<course[]> {
    return this.http.get<course[]>(environment.API_URL + '/courses');
  }

  getCourse(id: number): Observable<course> {
    return this.http.get<course>(environment.API_URL + '/courses/' + id);
  }

  // usuario
  userCourses(id: number): Observable<course[]> {
    return this.http.get<course[]>(environment.API_URL + '/courses/user/' + id);
  }

  isUserJoined(userId: number, courseId: number): Observable<any> {
    return this.http.post<any>(environment.API_URL + '/courses/user/joined/', {
      userId,
      courseId,
    });
  }

  join(userId: number, courseId: number): Observable<any> {
    return this.http.post<any>(environment.API_URL + '/courses/user/join/', {
      userId,
      courseId,
    });
  }

  unjoin(userId: number, courseId: number): Observable<any> {
    return this.http.post<any>(environment.API_URL + '/courses/user/unjoin/', {
      userId,
      courseId,
    });
  }

  restartProgress(userId: number, courseId: number): Observable<any> {
    return this.http.post<any>(environment.API_URL + '/courses/user/restart/', {
      userId,
      courseId,
    });
  }

  getUsersCourse(courseId: number): Observable<any> {
    return this.http.get<any>(
      environment.API_URL + '/courses/' + courseId + '/users'
    );
  }
}
