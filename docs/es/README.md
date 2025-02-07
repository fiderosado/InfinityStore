
# InfinityStore

InfinityStore es un hook de React que permite gestionar múltiples estados en un solo hook, almacenando el estado sin límites.

## Instalación

Para instalar las dependencias, ejecuta:

```bash
npm install
```
```bash
yarn add infinitystore
```

## Uso

A continuación se muestra un ejemplo de cómo usar el hook `InfinityStore`

### Creando el Store

```javascript

"use client";
import InfinityStore from "infinitystore";

const Store = () => InfinityStore(
  "market" ,
  { cart: [] } ,
  (store) => ({
    add: (item) => {
      const existingItem = store.cart().find((i) => i.id === item.id);
      if ( existingItem ){
        store.cart.set((prevCart) => {
          return prevCart.map((i) => i.id === item.id ? { ...i , quantity: i.quantity + item.quantity } : i);
        });
      } else {
        store.cart.set((prevCart) => ([...prevCart , { ...item }]));
      }
    } ,
    removeAll: () => {
      store.cart.set([]);
    } ,
    remove: (id) => {
      store.cart.set((prevCart) => {
        return prevCart.filter((item) => item.id !== id);
      });
    } ,
    increment: (id , quantity = 1) => {
      const existingItem = store.cart().find((item) => item.id === id);
      if ( existingItem ){
        store.cart.set((prevCart) => {
          return prevCart.map((item) =>
            item.id === id ? { ...item , quantity: item.quantity + quantity } : item
          );
        });
      }
    } ,
    decrement: (id , quantity = 1) => {
      const existingItem = store.cart().find((item) => item.id === id);
      if ( existingItem ){
        const newQuantity = existingItem.quantity - quantity;
        if ( newQuantity <= 0 ){
          store.cart.set((prevCart) => {
            return prevCart.filter((item) => item.id !== id);
          });
        } else {
          store.cart.set((prevCart) => {
            return prevCart.map((item) => item.id === id ? { ...item , quantity: newQuantity } : item);
          });
        }
      }
    }
  })
);

export default Store;

```
### Uso en el componente
```javascript

export default function Component({ className }) {

  const { store , state } = Store();

  const addCart = (box) => store.cart.add(box);
  const clearCart = () => store.cart.removeAll();
  const cartPlus = (id , quantity ) => store.cart.increment(id , stepQuantity);
  const cartMinus = (id) => store.cart.decrement(id);
  const deleteOnCart = (id) => store.cart.remove(id);

  useEffect(() => {
    console.log("El estado del carrito ha cambiado:", state());
  }, [state()]);
  
  const boxProduct ={ 
    id: 1,
    quantity: 1 ,
    product : {
      name: "Product 1",
      price : 23
    }
  }
  
  return (
    <div>
      <h1>Añadir Producto</h1>
      <button onClick={() => addCart(boxProduct)}>Agregar al carrito</button>
      <h1>Lista de Productos</h1>
      <ul>
          {
            (state().cart ?? []).map((item , index) => (
              <li key={item.id}>
                <span>{item.product.name} - ${item.product.price}</span>
                <button onClick={() => cartPlus(item.product.id, 1)}>+</button>
                <button onClick={() => cartMinus(item.product.id)}>-</button>
                <button onClick={() => deleteOnCart(item.product.id)}>Eliminar</button>
              </li>
            ))
          }
      </ul>
      <button onClick={clearCart}>Vaciar carrito</button>
    </div>
  )
  
}
```

## API

### InfinityStore

```javascript
const Store = () => InfinityStore( name, initialStore , callback )
```

- `name` (string): El nombre utilizado como clave en `localStorage` y `BroadcastChannel`.
- `initialStore` (object): El estado inicial.
- `callback` (function): Una función opcional que se ejecuta cuando se accede a un estado.

#### Retorna

- `store` (object): Un proxy que permite acceder y actualizar el estado.
- `state` (function): Una función que permite obtener el estado actual.

## Scripts

- `build`: Construye el proyecto usando Rollup.
- `npx vitest`: Ejecuta las pruebas usando Vitest.

## Licencia

Este proyecto está licenciado bajo la licencia MIT.
```