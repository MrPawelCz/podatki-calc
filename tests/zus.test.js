import test from 'node:test';
import assert from 'node:assert/strict';
import { defaults, smallZus, zusMonth, zusYear, getPlan, lumpHealth, calculate, validate } from '../calculator.js';

// Independent fixtures: official ZUS 2026 contribution table and hand calculations.
// Source trail and annual-health rounding qualification: docs/ZUS-SOURCES.md.
const settings = extra => ({ ...defaults(), ...extra });
const income = (revenue, extra = {}) => settings({
  streams: [{ name: 'Test', revenue, cost: 0, period: 'year', rate: 12 }],
  ...extra,
});
const result = (s, id) => {
  const calculation = calculate(s);
  assert.deepEqual(calculation.errors, []);
  return calculation.results.find(r => r.id === id);
};

test('full ZUS: each official component is rounded separately; FP is separate', () => {
  const m = zusMonth('full', settings());
  assert.deepEqual(
    [m.base, m.pension, m.disability, m.accident, m.sickness, m.social, m.fp, m.total],
    [5652, 1103.27, 452.16, 94.39, 138.47, 1788.29, 138.47, 1926.76],
  );
  const withoutSickness = zusMonth('full', settings({ sickness: false }));
  assert.equal(withoutSickness.social, 1649.82);
  assert.equal(withoutSickness.total, 1788.29);
});

test('preferential ZUS: no FP on a standalone below-minimum basis', () => {
  const m = zusMonth('preferential', settings());
  assert.deepEqual(
    [m.base, m.pension, m.disability, m.accident, m.sickness, m.fp, m.total],
    [1441.8, 281.44, 115.34, 24.08, 35.32, 0, 456.18],
  );
  assert.equal(zusMonth('preferential', settings({ sickness: false })).total, 420.86);
});

test('FP age/exemption switch leaves the social insurance components unchanged', () => {
  const m = zusMonth('full', settings({ fpExempt: true }));
  assert.equal(m.fp, 0);
  assert.equal(m.social, 1788.29);
  assert.equal(m.total, 1788.29);
});

test('start relief is followed by preferential contributions, not twelve free months', () => {
  const s = settings({ zusMode: 'start', startMonths: 6 });
  assert.deepEqual(getPlan(s), [
    'start', 'start', 'start', 'start', 'start', 'start',
    'preferential', 'preferential', 'preferential', 'preferential', 'preferential', 'preferential',
  ]);
  assert.equal(zusYear(s).total, 2737.08);
  assert.equal(result(s, 'scale').health, 5190.48);
  assert.ok(validate(settings({ zusMode: 'start', startMonths: 12 })).length);
});

test('MZ+: 60,000 previous income / 365 days uses two intermediate roundings', () => {
  const s = settings({ prevRevenue: 100000, prevIncome: 60000, prevDays: 365, smallEligible: true });
  const mz = smallZus(s);
  assert.equal(mz.monthly, 4931.51);
  assert.equal(mz.base, 2465.76);
  assert.equal(mz.eligible, true);
  const m = zusMonth('small', s);
  assert.deepEqual([m.pension, m.disability, m.accident, m.sickness, m.fp, m.total],
    [481.32, 197.26, 41.18, 60.41, 0, 780.17]);
});

test('MZ+ full-year 120,000 inclusive threshold is not rejected by floating arithmetic', () => {
  const mz = smallZus(settings({ prevRevenue: 120000, prevDays: 365, smallEligible: true }));
  assert.equal(mz.limit, 120000);
  assert.equal(mz.eligible, true);
  assert.equal(smallZus(settings({ prevRevenue: 120000.01, smallEligible: true })).eligible, false);
});

test('MZ+ proportional revenue limit is rounded to grosz before eligibility comparison', () => {
  const s = settings({ prevRevenue: 19726.03, prevIncome: 10000, prevDays: 60, smallEligible: true });
  assert.equal(smallZus(s).limit, 19726.03);
  assert.equal(smallZus(s).eligible, true);
  assert.equal(smallZus({ ...s, prevRevenue: 19726.04 }).eligible, false);
});

test('MZ+ prior-year lump-sum income is itself rounded before average and half-base', () => {
  // 11,534.41 / 2 = 5,767.205 -> 5,767.21;
  // 5,767.21 / 60 * 30 = 2,883.605 -> 2,883.61;
  // half = 1,441.805 -> 1,441.81 (not the 1,441.80 minimum).
  const mz = smallZus(settings({ prevForm: 'lump', prevRevenue: 11534.41, prevDays: 60, smallEligible: true }));
  assert.equal(mz.income, 5767.21);
  assert.equal(mz.monthly, 2883.61);
  assert.equal(mz.base, 1441.81);
});

test('MZ+ decimal half-grosz rounding is not pushed downward by binary division', () => {
  // 15,360.17 / 2 -> 7,680.09; half -> 3,840.05; half -> 1,920.03.
  const mz = smallZus(settings({ prevForm: 'lump', prevRevenue: 15360.17, prevDays: 60, smallEligible: true }));
  assert.equal(mz.income, 7680.09);
  assert.equal(mz.monthly, 3840.05);
  assert.equal(mz.base, 1920.03);
});

test('MZ+ requires 60 days and the remaining eligibility conditions', () => {
  assert.equal(smallZus(settings({ prevRevenue: 10000, prevDays: 59, smallEligible: true })).eligible, false);
  assert.equal(smallZus(settings({ prevRevenue: 10000, prevDays: 60, smallEligible: false })).eligible, false);
  assert.ok(validate(settings({ zusMode: 'small', smallEligible: false })).length);
});

test('MZ+ FP begins at 4,806 basis, not automatically for every MZ+ user', () => {
  const s = settings({ prevIncome: 116946, prevRevenue: 120000, smallEligible: true });
  const m = zusMonth('small', s);
  assert.equal(m.base, 4806);
  assert.equal(m.social, 1520.62);
  assert.equal(m.fp, 117.75);
  assert.equal(m.total, 1638.37);
  assert.equal(zusMonth('small', { ...s, prevIncome: 116945.76 }).fp, 0);
});

test('full-year health minimum is the 2026 contribution-year minimum, not calendar Jan–Dec sum', () => {
  const s = income(0, { zusMode: 'employment' });
  assert.equal(result(s, 'scale').health, 5190.48);
  assert.equal(result(s, 'linear').health, 5190.48);
  assert.notEqual(result(s, 'scale').health, 5072.90);
});

test('lump health thresholds are inclusive at 60k and 300k after only social deduction', () => {
  assert.equal(lumpHealth(60000, 0).tier, 0);
  assert.equal(lumpHealth(60000.01, 0).tier, 1);
  assert.equal(lumpHealth(300000, 0).tier, 1);
  assert.equal(lumpHealth(300000.01, 0).tier, 2);
  const r = result(income(82000), 'lump');
  // 82,000 - 21,459.48 social = 60,540.52. FP must NOT also reduce this.
  assert.equal(r.healthBase, 60540.52);
  assert.equal(r.tier, 1);
});

test('annual lump health rounds annual assessment rather than twelve rounded monthly payments', () => {
  // Model extrapolates the verified 2025 ZUS-calculator rounding convention to
  // official 2026 assessment bases. These are not claimed as 2026 calculator outputs.
  const low = lumpHealth(50000, 0), mid = lumpHealth(100000, 0), high = lumpHealth(400000, 0);
  assert.deepEqual([low.annual, mid.annual, high.annual], [5980.15, 9966.93, 17940.47]);
  assert.deepEqual([low.monthly, mid.monthly, high.monthly], [498.35, 830.58, 1495.04]);
  assert.notEqual(low.annual, 5980.20);
});

test('contribution holiday removes one month of social and FP, but no health minimum', () => {
  const s = income(0, { holiday: 0 });
  const year = zusYear(s);
  assert.equal(year.social, 19671.19);
  assert.equal(year.fp, 1523.17);
  assert.equal(year.total, 21194.36);
  assert.equal(year.waived, 1926.76);
  assert.equal(result(s, 'scale').health, 5190.48);
});

test('holiday also removes social tax/progression deduction and can raise annual lump health tier', () => {
  const before = result(income(81459.48), 'lump');
  const after = result(income(81459.48, { holiday: 0 }), 'lump');
  assert.equal(before.healthBase, 60000);
  assert.equal(before.health, 5980.15);
  assert.equal(after.healthBase, 61788.29);
  assert.equal(after.health, 9966.93);
  assert.equal(after.socialDeduction, 19671.19);
  assert.ok(after.burden > before.burden);
});

test('linear health paid as PIT deduction does not reduce health assessment; KUP does', () => {
  const s = income(180000, { zusMode: 'employment', paidOverride: true, paidLinear: 10000 });
  const deduction = result({ ...s, healthTreatment: 'deduction' }, 'linear');
  const cost = result({ ...s, healthTreatment: 'cost' }, 'linear');
  assert.equal(deduction.health, 8820);
  assert.equal(cost.health, 8330);
  assert.equal(deduction.pit, 32300);
  assert.equal(cost.pit, 32300);
});

test('linear health KUP uses the 14,100 shared limit and requires actual paid override', () => {
  assert.ok(validate(income(180000, { healthTreatment: 'cost' })).length);
  const r = result(income(180000, {
    zusMode: 'employment', paidOverride: true, paidLinear: 20000, healthTreatment: 'cost',
  }), 'linear');
  assert.equal(r.healthDeduction, 14100);
  assert.equal(r.healthBase, 165900);
  assert.equal(r.health, 8129.10);
  assert.equal(r.pit, 31521);
});
