Here is the `README.md` file for the `InfinityStore` hook, including usage code:


# InfinityStore

InfinityStore is a React hook that allows you to manage multiple states in a single hook, storing the state without limits.

## Installation
### 1. Install from npm

First, install the package from npm:

```bash
npm install infinitystore
```
## Usage
This example shows the use of InfinityStore to manage a shopping cart.
In the first step we will create a Store to initialize an instance, declare custom functions to manage the state.
The state is available in the localStorage and will be synchronized with the BroadcastChannel.

### Store.js
```javascript
// store.js
import InfinityStore from './InfinityStore';
/***
 * InfinityStore is a powerful hook that allows you to manage multiple states in a single React hook for managing a state storage without limits
 * @param name {string} name used as key in localStorage and BroadcastChannel
 * @param initialStore {object} initial state
 * @param callback {function} function executed when accessing a state
 * @returns {{state: null, store: ((function(*): (unknown))|*)}|(function(): *)|((function(): {handler: string}) & {get: (function(): boolean), put: put})}
 * @constructor
 */
const Instance = () => InfinityStore(
  "store-cart-market" , 
  { cart: [] } ,
  (state) => ({
    /* function to add an item to the cart */
    add: (item) => {
      state.cart.set((prevCart) => [...prevCart , item]);
    } ,
    /* function to remove an item from the cart */
    remove: (id) => {
      state.cart.set((prevCart) => prevCart.filter((item) => item.id !== id));
    }
  })
);

```
### 2. Import the store
### CartExample.js
```javascript
// We import the store
import Instance from './store';
/***
 * We must call the state , then the store object,
 * and then use the available functions
 */
const CartExample = () => {
  const { state , store } = Instance();
    return (
        <div>
        <h1>Carrito de compras</h1>
        <ul>
          {/* we print the cart items */}
            {store().cart.map((item) => (
            <li key={item.id}>
                {item.name} - ${item.price}
                <button onClick={() => state.cart.remove(item.id)}>Eliminar</button>
            </li>
            ))}
        </ul>
          {/* we add new items to the cart */}
        <button onClick={() => state.cart.add({ id: Date.now() , name: "Producto" , price: 100 })}>Agregar producto</button>
        </div>
    );
};
  
```

## API

### InfinityStore

```javascript
InfinityStore(name, initialStore, callback)
```

- `name` (string): The name used as the key in `localStorage` and `BroadcastChannel`.
- `initialStore` (object): The initial state.
- `callback` (function): An optional function that is executed when accessing a state.

#### Returns

- `state` (object): A proxy that allows accessing and updating the state.
- `store` (function): A function that allows obtaining the current state.

## Scripts

- `build`: Builds the project using Rollup.
- `prepublishOnly`: Runs the build script before publishing.
- `test`: Runs tests using Vitest.
- `coverage`: Runs tests and generates a coverage report.

## License

This project is licensed under the MIT License.
```