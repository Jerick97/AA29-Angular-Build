import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Producto } from '../interface/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private fireStore:Firestore) { }

  addProducto(producto:Producto){
    const productoRef = collection(this.fireStore,'producto' );
    return addDoc(productoRef, producto);
  }

  getProducto():Observable<Producto[]> {
    const productoRef = collection(this.fireStore, 'producto')
    return collectionData(productoRef, {idField:'id'}) as Observable<Producto[]>
  }


  deleteProducto(producto:Producto){
    const productoRef = doc(this.fireStore, `producto/${producto.id}`)
    return deleteDoc(productoRef);
  }
}
