import test from 'node:test';
import assert from 'node:assert/strict';
import {
  defaults, calculate, scaleTax, jointTax, solidarity, lumpTax, validate,
} from '../calculator.js';

// Independently calculated examples; all inputs are fictional.
// Sources and model limits: docs/PIT-SOURCES.md.
const stream = (revenue, rate = 12, cost = 0, period = 'year') =>
  ({ name: 'Test', revenue, rate, cost, period });
const state = overrides => ({
  ...defaults(), zusMode: 'employment', paidOverride: true,
  paidLinear: 0, paidLump: 0, streams: [stream(100000)], ...overrides,
});
const result = overrides => {
  const out = calculate(state(overrides));
  assert.deepEqual(out.errors, []);
  return out;
};
const form = (out, id) => out.results.find(r => r.id === id);

test('scale: free amount, threshold and second band', () => {
  for (const [income, expected] of [[0, 0], [30000, 0], [120000, 10800], [150000, 20400]]) {
    assert.equal(scaleTax(income), expected);
  }
});

test('scale rounds its taxable base before calculating and rounding tax', () => {
  assert.equal(scaleTax(30004.49), 0); // 30004 × 12% − 3600 = 0.48
  assert.equal(scaleTax(30004.50), 1); // 30005 × 12% − 3600 = 0.60
});

test('joint return rounds the half-base, not each half of final tax', () => {
  assert.equal(jointTax(200000, 0), 16800);
  assert.equal(jointTax(60009, 0), 1); // half 30004.50 → 30005; 2 × 0.60 → 1
  assert.equal(jointTax(240001, 0), 21601); // half 120000.50 → 120001
});

test('joint taxation is symmetric', () => {
  assert.equal(jointTax(70000, 110000), 14400);
  assert.equal(jointTax(110000, 70000), 14400);
});

test('two revenue sources share one free amount and one scale threshold', () => {
  const out = result({ streams: [stream(60000), stream(60000)] });
  assert.equal(form(out, 'scale').totalPit, 10800);
});

test('employment consumes the scale threshold; revenue is not employment cashflow', () => {
  const out = result({ streams: [stream(60000)], otherIncome: 100000 });
  assert.equal(out.baselinePit, 8400);
  assert.equal(form(out, 'scale').totalPit, 23600);
  assert.equal(form(out, 'scale').pit, 15200);
  assert.equal(out.revenue, 60000);
  assert.equal(form(out, 'linear').pit, 11400);
  assert.equal(form(out, 'linear').totalPit, 19800);
});

test('current business loss cannot offset salary income', () => {
  const out = result({ streams: [stream(10000, 12, 30000)], otherIncome: 100000 });
  assert.equal(form(out, 'scale').totalPit, 8400);
  assert.equal(form(out, 'scale').pit, 0);
  assert.equal(form(out, 'linear').pit, 0);
  assert.equal(form(out, 'lump').pit, 1200); // revenue, not profit
  assert.ok(form(out, 'scale').net < 0);
});

test('family comparison includes spouse tax in every form', () => {
  const out = result({ streams: [stream(200000)], joint: true, spouseIncome: 100000 });
  assert.equal(out.baselinePit, 8400);
  assert.equal(form(out, 'scale').totalPit, 40800); // 2 × scale(150000)
  assert.equal(form(out, 'scale').pit, 32400);
  assert.equal(form(out, 'linear').totalPit, 46400); // 38000 + 8400
  assert.equal(form(out, 'lump').totalPit, 32400); // 24000 + 8400
});

test('family tax saving can make marginal business PIT negative', () => {
  const out = result({ streams: [stream(10000)], joint: true, spouseIncome: 200000 });
  assert.equal(out.baselinePit, 36400);
  assert.equal(form(out, 'scale').totalPit, 18000);
  assert.equal(form(out, 'scale').pit, -18400);
});

test('linear tax has no tax-free amount', () => {
  assert.equal(form(result({ streams: [stream(10000)] }), 'linear').pit, 1900);
});

test('linear tax rounds base before rate', () => {
  assert.equal(form(result({ streams: [stream(102.49)] }), 'linear').pit, 19);
  assert.equal(form(result({ streams: [stream(102.50)] }), 'linear').pit, 20);
});

test('linear paid healthcare deduction has one 2026 ceiling of 14100', () => {
  const out = result({ streams: [stream(300000)], paidLinear: 20000 });
  const r = form(out, 'linear');
  assert.equal(r.healthDeduction, 14100);
  assert.equal(r.taxBase, 285900);
  assert.equal(r.pit, 54321);
});

test('healthcare deducted from income does not reduce healthcare assessment', () => {
  const out = result({ streams: [stream(200000)], paidLinear: 10000, healthTreatment: 'deduction' });
  assert.equal(form(out, 'linear').healthBase, 200000);
  assert.equal(form(out, 'linear').health, 9800);
  assert.equal(form(out, 'linear').pit, 36100);
});

test('healthcare booked as cost reduces healthcare base once, with actual paid input', () => {
  const out = result({ streams: [stream(200000)], paidLinear: 10000, healthTreatment: 'cost' });
  assert.equal(form(out, 'linear').healthBase, 190000);
  assert.equal(form(out, 'linear').health, 9310);
  assert.equal(form(out, 'linear').pit, 36100);
  assert.ok(validate(state({ healthTreatment: 'cost', paidOverride: false })).length);
});

test('lump-sum tax cannot deduct operating costs', () => {
  const low = result({ streams: [stream(100000, 12, 0)] });
  const high = result({ streams: [stream(100000, 12, 50000)] });
  assert.equal(form(low, 'lump').pit, 12000);
  assert.equal(form(high, 'lump').pit, 12000);
  assert.equal(Math.round(form(low, 'lump').net * 100) - Math.round(form(high, 'lump').net * 100), 5000000);
});

test('lump-sum healthcare deduction is half of paid contribution from revenue', () => {
  const out = result({ streams: [stream(100000)], paidLump: 10000 });
  assert.equal(form(out, 'lump').taxBase, 95000);
  assert.equal(form(out, 'lump').pit, 11400); // not 12000 − 5000
});

test('mixed lump-sum rates allocate deductions proportionately', () => {
  const out = lumpTax([stream(50000, 8.5), stream(50000, 12)], 10000);
  assert.equal(out.tax, 9225); // 45000 × 8.5% + 45000 × 12%
  assert.deepEqual(out.buckets.map(b => b.deducted), [5000, 5000]);
});

test('progressive lump threshold is applied BEFORE deductions', () => {
  const out = lumpTax([stream(120000, 'progressive')], 12000);
  assert.equal(out.tax, 9900); // 90000 × 8.5% + 18000 × 12.5%
  assert.deepEqual(out.buckets.map(b => b.gross), [100000, 20000]);
  assert.deepEqual(out.buckets.map(b => b.taxable), [90000, 18000]);
});

test('all progressive JDG streams share one 100000 threshold', () => {
  const out = lumpTax([stream(70000, 'progressive'), stream(70000, 'progressive')], 0);
  assert.equal(out.tax, 13500); // 8500 + 40000 × 12.5%
});

test('ordinary 8.5% services do not consume the progressive revenue threshold', () => {
  const out = lumpTax([stream(100000, 8.5), stream(100000, 'progressive')], 0);
  assert.equal(out.tax, 17000);
});

test('lump-sum deductions cannot create negative tax', () => {
  assert.equal(lumpTax([stream(1000, 17)], 5000).tax, 0);
  assert.equal(lumpTax([stream(0, 12)], 5000).tax, 0);
});

test('same-rate streams are aggregated before taxable-base rounding', () => {
  const out = lumpTax([stream(1.49, 17), stream(1.49, 17)], 0);
  assert.equal(out.tax, 1); // aggregated 2.98 → 3; 3 × 17% = .51 → 1
});

test('social contributions reduce scale and linear; FP does not reduce lump-sum revenue', () => {
  const out = result({ zusMode: 'full', streams: [stream(240000, 12, 40000)] });
  // Full monthly S=1788.29 and FP=138.47; annual 21459.48 / 1661.64.
  assert.equal(out.zus.social, 21459.48);
  assert.equal(out.zus.fp, 1661.64);
  assert.equal(form(out, 'scale').totalPit, 29001); // B 176878.88 → 176879
  assert.equal(form(out, 'linear').pit, 33607);
  assert.equal(form(out, 'lump').pit, 26225); // (240000−21459.48) → 218541 ×12%
});

test('income-deducted social contributions can reduce other scale income even with business loss', () => {
  const out = result({ zusMode: 'full', streams: [stream(10000, 12, 30000)], otherIncome: 100000 });
  assert.equal(form(out, 'scale').totalPit, 5825); // 100000 − 21459.48 → 78541
});

test('solidarity threshold and rate', () => {
  assert.equal(solidarity(1000000), 0);
  assert.equal(solidarity(1250000), 10000);
  assert.equal(solidarity(1000012.49), 0);
  assert.equal(solidarity(1000012.50), 1);
});

test('deducted linear healthcare also reduces solidarity base', () => {
  const out = result({ streams: [stream(1100000)], paidLinear: 20000 });
  assert.equal(form(out, 'scale').totalSolidarity, 4000);
  assert.equal(form(out, 'linear').totalSolidarity, 3436); // (1.1m−14100−1m) ×4%
  assert.equal(form(out, 'lump').totalSolidarity, 0);
});

test('ordinary extra deductions do not reduce solidarity', () => {
  const out = result({ streams: [stream(1100000)], deduction: 10000 });
  assert.equal(form(out, 'scale').totalSolidarity, 4000);
  assert.equal(form(out, 'linear').totalSolidarity, 4000);
});

test('joint PIT does not split one spouse solidarity income', () => {
  const out = result({ streams: [stream(1100000)], joint: true, spouseIncome: 0 });
  assert.equal(form(out, 'scale').totalSolidarity, 4000);
});

test('solidarity aggregates own business and own employment income', () => {
  const out = result({ streams: [stream(800000)], otherIncome: 400000 });
  assert.equal(form(out, 'scale').solidarity, 8000);
  assert.equal(form(out, 'linear').solidarity, 8000);
  assert.equal(form(out, 'lump').solidarity, 0);
});

test('card deducts 19% healthcare from monthly tax and rounds monthly', () => {
  const out = result({ cardEnabled: true, cardTax: 500 });
  assert.equal(form(out, 'card').pit, 5016); // (500−432.54×19%) → 418 ×12
});

test('annual and equivalent monthly source inputs give the same taxes', () => {
  const annual = result({ streams: [stream(240000, 12, 60000)] });
  const monthly = result({ streams: [stream(20000, 12, 5000, 'month')] });
  assert.deepEqual(annual.results, monthly.results);
});

test('non-finite/negative inputs are rejected; zero revenue never makes NaN tax', () => {
  assert.ok(validate(state({ streams: [stream(-1)] })).length);
  assert.ok(validate(state({ streams: [stream(Infinity)] })).length);
  const out = result({ streams: [stream(0)] });
  for (const r of out.results) {
    assert.equal(r.pit, 0);
    assert.ok(Number.isFinite(r.net));
    assert.equal(r.effective, 0);
  }
});
