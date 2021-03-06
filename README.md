# Empleados

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.4 and the Firebase SDK 9.
A demo of the project can be found there [Emplados demo](https://empleados-7306f.web.app/ "Empleados demo application").

## Important notice

The purpose of this application is just to do a quick test of the Firesbase SDK 9 that is fully compatible and required in Angular 13 since Angular 7. It is based on a project that used a previous version of Angular and Firebase SDK so It required to update the code, dependencies etc in order to run in Angular 13. 
The original course project, with previous SDK, can be found in [Udemy firebase empleados course](https://www.udemy.com/course/app-empleado-angular-firebase/ "Original Firebase empleados course"). 
The following video helps me to update the application [CRUD con Angular y Firebase](https://www.youtube.com/watch?v=t_YSrxj0wGY, "CRUD con Angular y Firebase").

In order to have a try of the application in your local you must first need to install node_modules directory and Bootstrap css framework as follows:
* Install node_modules `npm install`.
* Install Bootstrap `npm i bootstrap`, optionally you can do the same by CDN link (check on the bootstrap web).
* You need to create a Project in your Firebase online Console and inside must create a Database on the Firestore option (no SQL) where to CRUD the application.
* You should create a hosting for the application if wanted to upload there in the project you previously created.

## STEPS ON HOW TO INSTALL AND USE FIREBASE SDK 9 ON ANGULAR 13

1). You have to install in your project the Firebase dependencies for angular `ng add @angular/fire`. You were asked to fill your data in order to connect with your Firebase account and must select your project and your app if any was previously created on your Firebase online console.

2). You also need to install **once** the Firebase cli for every project `npm i firebase`. Your enviroment options to connect to Firebase must be found on Firebase online console but if you already created a project this code could be automatically imported.

* If project was previously created when you do the login then the your API credentials from your Firebase application CAN BE FOUND in your **enviroment.ts** file with the following:

```ts
export const environment = {
  firebase: {
    projectId: 'application-id-name',
    appId: 'your:application:id',
    storageBucket: 'application.appspot.com',
    apiKey: 'YourAPIkey',
    authDomain: 'your-application-domain.com',
    messagingSenderId: '1011509774849',
  },
  production: false
  ```
* In your **app.module** you must have the following three imports:
````ts
import { initializeApp, provideFirebaseApp } from '@angular/fire/app'; // App initialization
import { environment } from '../environments/environment'; // Your API credentials
import { provideFirestore, getFirestore } from '@angular/fire/firestore'; // Access to Firestore DBs
````
And the @NgModule of app.module imports as:
````ts
imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
````

* OPTIONALLY. In order to avoid anonymus objects and TS problems you should use an Interfaz that matchs your DB records, like in this case: 
````ts
export default interface Empleados {
	id?: string
	name: string
	...
}
````

3) Need a service to stablisth the conection between your application and Firestore to make the CRUD. Check methods to know how it works:
````ts
import { Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { addDoc, doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Empleados } from '../interfaces/empleados';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  items!: Observable<any[]>;
	
  // Instance of the Firestore
  constructor(private firestore: Firestore ) { }

  // Create record - call the interface
  agregarEmpleado(empleado: Empleados): Promise<any> {
    // collection(yourFirestoreInitizalized, yourCollectionName)
    const emp = collection(this.firestore, 'empleados');
    return addDoc(emp, empleado);
  }

  // Update One record by id
  updateEmpleado(id: any, data: any) { 

    const docRef = doc(this.firestore, 'empleados', id);

    setDoc(docRef, {
      nombre: data.nombre,
      apellido: data.apellido,
      documento: data.documento,
      salario: data.salario,
      fechaActualizaci??n: Date(),
      fechaCreacion: data.fechaCreacion
    }).then(docRef => {
      console.log('document updated')
    }).catch(error => {
      console.log(error)
    });

  }

  // Delete record by id
  deleteEmpleado(id: string) { 
    const emp = doc(this.firestore, `empleados/${id}`);
    return deleteDoc(emp);
  }

  // Get records and explicity include the id otherwise it won't be retrieved
  getEmpleados() { 
    const emp = collection(this.firestore, 'empleados');
    this.items = collectionData(emp, { idField: 'id' });      

    return this.items;
  }

  // Get one record by id
  async getEmpleado(id:string | null) { 
    const docRef = doc(this.firestore, `empleados/${id}`);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  }
}
````

### Deploy to Firebase

1) First things first, you do the production build by `ng build`.
2) Install **once** Firebase tools if you have not done yet for every project `npm i -g firebase-tools`
3) You do the login on Firebase `firebase login`.
4) You mus intialize **every project** you work in `firebase init`.
You follow the instructions and choose whatever options that suites your needs but in short:
* You select Hosting service option.
* Use an existing project if already created on the Firebase online console if not just create it and follow new instructions.
* Choose your public directory name (like 'dist/empleado' as suggested)
* Select if application is SPA and configuration is done.
5) Finally upload the project, be sure you terminal is inside of your 'dist' folder and make `firebase deploy`. You do the deploy every time you need to update the project to upload the new version and for samll changes you can run `firebase serve` to test before deploying again.

### Update and deploy again

1) Basically you only need to do a new `firebase deploy` from your dist directory after you run a new `ng build` but it could happen that you have to do some new configurations if failed. First, pay attention to the directory of your build because coul be inside of another directory inside of the dist folder.
2) Check if you are logged into the firebase with `firebase login` and you coul also try a `firebase login --reauth` if in doubt.
3) Maybe you are ask to associate an alias to the project you want to update by `firebase target:apply an-alias-name your-project-name` in order to reconnect and do an update because you have to overwrite files.
4) You must complete the firebase.json in the root directory of the project with the following:

````json
{
    "hosting": [ {
        "target": "your-online-project-name",
        "public": "./dist/your-app"
      }]  
}
````
More information about configurations in the firebase.json in [Hosting deploy configuration](https://firebase.google.com/docs/hosting/full-config "Hosting deploy configuration")

5) Now you can try again `firebase deploy`.

---

## General notes

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
