import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class chatGPTService {

  private header = new HttpHeaders({
    "Content-Type": "application/json",
    "Authorization": 'Bearer ',
  });

  constructor(private http: HttpClient ) { }

  getChatResponse( prompt: string): Observable<any> {
    return this.http.post<any>(
      'https://api.openai.com/v1/chat/completions',
      {
      "model": "gpt-3.5-turbo",
      "messages": [{"role": "user", "content": prompt}],
      "temperature": 0.7
    },
    {
      headers: this.header,
    }
  )
  }

}
