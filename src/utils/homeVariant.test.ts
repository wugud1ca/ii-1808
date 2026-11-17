import assert from 'node:assert/strict';
import test from 'node:test';
import { isDeliveryProofHome } from './homeVariant';

test('published main and dated test route use the approved delivery-proof homepage', () => {
  assert.equal(isDeliveryProofHome('/'), true);
  assert.equal(isDeliveryProofHome('/index_test_15112026'), true);
});

test('historical and non-home routes do not receive the approved homepage variant', () => {
  for (const route of ['/test2', '/original19102026', '/dostavka', '/kontakti']) {
    assert.equal(isDeliveryProofHome(route), false, route);
  }
});
