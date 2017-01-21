import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import swal, {SweetAlertOptions} from 'sweetalert2';

import {StaffDataService} from "../../model/staff-data.service";
import {Staff} from "../../model/staff";
import {UserService} from "../../model/user.service";

@Component({
  templateUrl: './setting-staff-list.component.html',
})
export class SettingStaffListComponent implements OnInit{
  private _staffs:Staff[];
  private _errorMessage:string;

  constructor(private _staffDataService:StaffDataService,
              private _userService:UserService,
              private _router:Router) {}

  ngOnInit() {
    this.getStaffs();
  }

  public getStaffs() {
    this._staffs = null;
    this._staffDataService.getAllStaffs()
        .subscribe(
            staffs => {
              this._staffs = staffs
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

  public viewStaff(staff:Staff):void {
    this._router.navigate(['/setting', 'staff', staff.id]);
  }

  public confirmDeleteStaff(staff:Staff):void {
    // Due to sweet alert scope issue, define as function variable and pass to swal

    let parent = this;
    // let getStaffs = this.getStaffs;
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
          parent._staffDataService.deleteStaffById(staff.id)
              .subscribe(
                  result => {
                    parent.getStaffs();
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

