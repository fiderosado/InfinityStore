# InfinityStore

InfinityStore is a React hook that allows managing multiple states in a single hook, storing the state without limits.

## Installation

To install dependencies, run:

```bash
npm install
```
```bash
yarn add infinitystore
```

## Usage

Below is an example of how to use the `InfinityStore` hook.

### Creating the Store

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

### Using in a Component

```javascript
export default function Component({ className }) {

  const { store , state } = Store();

  const addCart = (box) => store.cart.add(box);
  const clearCart = () => store.cart.removeAll();
  const cartPlus = (id , quantity ) => store.cart.increment(id , stepQuantity);
  const cartMinus = (id) => store.cart.decrement(id);
  const deleteOnCart = (id) => store.cart.remove(id);

  useEffect(() => {
    console.log("Cart state has changed:", state());
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
      <h1>Add Product</h1>
      <button onClick={() => addCart(boxProduct)}>Add to Cart</button>
      <h1>Product List</h1>
      <ul>
          {
            (state().cart ?? []).map((item , index) => (
              <li key={item.id}>
                <span>{item.product.name} - ${item.product.price}</span>
                <button onClick={() => cartPlus(item.product.id, 1)}>+</button>
                <button onClick={() => cartMinus(item.product.id)}>-</button>
                <button onClick={() => deleteOnCart(item.product.id)}>Remove</button>
              </li>
            ))
          }
      </ul>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  )
}
```

## API

### InfinityStore

```javascript
const Store = () => InfinityStore( name, initialStore , callback )
```

- `name` (string): The name used as a key in `localStorage` and `BroadcastChannel`.
- `initialStore` (object): The initial state.
- `callback` (function): An optional function executed when accessing a state.

#### Returns

- `store` (object): A proxy that allows accessing and updating the state.
- `state` (function): A function that retrieves the current state.

## Scripts

- `build`: Builds the project using Rollup.
- `npx vitest`: Runs tests using Vitest.

## License

This project is licensed under the MIT License.

