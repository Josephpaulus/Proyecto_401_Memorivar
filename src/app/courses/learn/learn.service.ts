import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Concept, LearnedConcept } from './learn';

@Injectable({
  providedIn: 'root',
})
export class LearnService {
  session: number = 0;

  conceptsPerSession: number = 3;
  correctAnswers: number = 3;
  reviewTime: number = 3 * 60;

  pointsForAnsweingRight: number = 50;
  pointsForSpeed: number = 120;
  pointsForAccuracy: number = 50;

  constructor(private http: HttpClient) {}

  getConcepts(courseId: number): Observable<Concept[]> {
    return this.http.get<Concept[]>(
      environment.API_URL + '/courses/' + courseId + '/concepts'
    );
  }

  addLearnedConcept(concept: LearnedConcept): Observable<any> {
    return this.http.post<any>(
      environment.API_URL + '/courses/learnedConcept/add',
      concept
    );
  }

  getLearnedConcepts(user_id: number, course_id: number): Observable<any[]> {
    return this.http.post<any[]>(
      environment.API_URL + '/courses/learnedConcepts/',
      { user_id, course_id }
    );
  }

  updateLearnedConcept(concept: LearnedConcept): Observable<any> {
    return this.http.post<any>(
      environment.API_URL + '/courses/learnedConcept/update',
      concept
    );
  }

  addPoints(
    user_id: number,
    course_id: number,
    points: number
  ): Observable<any> {
    return this.http.post<any>(environment.API_URL + '/courses/points/update', {
      user_id,
      course_id,
      points,
    });
  }
}
