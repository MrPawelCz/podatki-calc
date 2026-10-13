import test from 'node:test';
import assert from 'node:assert/strict';
import { defaults, calculate, lumpTax, cents, solidarity, validate } from '../calculator.js';

// Independent review fixtures, fictional amounts. Legal source trail and
// deliberately limited allocation policy: docs/TAX-REVIEW.md.
const stream=(revenue,cost=0,rate=12)=>({name:'Test audytu',revenue,cost,rate,period:'year'});
const state=overrides=>({...defaults(),streams:[stream(100000)],paidOverride:true,paidLinear:0,paidLump:0,...overrides});
const calculation=overrides=>{
  const out=calculate(state(overrides));
  assert.deepEqual(out.errors,[]);
  return out;
};
const form=(out,id)=>out.results.find(r=>r.id===id);

test('unconfirmed forms are conditional simulations, not an eligibility confirmation',()=>{
  const out=calculation({linearEligibility:'unconfirmed',lumpEligibility:'unconfirmed'});
  assert.equal(form(out,'scale').eligibility.status,'eligible');
  assert.equal(form(out,'linear').eligibility.status,'unconfirmed');
  assert.equal(form(out,'lump').eligibility.status,'unconfirmed');
  assert.equal(out.ranking.length,3);
  assert.ok(out.warnings.some(w=>w.includes('Niepotwierdzona dostępność')));
});

test('a declared unavailable form remains inspectable but cannot win the ranking',()=>{
  const out=calculation({streams:[stream(500000,0,3)],linearEligibility:'ineligible',lumpEligibility:'ineligible'});
  assert.equal(form(out,'lump').eligibility.status,'ineligible');
  assert.equal(out.results.length,3);
  assert.deepEqual(out.ranking.map(r=>r.id),['scale']);
});

test('legacy state without eligibility fields remains a conditional simulation',()=>{
  const s=state({}); delete s.linearEligibility; delete s.lumpEligibility;
  const out=calculate(s);
  assert.deepEqual(out.errors,[]);
  assert.equal(form(out,'lump').eligibility.status,'unconfirmed');
  assert.ok(validate(state({linearEligibility:'definitely'})).length);
});

test('unconfirmed MZ+ conditions flag every variant, numerical disqualification blocks results',()=>{
  const out=calculation({zusMode:'small',smallEligible:false,linearEligibility:'eligible',lumpEligibility:'eligible'});
  assert.ok(out.results.every(r=>r.eligibility.status==='unconfirmed'));
  assert.equal(out.small.numericalEligible,true);
  assert.equal(out.small.eligible,false);
  for(const overrides of [{prevRevenue:120000.01},{prevDays:59,prevRevenue:1000}]){
    const invalid=calculate(state({zusMode:'small',smallEligible:true,...overrides}));
    assert.ok(invalid.errors.length);
    assert.equal(invalid.ranking,undefined);
  }
});

test('MZ+ confirmation restores declared statuses, never an unavailable form',()=>{
  const out=calculation({zusMode:'small',smallEligible:true,linearEligibility:'eligible',lumpEligibility:'ineligible'});
  assert.equal(form(out,'linear').eligibility.status,'eligible');
  assert.equal(form(out,'lump').eligibility.status,'ineligible');
});

test('linear loss leaves paid social available against other scale income, not the business loss',()=>{
  const out=calculation({streams:[stream(10000,30000)],otherIncome:100000});
  const linear=form(out,'linear');
  assert.equal(out.baselinePit,8400);
  assert.equal(linear.businessPit,0);
  assert.equal(linear.socialDeduction,0);
  assert.equal(linear.otherSocialDeduction,21459.48);
  assert.equal(linear.totalPit,5825); // (100000−21459.48)→78541 ×12%−3600
  assert.equal(linear.pit,-2575);
  assert.equal(linear.health,5190.48);
});

test('linear health cost precedes social allocation and is not lost at zero taxable income',()=>{
  // Revenue−FP = 10000. Health KUP=5000; 5000 social absorbed by JDG,
  // unused social 16459.48 offset other income, not a business loss.
  const out=calculation({streams:[stream(11661.64)],otherIncome:100000,paidLinear:5000,healthTreatment:'cost'});
  const r=form(out,'linear');
  assert.equal(r.healthCost,5000);
  assert.equal(r.healthDeduction,5000);
  assert.equal(r.socialDeduction,5000);
  assert.equal(r.otherSocialDeduction,16459.48);
  assert.equal(r.totalPit,6425);
  assert.equal(r.health,5190.48);
});

test('eligible paid health KUP can increase a loss but cannot offset salary',()=>{
  const out=calculation({streams:[stream(10000,30000)],otherIncome:100000,paidLinear:20000,healthTreatment:'cost'});
  const r=form(out,'linear');
  assert.equal(r.healthCost,14100);
  assert.equal(r.businessLoss,35761.64); // 30000+1661.64+14100−10000
  assert.equal(r.totalPit,5825); // only social offset salary; KUP loss does not
  assert.equal(r.taxBase,0);
});

test('unused linear social affects solidarity through other own income',()=>{
  const out=calculation({streams:[stream(10000,30000)],otherIncome:1100000});
  assert.equal(out.baselineDs,4000);
  const r=form(out,'linear');
  assert.equal(r.totalSolidarity,3142); // (1100000−21459.48−1000000)→78541 ×4%
  assert.equal(r.solidarity,-858);
});

test('low lump-sum revenue absorbs social only once; remaining social reduce other income',()=>{
  const out=calculation({streams:[stream(10000)],otherIncome:100000,paidLump:10000});
  const r=form(out,'lump');
  assert.equal(r.socialDeduction,10000);
  assert.equal(r.otherSocialDeduction,11459.48);
  assert.equal(r.healthDeduction,0); // no revenue capacity remains
  assert.equal(r.businessPit,0);
  assert.equal(r.totalPit,7025); // (100000−11459.48)→88541 ×12%−3600
  assert.equal(r.pit,-1375);
  assert.equal(r.healthBase,0);
});

test('unused social is never transferred to a spouse or into a negative own base',()=>{
  const out=calculation({streams:[stream(0)],otherIncome:1000,joint:true,spouseIncome:100000});
  for(const id of ['linear','lump']){
    const r=form(out,id);
    assert.equal(r.otherSocialDeduction,1000);
    assert.equal(r.totalPit,8400); // spouse unchanged
  }
});

test('lump-sum displayed deductions are actually usable, not unused requested amounts',()=>{
  const out=calculation({zusMode:'employment',streams:[stream(1000)],paidLump:1000,deduction:2000});
  const r=form(out,'lump');
  assert.equal(r.healthDeduction,500);
  assert.equal(r.otherDeduction,500);
  assert.equal(r.totalDeduction,1000);
  assert.equal(r.taxBase,0);
});

test('proportional allocations conserve grosze for both one-cent and two-cent deductions',()=>{
  const streams=[stream(1,0,3),stream(1,0,8.5),stream(1,0,17)];
  for(const amount of [.01,.02,2.99,3]){
    const r=lumpTax(streams,amount);
    assert.equal(cents(r.buckets.reduce((a,b)=>a+b.deducted,0)),amount);
    assert.ok(r.buckets.every(b=>b.deducted>=0&&b.deducted<=b.gross));
  }
});

test('proportional allocation is invariant to stream order and same-rate splitting',()=>{
  const original=[stream(20.53,0,3),stream(9.27,0,17),stream(7.02,0,8.5)];
  const split=[stream(10,0,3),stream(7.02,0,8.5),stream(9.27,0,17),stream(10.53,0,3)];
  assert.deepEqual(lumpTax(original,5.57),lumpTax(split,5.57));
});

test('card social contributions reduce only other own scale income, never card tax',()=>{
  const out=calculation({cardEnabled:true,cardTax:500,otherIncome:100000});
  const r=form(out,'card');
  assert.equal(r.businessPit,5016);
  assert.equal(r.otherSocialDeduction,21459.48);
  assert.equal(r.totalPit,10841); // 5016 card +5825 scale
  assert.equal(r.pit,2441);
});

test('card displays a usable healthcare deduction, capped at its monthly decision',()=>{
  const r=form(calculation({cardEnabled:true,cardTax:50}),'card');
  assert.equal(r.healthDeduction,600);
  assert.equal(r.businessPit,0);
  assert.equal(r.health,5190.48);
});

test('solidarity obeys whole-zloty base rounding at both sides of a half threshold',()=>{
  assert.equal(solidarity(1000037.49),1);
  assert.equal(solidarity(1000037.50),2);
});

test('all forms use identical incremental household burden accounting',()=>{
  const out=calculation({streams:[stream(10000,30000)],otherIncome:1100000,joint:true,spouseIncome:100000,cardEnabled:true,cardTax:500});
  for(const r of out.results){
    assert.equal(r.pit,r.totalPit-out.baselinePit);
    assert.equal(r.solidarity,r.totalSolidarity-out.baselineDs);
    assert.equal(r.burden,cents(r.pit+r.solidarity+r.health+out.zus.total));
    assert.equal(r.net,cents(out.profit-r.burden));
  }
});
