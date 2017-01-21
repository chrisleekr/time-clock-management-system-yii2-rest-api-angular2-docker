import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {

    constructor() {
    }

    public today = new Date();
    public disabled: boolean = false;
    public status: {isopen: boolean} = {isopen: false};


    public toggled(open: boolean): void {
    }

    public toggleDropdown($event: MouseEvent): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    }

    ngOnInit(): void {

    }
}
