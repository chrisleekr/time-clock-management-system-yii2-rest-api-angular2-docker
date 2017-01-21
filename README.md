# Time Clock Management System (Yii2 REST API + Angular 2 + Docker)

This is a personal project for learning Angular 2. The project contains two applications, one for REST API backend, and the another for Angular 2 frontend.

The project involves:
* Yii2 for providing RESTful API including user login/logout, managing global settings/team/staff, showing period based reports, recording any activities done by users, and lastly time clock in/out
* User authentication based on randomly generated access token for stateless REST API through HTTP Bearer Tokens
* Angular 2 with [CoreUI](http://coreui.io/demo/Angular2_Demo/) template, featured by [Angular 2 Color Picker Directive](https://github.com/Alberplz/angular2-color-picker), [moment.js pipes](https://github.com/urish/angular2-moment), [Angular2 date range picker](https://github.com/kekeh/mydaterangepicker), [SweetAlert2](https://limonte.github.io/sweetalert2/), [Native Angular directives for Bootstrap](https://github.com/valor-software/ng2-bootstrap) 
* Porting [AngularJS Circular Time Picker](https://github.com/sidaudhi/angular-circular-timepicker) for Angular 2 as component
* Custom-made stopwatch component
* Dockerized application of frontend, backend and db

Note: This project is developed for learning and practice. Not suitable for production use. And it does not provide any testing code.

## Getting Started


### Directory Structure

      timeclock-backend/  contains Yii2 RESTful API application
      timeclock-frontend/ contains Angular 2 frontend application

### Menu Structure

      /login                authenticate with user credentials
      /logout               log out
      /dashboard            display latest activities and shortcuts
      /time-clock           clock in/out staffs
      /report/timesheet     display timesheet reports for staffs
      /activity             display activities that are recorded
      /setting/global       manage global configurations for the applicaion
      /setting/team         list/create/update/delete teams
      /setting/staff        list/create/update/delete staffs
      

### Prerequisites

* Docker 1.12.1+: <https://www.docker.com/>
* VirtualBox: <https://www.virtualbox.org/>

### Usage
To run the application, open the console and execute following commands.

```
    $ git clone https://github.com/chrisleekr/time-clock-management-system-yii2-rest-api-angular2-docker.git
    $ cd time-clock-management-system-yii2-rest-api-angular2-docker    
```

Then open `docker-compose.yml` file in the root folder and replace `<YOUR GITHUB API TOKEN>` to Personal access tokens from [Github](https://github.com/settings/tokens)

![Alt text](/screenshots/0.png?raw=true "docker-compose.yml")

Once you replaced API token, run following command.

```
    $ docker-compose up
```

And wait for it is up and running. It might take for a while to fully up and running. 

![Alt text](/screenshots/1.png?raw=true "Screenshot")

Once it is up and running, please open another console window and execute following command to migrate database.

```
    $ docker-compose run --rm backend ./yii migrate
```
![Alt text](/screenshots/2.png?raw=true "Screenshot")
Once migration is done, then open the browser and access to:

* Frontend: http://localhost:4200
* Backend: http://localhost:4201

By default, the application provides admin credentials as username `admin` and password `123456`. As the application does not provide the function to manage user information at the moment, please do not use in production unless you know what you are doing.

## Screenshots
![Alt text](/screenshots/3.png?raw=true "Screenshot")
![Alt text](/screenshots/4.png?raw=true "Screenshot")
![Alt text](/screenshots/5.png?raw=true "Screenshot")
![Alt text](/screenshots/6.png?raw=true "Screenshot")
![Alt text](/screenshots/7.png?raw=true "Screenshot")
![Alt text](/screenshots/8.png?raw=true "Screenshot")
![Alt text](/screenshots/9.png?raw=true "Screenshot")
![Alt text](/screenshots/10.png?raw=true "Screenshot")
![Alt text](/screenshots/11.png?raw=true "Screenshot")
![Alt text](/screenshots/12.png?raw=true "Screenshot")
![Alt text](/screenshots/13.png?raw=true "Screenshot")
![Alt text](/screenshots/14.png?raw=true "Screenshot")
![Alt text](/screenshots/15.png?raw=true "Screenshot")
