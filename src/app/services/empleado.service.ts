import { Injectable } from '@angular/core';
import { collection, collectionData, docSnapshots, Firestore } from '@angular/fire/firestore';
import { addDoc, doc, deleteDoc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { map, Observable } from 'rxjs';
import { Empleados } from '../interfaces/empleados';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  items!: Observable<any[]>;

  constructor(private firestore: Firestore ) { }

  // Create record
  agregarEmpleado(empleado: Empleados): Promise<any> {
    const emp = collection(this.firestore, 'empleados');
    return addDoc(emp, empleado);
  }

  // Update record
  updateEmpleado(id: any, data: any) { // Promise<any>

    const docRef = doc(this.firestore, 'empleados', id);

    setDoc(docRef, {
      nombre: data.nombre,
      apellido: data.apellido,
      documento: data.documento,
      salario: data.salario,
      fechaActualización: Date(),
      fechaCreacion: data.fechaCreacion
    }).then(docRef => {
      console.log('document updated')
    }).catch(error => {
      console.log(error)
    });

  }

  // Delete record
  deleteEmpleado(id: string) { // : Promise<any>
    const emp = doc(this.firestore, `empleados/${id}`);
    return deleteDoc(emp);
  }

  // Get record
  getEmpleados() { // Observable<any>
    const emp = collection(this.firestore, 'empleados');
    this.items = collectionData(emp, { idField: 'id' });      

    return this.items;
  }

  async getEmpleado(id:string | null) { // :Observable<any> ... <Empleados>
    const docRef = doc(this.firestore, `empleados/${id}`);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  }
}
