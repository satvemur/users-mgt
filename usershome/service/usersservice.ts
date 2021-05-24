import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, delay, retry } from 'rxjs/operators';
import { transformError } from '../common/common';
import { IDBOps } from '../domain/dbops.interface';
import { IUser, User } from '../domain/user';
import { getAllDBUsers,  getDBUser, removeAllUsers, removeSelectedUsers, removeUser, saveDBUser} from '../globals';


@Injectable()
export class UserOpsService {
    deleteUserSource = new Subject();
    deleteUserSource$ = this.deleteUserSource.asObservable();
}

export interface IUserService {
    currentUser: BehaviorSubject<IUser>
    getUser(id): Observable<IUser>
    updateUser(user: IUser): Observable<IUser>
    getUsers(): Observable<IUser[]>
    removeUser(user: IUser): Observable<IUser>
    removeAllUsers(): Observable<IUser[]>
    removeSelectedUsers(users:IUser[]): Observable<IUser[]>
  }

@Injectable({
    providedIn: 'root',
})

// CRUD operations service 

export class UsersService implements IUserService{
    currentUser = new BehaviorSubject<IUser>(new User());

    constructor(private httpClient: HttpClient, public userOps: UserOpsService) { 

    }

    // removes the user id represented by Mongo BSON id
    public getUser(id): Observable<IUser> {
        return this.httpClient.get<IUser>(`${getDBUser}/${id}`).pipe(retry(3), catchError(transformError) );;
    }

    public updateUser(user: IUser): Observable<IUser> {
        const updateResponse = this.httpClient.post<IUser>(saveDBUser, user).pipe(catchError(transformError)).pipe(retry(3), catchError(transformError));
        return updateResponse;
    }

    public getUsers(): Observable<IUser[]> {
        return this.httpClient.get<IUser[]>(`${getAllDBUsers}`).pipe( retry(3), catchError(transformError) );;
    }

    public removeUser(user: IUser): Observable<IUser> {
        const deleteUserResponse =  this.httpClient.delete<IUser>(`${removeUser}/${user._id}`).pipe(retry(3), catchError(transformError));;
        return deleteUserResponse;
    }

    public removeAllUsers(): Observable<IUser[]> {
        return this.httpClient.delete<IUser[]>(`${removeAllUsers}`).pipe(retry(3),catchError(transformError));
    }

    public removeSelectedUsers(users:IUser[]): Observable<IUser[]> {
        let ops: Array<IDBOps> = [];
        for (let u of users) {
            if (u._id){
                this.removeUser(u).subscribe(( data) => {
                    console.log("deleted record with ID " + JSON.stringify(data));
                    ops.push({"n":1,"ok":1});
                } , err =>{
                    console.error("Unable to delete record with Id "+ u._id)
                });
//                this.userOps.deleteUserSource.next(u);
            }  else
                continue;
        }            
        return of(users);
    }   
}
