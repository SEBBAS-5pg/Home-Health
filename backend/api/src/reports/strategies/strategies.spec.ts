import { REPORT_STRATEGIES } from './index';

describe('REPORT_STRATEGIES', () => {
  it('expone exactamente ventas, inventario y productos', () => {
    expect(Object.keys(REPORT_STRATEGIES).sort()).toEqual(['inventario', 'productos', 'ventas']);
  });

  it('todas las estrategias declaran columnas no vacías', () => {
    for (const [key, strategy] of Object.entries(REPORT_STRATEGIES)) {
      expect(strategy.type).toBe(key);
      expect(strategy.columns.length).toBeGreaterThan(0);
      for (const col of strategy.columns) {
        expect(col.key).toBeTruthy();
        expect(col.header).toBeTruthy();
      }
    }
  });
});
