import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Concept } from '../learn/learn';
import { Challenge } from './challenge';

@Injectable({
  providedIn: 'root',
})
export class ChallengeService {
  conceptsPerChallenge: number = 5;

  constructor(private http: HttpClient) {}

  getUserHistory(userId: number, courseId: number): Observable<any> {
    return this.http.post<any>(
      environment.API_URL + '/courses/challenges/history/',
      {
        userId,
        courseId,
      }
    );
  }

  getChallengeDetails(
    challengeId: number,
    courseId: number,
    userId: number
  ): Observable<any> {
    return this.http.post<any>(
      environment.API_URL + '/courses/challenges/details/',
      {
        challengeId,
        courseId,
        userId,
      }
    );
  }

  createChallenge(challenge: Challenge): Observable<any> {
    return this.http.post<any>(
      environment.API_URL + '/courses/challenges/create/',
      challenge
    );
  }

  updateAnswer(
    challengeId: number,
    courseId: number,
    userId: number,
    conceptId: number,
    correctAnswer: number
  ): Observable<any> {
    return this.http.post<any>(
      environment.API_URL + '/courses/challenges/answer/',
      {
        challengeId,
        courseId,
        userId,
        conceptId,
        correctAnswer,
      }
    );
  }

  updateStatus(
    challengeId: number,
    courseId: number,
    userId: number,
    status: number
  ): Observable<any> {
    return this.http.post<any>(
      environment.API_URL + '/courses/challenges/status/',
      {
        challengeId,
        courseId,
        userId,
        status,
      }
    );
  }

  getConcepts(data: any): Observable<Concept[]> {
    return this.http.post<Concept[]>(
      environment.API_URL + '/courses/challenges/concepts/',
      data
    );
  }

  finishChallenge(challengeId: number): Observable<any> {
    return this.http.post<any>(
      environment.API_URL + '/courses/challenges/finish/',
      {
        challengeId,
      }
    );
  }

  clearHistory(courseId: number, userId: number): Observable<any> {
    return this.http.post<any>(
      environment.API_URL + '/courses/challenges/history/clear/',
      {
        courseId,
        userId,
      }
    );
  }
}
