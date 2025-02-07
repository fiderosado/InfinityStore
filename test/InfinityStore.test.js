import { renderHook, act } from '@testing-library/react'
import InfinityStore from '../src/InfinityStore';
import { describe, beforeEach , expect, it } from 'vitest'
describe('InfinityStore', () => {
  const name = 'testState';
  const initialStore = { count: 1 };

  beforeEach(() => {
    localStorage.clear();
  });

  it('debería inicializarse con el estado inicial', () => {
    const { result } = renderHook(() => InfinityStore(name, initialStore));
    expect(result.current.store.count()).toBe(1);
  });

  it('debería actualizar el estado correctamente', () => {
    const { result } = renderHook(() => InfinityStore(name, initialStore));

    act(() => {
      result.current.store.count.set(5);
    });
    const allData = result.current.state().count;
    expect(allData).toBe(5);
  });

  it('debería fusionar el estado inicial con el estado almacenado', () => {
    localStorage.setItem(name, JSON.stringify({ count: 10 }));
    const { result } = renderHook(() => InfinityStore(name, initialStore));

    expect(result.current.store.count()).toBe(10);
  });

  it('debería manejar actualizaciones de estado a través de localStorage', () => {
    const { result } = renderHook(() => InfinityStore(name, initialStore));

    act(() => {
      localStorage.setItem(name, JSON.stringify({ count: 20 }));
      window.dispatchEvent(new StorageEvent('storage', { key: name, newValue: JSON.stringify({ count: 20 }) }));
    });

    expect(result.current.state().count).toBe(20);
  });

  it('debería manejar actualizaciones de estado a través de BroadcastChannel', () => {
    const { result } = renderHook(() => InfinityStore(name, initialStore));
    act(() => {
      result.current.store.count.set(30);
      result.current.store.count.set(40);
    });

    expect(result.current.state().count).toBe(40);
  });
});