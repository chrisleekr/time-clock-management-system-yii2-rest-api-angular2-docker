import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import swal, {SweetAlertOptions} from 'sweetalert2';

import {TeamDataService} from "../../model/team-data.service";
import {Team} from "../../model/team";
import {UserService} from "../../model/user.service";

@Component({
    templateUrl: './setting-team-list.component.html',
})
export class SettingTeamListComponent implements OnInit{
    private _teams:Team[];
    private _errorMessage:string;

    constructor(private _teamDataService:TeamDataService,
                private _userService:UserService,
                private _router:Router) {}

    ngOnInit() {
        this.getTeams();
    }

    public getTeams() {
        this._teams = null;
        this._teamDataService.getAllTeams()
            .subscribe(
                teams => {
                    this._teams = teams
                },
                error =>  {
                    // unauthorized access
                    if(error.status == 401) {
                        this._userService.unauthorizedAccess(error);
                    } else {
                        this._errorMessage = error.data.message;
                    }
                }
            );
    }

    public viewTeam(team:Team):void {
        this._router.navigate(['/setting', 'team', team.id]);
    }

    public confirmDeleteTeam(team:Team):void {
        // Due to sweet alert scope issue, define as function variable and pass to swal

        let parent = this;
        // let getTeams = this.getTeams;
        this._errorMessage = '';

        swal({
            title: 'Are you sure?',
            text: "Once delete, you won't be able to revert this!",
            type: 'question',
            showLoaderOnConfirm: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            preConfirm: function () {
                return new Promise(function (resolve, reject) {
                    parent._teamDataService.deleteTeamById(team.id)
                        .subscribe(
                            result => {
                                parent.getTeams();
                                resolve();
                            },
                            error =>  {
                                // unauthorized access
                                if(error.status == 401) {
                                    parent._userService.unauthorizedAccess(error);
                                } else {
                                    parent._errorMessage = error.data.message;
                                }
                                resolve();

                            }
                        );
                })
            }
        }).then(function(result) {
            // handle confirm, result is needed for modals with input

        }, function(dismiss) {
            // dismiss can be "cancel" | "close" | "outside"
        });
    }
}

