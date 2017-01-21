import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';

import {GlobalService} from '../global.service';
import {UserService} from './user.service';
import {Team} from './team';

@Injectable()
export class TeamDataService {

    constructor(private _http:Http,
                private _globalService:GlobalService,
                private _userService:UserService){
    }

    // POST /v1/team
    addTeam(team:Team):Observable<any>{
        let headers = this.getHeaders();

        return this._http.post(
                this._globalService.apiHost+'/team',
                JSON.stringify(team),
                {
                    headers: headers
                }
            )
            .map(response => response.json())
            .map((response) => {
                return response;
            })
            .catch(this.handleError);
    }

    // DELETE /v1/team/1
    deleteTeamById(id:number):Observable<boolean>{
        let headers = this.getHeaders();

        return this._http.delete(
            this._globalService.apiHost+'/team/'+id,
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return response;
            })
            .catch(this.handleError);
    }

    // PUT /v1/team/1
    updateTeamById(team:Team):Observable<any>{
        let headers = this.getHeaders();

        return this._http.put(
            this._globalService.apiHost+'/team/'+team.id,
                JSON.stringify(team),
                {
                    headers: headers
                }
            )
            .map(response => response.json())
            .map((response) => {
                return response;
            })
            .catch(this.handleError);
    }

    private getHeaders():Headers {
        return new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this._userService.getAccessToken(),
        });
    }
    // GET /v1/team
    getAllTeams(): Observable<Team[]> {
        let headers = this.getHeaders();

        return this._http.get(
                this._globalService.apiHost+'/team?sort=team_name',
                {
                    headers: headers
                }
            )
            .map(response => response.json())
            .map((response) => {
                return <Team[]>response.data;
            })
            .catch(this.handleError);
    }

    getTeamById(id:number):Observable<Team> {

        let headers = this.getHeaders();

        return this._http.get(
                this._globalService.apiHost+'/team/'+id,
                {
                    headers: headers
                }
            )
            .map(response => response.json())
            .map((response) => {
                return <Team>response.data;
            })
            .catch(this.handleError);
    }

    private handleError (error: Response | any) {

        let errorMessage:any = {};
        // Connection error
        if(error.status == 0) {
            errorMessage = {
                success: false,
                status: 0,
                data: "Sorry, there was a connection error occurred. Please try again.",
            };
        }
        else {
            errorMessage = error.json();
        }
        return Observable.throw(errorMessage);
    }



}
