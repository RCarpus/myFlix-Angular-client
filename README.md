# MyFlixAngularClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.2.

## Installing Angular
If Angular is not already installed, run `npm install -g @angular/cli`

## Creating a new project
Navigate to the target folder for the new project and run `ng new project_name`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Using Material Design
To Add Material Deisgn to the project, runt `ng add @angular/material`  
When prompted to setup Material Design, for this project, we are using Custom theme, global Angular Material typography styles, and browser animations.  
The components used in this project are:
- MatInputModule
- MatButtonModule
- MatCardModule
- MatFormFieldModule
- MatDialogModule
- MatSnackBarModule
- FormsModule

The components are imported into `app.module.ts` and added to the imports list under @NgModule.



## Issues
- The Angular app has an endpoint to get the user's favorite movies. The API doesn't yet have an endpoint dedicated to that task.