import assert from 'node:assert/strict';
import test from 'node:test';
import type { DailyArrival } from '../data/dailyArrivals';

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

const storage = new MemoryStorage();
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: storage,
});

const { toastCenter } = await import('./toastCenter');

const arrival: DailyArrival = {
  ttn: 'TEST-1',
  photo: '/test.webp',
  places: 1,
  weight: 10,
  volume: 0.1,
};

test('TTN suppression persists, clears the current toast and blocks new toasts', () => {
  toastCenter.setTtnSuppressed(false);
  toastCenter.setTtn(arrival);
  assert.equal(toastCenter.ttn, arrival);

  toastCenter.setTtnSuppressed(true);

  assert.equal(toastCenter.ttnSuppressed, true);
  assert.equal(storage.getItem('et-no-arrival-toasts'), '1');
  assert.equal(toastCenter.ttn, null);

  toastCenter.setTtn(arrival);
  assert.equal(toastCenter.ttn, null);
});

test('turning suppression off persists the choice and allows TTN toasts again', () => {
  toastCenter.setTtnSuppressed(false);

  assert.equal(toastCenter.ttnSuppressed, false);
  assert.equal(storage.getItem('et-no-arrival-toasts'), '0');

  toastCenter.setTtn(arrival);
  assert.equal(toastCenter.ttn, arrival);
  toastCenter.setTtn(null);
});
