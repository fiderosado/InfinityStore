```markdown
# InfinityStore

InfinityStore es un hook de React que permite gestionar múltiples estados en un solo hook, almacenando el estado sin límites.

## Instalación

Para instalar las dependencias, ejecuta:

```bash
npm install
```

## Uso

A continuación se muestra un ejemplo de cómo usar el hook `InfinityStore`:

```javascript
import React from 'react';
import InfinityStore from './InfinityStore';

const App = () => {
  const { state, store } = InfinityStore('appState', { count: 0 });

  const increment = () => {
    state.count.set(prevCount => prevCount + 1);
  };

  return (
    <div>
      <h1>Count: {state.count()}</h1>
      <button onClick={increment}>Increment</button>
    </div>
  );
};

export default App;
```

## API

### InfinityStore

```javascript
InfinityStore(name, initialStore, callback)
```

- `name` (string): El nombre utilizado como clave en `localStorage` y `BroadcastChannel`.
- `initialStore` (object): El estado inicial.
- `callback` (function): Una función opcional que se ejecuta cuando se accede a un estado.

#### Retorna

- `state` (object): Un proxy que permite acceder y actualizar el estado.
- `store` (function): Una función que permite obtener el estado actual.

## Scripts

- `build`: Construye el proyecto usando Rollup.
- `prepublishOnly`: Ejecuta el script de construcción antes de publicar.
- `test`: Ejecuta las pruebas usando Vitest.
- `coverage`: Ejecuta las pruebas y genera un informe de cobertura.

## Licencia

Este proyecto está licenciado bajo la licencia MIT.
```