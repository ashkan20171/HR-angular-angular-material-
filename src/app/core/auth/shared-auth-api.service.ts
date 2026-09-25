import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { User } from '../../features/users/user.service';
@Injectable({providedIn:'root'})
export class SharedAuthApiService{
 private http=inject(HttpClient); private base='http://localhost:4300/api';
 async login(username:string,password:string):Promise<any|null>{try{return await firstValueFrom(this.http.post<any>(`${this.base}/auth/login`,{username,password}))}catch{return null}}
 async create(user:User):Promise<User|null>{try{return await firstValueFrom(this.http.post<User>(`${this.base}/users`,user))}catch{return null}}
 async update(user:User):Promise<User|null>{try{return await firstValueFrom(this.http.put<User>(`${this.base}/users/${user.id}`,user))}catch{return null}}
 async remove(id:number):Promise<boolean>{try{await firstValueFrom(this.http.delete(`${this.base}/users/${id}`));return true}catch{return false}}
 async health():Promise<boolean>{try{await firstValueFrom(this.http.get(`${this.base}/health`));return true}catch{return false}}
}
