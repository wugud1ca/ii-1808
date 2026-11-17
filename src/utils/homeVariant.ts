const APPROVED_DELIVERY_PROOF_HOME_ROUTES = new Set([
  '/',
  '/index_test_15112026',
]);

export function isDeliveryProofHome(route: string): boolean {
  return APPROVED_DELIVERY_PROOF_HOME_ROUTES.has(route);
}
