/** Annual decision model for a full year of Polish sole-trader activity in 2026.
 * Sources, scope and payment assumptions: docs/METHODOLOGY.md.
 */
export const VERSION = '1.0.0';
export const YEAR = 2026;
export const RATES = [17,15,14,12,10,8.5,5.5,3];
export const MONTHS = ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'];
export const MODES = {full:'Pełny',preferential:'Preferencyjny',start:'Ulga na start',small:'Mały ZUS Plus',employment:'Bez społecznych'};
export const C = Object.freeze({fullBase:5652,preferentialBase:1441.8,minWage:4806,healthMin:432.54,healthJanuary:314.96,linearLimit:14100,healthLumpBases:[5537.18,9228.64,16611.55],healthLumpMonthly:[498.35,830.58,1495.04],cardHealth:432.54});
// Scale floating-point tolerance to the amount (e.g. 3840.0449999999996).
export const cents = n => Math.sign(n) * Math.round((Math.abs(n) + Number.EPSILON * Math.max(1,Math.abs(n))) * 100) / 100;
const pln = n => Math.round(n + Number.EPSILON);
const pos = n => Math.max(0,n);
const sum = ns => ns.reduce((a,b)=>a+b,0);
export function parseAmount(value){
  if(typeof value==='number') return Number.isFinite(value)?value:NaN;
  const s=String(value??'').trim().replace(/[\s\u00a0\u202f]/g,'').replace(',','.');
  if(!s) return 0;
  return /^\d+(\.\d{0,2})?$/.test(s)?Number(s):NaN;
}
export function defaults(){return {period:'month',output:'year',streams:[{name:'Działalność',revenue:0,cost:0,period:'month',rate:12}],zusMode:'full',startMonths:6,months:Array(12).fill('full'),sickness:true,fpExempt:false,accident:1.67,holiday:-1,prevRevenue:100000,prevIncome:60000,prevDays:365,prevForm:'income',smallEligible:false,otherIncome:0,joint:false,spouseIncome:0,deduction:0,healthTreatment:'deduction',paidOverride:false,paidLinear:0,paidLump:0,cardEnabled:false,cardTax:0};}
export function example(){return {...defaults(),streams:[{name:'Usługi IT',revenue:18000,cost:2500,period:'month',rate:12},{name:'Sprzedaż towarów',revenue:6000,cost:3800,period:'month',rate:3}]};}
export function annual(stream,key){return cents(stream[key]*(stream.period==='month'?12:1));}
export function scaleRaw(base){return base<=120000?pos(base*.12-3600):10800+(base-120000)*.32;}
export function scaleTax(base){return pln(scaleRaw(pln(pos(base))));}
export function jointTax(a,b){return pln(2*scaleRaw(pln((pos(a)+pos(b))/2)));}
export function solidarity(base){return pln(pos(base-1000000)*.04);}
export function smallZus(s){
  const income=s.prevForm==='income'?s.prevIncome:cents(s.prevRevenue*.5);
  const monthly=cents(income/s.prevDays*30);
  const base=Math.min(C.fullBase,Math.max(C.preferentialBase,cents(monthly*.5)));
  const limit=cents(120000/365*s.prevDays);
  return {income,monthly,base,limit,eligible:s.prevDays>=60&&s.prevDays<=365&&s.prevRevenue<=limit&&s.smallEligible};
}
export function getPlan(s){
  if(s.zusMode==='custom') return [...s.months];
  if(s.zusMode==='start') return MONTHS.map((_,i)=>i<s.startMonths?'start':'preferential');
  return Array(12).fill(s.zusMode);
}
export function zusMonth(mode,s,holiday=false){
  let base=mode==='full'?C.fullBase:mode==='preferential'?C.preferentialBase:mode==='small'?smallZus(s).base:0;
  const pension=cents(base*.1952),disability=cents(base*.08),sickness=s.sickness?cents(base*.0245):0,accident=cents(base*s.accident/100);
  const fp=!s.fpExempt&&base>=C.minWage?cents(base*.0245):0;
  const social=cents(pension+disability+sickness+accident);
  return {mode,base,pension,disability,sickness,accident,social:holiday?0:social,fp:holiday?0:fp,total:holiday?0:cents(social+fp),holiday,waived:holiday?cents(social+fp):0};
}
export function zusYear(s){
  const months=getPlan(s).map((mode,i)=>zusMonth(mode,s,i===s.holiday));
  return {months,social:cents(sum(months.map(m=>m.social))),fp:cents(sum(months.map(m=>m.fp))),total:cents(sum(months.map(m=>m.total))),waived:cents(sum(months.map(m=>m.waived)))};
}
export function lumpHealth(revenue,social){
  const base=pos(cents(revenue-social));
  const tier=base<=60000?0:base<=300000?1:2;
  // Annual settlement rounds the annual assessment, not twelve rounded payments.
  return {base,tier,monthly:C.healthLumpMonthly[tier],annual:cents(C.healthLumpBases[tier]*12*.09)};
}
export function lumpTax(streams,deductions){
  const byRate=new Map();let progressive=0;
  for(const s of streams){const r=annual(s,'revenue');if(s.rate==='progressive')progressive+=r;else byRate.set(Number(s.rate),(byRate.get(Number(s.rate))??0)+r);}
  // Threshold is applied to gross revenue BEFORE proportionate deductions.
  if(progressive){byRate.set(8.5,(byRate.get(8.5)??0)+Math.min(100000,progressive));byRate.set(12.5,(byRate.get(12.5)??0)+pos(progressive-100000));}
  const revenue=cents(sum([...byRate.values()]));const deduction=Math.min(revenue,deductions);
  const buckets=[...byRate].sort((a,b)=>a[0]-b[0]).map(([rate,gross])=>{
    const deducted=revenue?cents(deduction*gross/revenue):0;
    const taxable=pln(pos(gross-deducted));
    return {rate,gross:cents(gross),deducted,taxable,tax:taxable*rate/100};
  });
  return {tax:pln(sum(buckets.map(b=>b.tax))),deduction,buckets};
}
export function validate(s){
  const errors=[];
  if(!Array.isArray(s.streams)||s.streams.length<1||s.streams.length>30)return ['Dodaj od 1 do 30 pozycji przychodów.'];
  s.streams.forEach((r,i)=>{
    for(const key of ['revenue','cost'])if(!Number.isFinite(r[key])||r[key]<0||r[key]>1e12)errors.push(`Pozycja ${i+1}: ${key==='revenue'?'przychód':'koszt'} musi być nieujemną kwotą (maks. 1 bln zł).`);
    if(!['month','year'].includes(r.period))errors.push(`Pozycja ${i+1}: nieprawidłowy okres.`);
    if(r.rate!=='progressive'&&!RATES.includes(Number(r.rate)))errors.push(`Pozycja ${i+1}: wybierz stawkę ryczałtu.`);
  });
  for(const key of ['otherIncome','spouseIncome','deduction','paidLinear','paidLump','cardTax','prevRevenue','prevIncome'])if(!Number.isFinite(s[key])||s[key]<0||s[key]>1e12)errors.push('Kwoty muszą być poprawnymi, nieujemnymi liczbami (maks. 1 bln zł).');
  if(!Number.isInteger(s.prevDays)||s.prevDays<1||s.prevDays>365)errors.push('Liczba dni w 2025 musi wynosić 1–365.');
  if(!Number.isInteger(s.startMonths)||s.startMonths<0||s.startMonths>7)errors.push('Ulga na start: wpisz 0–7 miesięcy.');
  if(!Number.isFinite(s.accident)||s.accident<.1||s.accident>10)errors.push('Sprawdź stawkę wypadkową (0,1–10%).');
  if(!Number.isInteger(s.holiday)||s.holiday < -1||s.holiday>11)errors.push('Nieprawidłowy miesiąc wakacji składkowych.');
  if(![...Object.keys(MODES),'custom'].includes(s.zusMode))errors.push('Nieprawidłowy wariant ZUS.');
  if(!Array.isArray(s.months)||s.months.length!==12||s.months.some(m=>!MODES[m]))errors.push('Plan ZUS musi zawierać 12 poprawnych miesięcy.');
  if(!['income','lump','card'].includes(s.prevForm))errors.push('Sprawdź formę opodatkowania z poprzedniego roku.');
  if(!['deduction','cost'].includes(s.healthTreatment))errors.push('Sprawdź sposób odliczenia zdrowotnej.');
  if(errors.length)return [...new Set(errors)];
  const plan=getPlan(s);
  if(plan.filter(m=>m==='start').length>7)errors.push('Ulga na start nie może obejmować całego roku. Ustaw maksymalnie 6 pełnych miesięcy (7 z pierwszym niepełnym).');
  if(plan.includes('small')&&!smallZus(s).eligible)errors.push('Mały ZUS Plus: sprawdź limit przychodu, co najmniej 60 dni działalności w 2025 i potwierdź pozostałe warunki.');
  if(s.healthTreatment==='cost'&&!s.paidOverride)errors.push('Zdrowotna w kosztach liniowego wymaga wpisania faktycznie zapłaconej kwoty. Włącz własne kwoty albo wybierz odliczenie od dochodu.');
  return errors;
}
export function calculate(s){
  const errors=validate(s);if(errors.length)return {errors};
  const revenue=cents(sum(s.streams.map(r=>annual(r,'revenue'))));
  const costs=cents(sum(s.streams.map(r=>annual(r,'cost'))));
  const profit=cents(revenue-costs),zus=zusYear(s);
  const businessIncome=pos(profit-zus.fp-zus.social);
  const otherDeduction=Math.min(s.deduction,businessIncome);
  const spouse=s.joint?s.spouseIncome:0;
  const baselinePit=scaleTax(s.otherIncome)+scaleTax(spouse);
  const baselineDs=solidarity(s.otherIncome)+solidarity(spouse);
  const minHealth=cents(C.healthMin*12);
  const scaleHealth=cents(Math.max(minHealth,businessIncome*.09));
  // Social contributions are income deductions. Business losses do not offset employment.
  const scaleBase=pos(pos(profit-zus.fp)+s.otherIncome-zus.social-otherDeduction);
  const scaleDsBase=pos(pos(profit-zus.fp)+s.otherIncome-zus.social);
  const scalePit=s.joint?jointTax(scaleBase,spouse):scaleTax(scaleBase);
  const scaleDs=solidarity(scaleDsBase)+solidarity(spouse);
  const estimatedLinear=cents(Math.max(minHealth,businessIncome*.049));
  const paidLinear=s.paidOverride?s.paidLinear:estimatedLinear;
  const linearHealthDeduction=Math.min(paidLinear,C.linearLimit,businessIncome);
  const linearHealthBase=pos(businessIncome-(s.healthTreatment==='cost'?linearHealthDeduction:0));
  const linearHealth=cents(Math.max(minHealth,linearHealthBase*.049));
  const linearOtherDeduction=Math.min(otherDeduction,pos(businessIncome-linearHealthDeduction));
  const linearBase=pos(businessIncome-linearHealthDeduction-linearOtherDeduction);
  const linearPit=pln(pln(linearBase)*.19);
  const linearDs=solidarity(pos(businessIncome-linearHealthDeduction)+s.otherIncome)+solidarity(spouse);
  const lh=lumpHealth(revenue,zus.social);
  const paidLump=s.paidOverride?s.paidLump:lh.annual;
  const lt=lumpTax(s.streams,zus.social+paidLump*.5+s.deduction);
  const results=[
    {id:'scale',name:'Skala',rate:'12% / 32% · kwota wolna 30 tys.',health:scaleHealth,pit:cents(scalePit-baselinePit),totalPit:scalePit,solidarity:scaleDs-baselineDs,totalSolidarity:scaleDs,taxBase:scaleBase,healthBase:businessIncome,healthDeduction:0,otherDeduction,socialDeduction:zus.social},
    {id:'linear',name:'Liniowy',rate:'19% dochodu',health:linearHealth,pit:linearPit,totalPit:linearPit+baselinePit,solidarity:linearDs-baselineDs,totalSolidarity:linearDs,taxBase:linearBase,healthBase:linearHealthBase,healthDeduction:linearHealthDeduction,otherDeduction:linearOtherDeduction,socialDeduction:zus.social,paidHealth:paidLinear},
    {id:'lump',name:'Ryczałt',rate:'Stawki według przychodów',health:lh.annual,pit:lt.tax,totalPit:lt.tax+baselinePit,solidarity:0,totalSolidarity:baselineDs,taxBase:sum(lt.buckets.map(b=>b.taxable)),healthBase:lh.base,healthDeduction:cents(paidLump*.5),otherDeduction:s.deduction,socialDeduction:zus.social,paidHealth:paidLump,buckets:lt.buckets,tier:lh.tier,monthlyHealth:lh.monthly,totalDeduction:lt.deduction}
  ];
  if(s.cardEnabled){const health=cents(12*C.cardHealth),pit=12*pln(pos(s.cardTax-C.cardHealth*.19));results.push({id:'card',name:'Karta',rate:'Tylko kontynuacja · decyzja US',health,pit,totalPit:pit+baselinePit,solidarity:0,totalSolidarity:baselineDs,taxBase:0,healthBase:C.minWage,healthDeduction:cents(health*.19),otherDeduction:0,socialDeduction:0});}
  for(const r of results){r.social=zus.social;r.fp=zus.fp;r.burden=cents(r.pit+r.solidarity+r.health+zus.total);r.net=cents(profit-r.burden);r.effective=revenue?r.burden/revenue*100:0;}
  const ranking=[...results].sort((a,b)=>a.burden-b.burden);
  const warnings=[];
  if(!revenue)warnings.push('Przy zerowym przychodzie nadal naliczamy ZUS i minimalną zdrowotną za pełny rok aktywnej działalności.');
  if(costs>revenue)warnings.push('Działalność wykazuje stratę. Nie pomniejszamy nią dochodów z innych źródeł; koszty nadal obniżają kwotę pozostającą.');
  if(!s.paidOverride)warnings.push('Szacunek roczny: odliczenie zdrowotnej bazuje na składce należnej, nie rzeczywistych datach płatności. W zaawansowanych możesz wpisać składki zapłacone.');
  if(s.joint)warnings.push('Wspólne rozliczenie uwzględniamy tylko na skali. „Zostaje z JDG” obejmuje zmianę PIT gospodarstwa względem osobnego rozliczenia innych dochodów bez JDG. To nie pełny dochód netto rodziny.');
  if(s.otherIncome)warnings.push('Inny dochód na skali zwiększa podstawę PIT i ewentualnej daniny. Jego kwota nie jest dodawana do „zostaje z JDG”.');
  if(s.holiday>=0&&!zus.months[s.holiday].waived)warnings.push('W wybranym miesiącu wakacji brak składek społecznych do zwolnienia — brak dodatkowej oszczędności.');
  if(s.deduction>businessIncome)warnings.push('Odliczenia ograniczamy do dodatniej podstawy JDG; nadwyżka nie przechodzi na inne dochody. Dla ryczałtu obowiązuje limit przychodu.');
  if(getPlan(s).filter(m=>m==='start').length===7)warnings.push('7 miesięcy ulgi na start jest możliwe tylko z pierwszym niepełnym miesiącem. Sprawdź datę rozpoczęcia.');
  if(s.cardEnabled)warnings.push('Karta jest porównaniem wyłącznie dla uprawnionych do kontynuacji. Podatek za każdy miesiąc zaokrąglamy po odliczeniu 19% zapłaconej zdrowotnej.');
  return {errors:[],warnings,revenue,costs,profit,zus,results,ranking,baselinePit,baselineDs,small:smallZus(s)};
}
