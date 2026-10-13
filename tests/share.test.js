import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {defaults,example,calculate} from '../calculator.js';
import {encodeShare,decodeShare} from '../share.js';

const payloadHash=payload=>'#scenario='+Buffer.from(typeof payload==='string'?payload:JSON.stringify(payload),'utf8').toString('base64url');
const payload=delta=>({v:1,y:2026,d:delta});
function roundTrip(state,showZero=false) {
  const hash=encodeShare(state,showZero);
  const restored=decodeShare(hash);
  assert.deepEqual(restored,{state,showZero});
  assert.deepEqual(calculate(restored.state),calculate(state));
  return hash;
}
function advanced() {
  return {...defaults(),period:'year',output:'month',streams:[
    {name:'Zażółć gęślą jaźń 🧾',revenue:100000.01/12,cost:987.65123456789,period:'month',rate:'progressive'},
    {name:'Towary',revenue:34567.89,cost:1234.56,period:'year',rate:3},
    {name:'Wolny zawód',revenue:300000,cost:30000,period:'year',rate:17}
  ],zusMode:'custom',startMonths:7,months:['start','start','preferential','preferential','small','small','full','full','employment','employment','full','full'],
  sickness:false,fpExempt:true,accident:2.17,holiday:11,prevRevenue:70000,prevIncome:42000,prevDays:300,prevForm:'lump',smallEligible:true,
  otherIncome:111111.11,joint:true,spouseIncome:76543.21,deduction:1200.01,healthTreatment:'cost',paidOverride:true,paidLinear:14321.98,paidLump:8888.87,
  cardEnabled:true,cardTax:777.13,linearEligibility:'eligible',lumpEligibility:'ineligible'};
}

test('share v1 reconstructs frozen defaults and default links stay compact',()=>{
  const hash=roundTrip(defaults());
  assert.equal(hash,payloadHash({v:1,y:2026,d:{}}));
  assert.ok(hash.length<100);
});
test('example share contains all rows and stays below 1000 characters',()=>{
  const hash=roundTrip(example());
  assert.ok(hash.length<1000);
  assert.match(hash,/^#scenario=[A-Za-z0-9_-]+$/);
});
test('all advanced state fields and calculated results survive exactly',()=>{
  roundTrip(advanced(),true);
  const source=advanced();
  assert.deepEqual(Object.keys(decodeShare(encodeShare(source)).state).sort(),Object.keys(source).sort());
});
test('plain state objects from another browser realm can be shared',()=>{
  const source=advanced();
  const otherRealm=runInNewContext('JSON.parse(data)',{data:JSON.stringify(source)});
  assert.deepEqual(decodeShare(encodeShare(otherRealm,true)),{state:source,showZero:true});
});
test('every supported lump rate can be shared, including the progressive pair',()=>{
  const state=defaults();
  state.streams=[17,15,14,12,10,8.5,5.5,3,'progressive'].map(rate=>({name:String(rate),revenue:150000,cost:1000,period:'year',rate}));
  roundTrip(state);
});
test('share preserves fractional amounts without currency rounding',()=>{
  const state=defaults();
  state.streams[0].revenue=100000.01/12;
  state.streams[0].cost=0.000000123456789;
  state.otherIncome=120000.49999999999;
  roundTrip(state);
});
test('Unicode, emoji and HTML-looking names remain text and are lossless',()=>{
  for(const name of ['Zażółć gęślą jaźń 🧾🚀','<img src=x onerror=alert(1)>','中文 日本語 العربية','\ud800','']){
    const state=example();state.streams[0].name=name;roundTrip(state);
  }
});
test('zero-year display flag is explicit and strictly boolean',()=>{
  assert.equal(decodeShare(encodeShare(defaults())).showZero,false);
  roundTrip(defaults(),true);
  assert.equal(decodeShare(payloadHash({...payload({}),z:false})).showZero,false);
  for(const z of [0,1,'true',null,{},[]]){
    assert.throws(()=>encodeShare(defaults(),z));
    assert.throws(()=>decodeShare(payloadHash({...payload({}),z})));
  }
});
test('ordinary anchors do not import scenarios',()=>{
  for(const hash of ['', '#', '#results', '#methodology', '#scenario-help'])assert.equal(decodeShare(hash),null);
  for(const hash of ['#scenario','#scenario=','#scenario=%%%','#scenario=aaaa=','#scenario=a','#scenario=e30&x=1'])assert.throws(()=>decodeShare(hash));
});
test('unsupported version/year, envelope extras and missing fields are rejected',()=>{
  for(const object of [{v:2,y:2026,d:{}},{v:1,y:2027,d:{}},{v:'1',y:2026,d:{}},{v:1,y:'2026',d:{}},{v:1,y:2026,d:{},extra:1},{y:2026,d:{}},{v:1,d:{}},{v:1,y:2026},[],null])assert.throws(()=>decodeShare(payloadHash(object)));
});
test('unknown keys and prototype-pollution names never enter state',()=>{
  for(const json of [
    '{"v":1,"y":2026,"d":{"__proto__":{"polluted":true}}}',
    '{"v":1,"y":2026,"d":{"constructor":{"prototype":{"polluted":true}}}}',
    '{"v":1,"y":2026,"d":{},"__proto__":{"polluted":true}}',
    '{"v":1,"y":2026,"d":{"prototype":1}}',
    '{"v":1,"y":2026,"d":{"unrecognized":1}}'
  ])assert.throws(()=>decodeShare(payloadHash(json)));
  assert.equal({}.polluted,undefined);
  assert.throws(()=>encodeShare({...defaults(),__unknown:true}));
  const state=defaults();Object.defineProperty(state,'__proto__',{value:{polluted:true},enumerable:true});
  assert.throws(()=>encodeShare(state));
});
test('strict enum and boolean validation rejects values tolerated by coercion',()=>{
  for(const delta of [{p:'week'},{o:'week'},{s:1},{f:'false'},{se:null},{j:0},{po:1},{ce:'true'},{u:'toString'},{pf:'scale'},{ht:'anything'},{le:true},{re:'yes'},{m:Array(12).fill('__proto__')}])assert.throws(()=>decodeShare(payloadHash(payload(delta))));
});
test('all numeric fields reject strings, null and non-finite inputs',()=>{
  const keys=['startMonths','accident','holiday','prevRevenue','prevIncome','prevDays','otherIncome','spouseIncome','deduction','paidLinear','paidLump','cardTax'];
  for(const key of keys)for(const value of ['1',null,NaN,Infinity])assert.throws(()=>encodeShare({...defaults(),[key]:value}));
  for(const delta of [{oi:-1},{si:1e12+1},{pd:0},{a:8},{i:0.09},{h:12}])assert.throws(()=>decodeShare(payloadHash(payload(delta))));
});
test('row schema enforces rate type, period, name limit and exact tuple length',()=>{
  for(const row of [['x',1,0,'month','12'],['x',1,0,'week',12],['x',1,0,'month',12.5],['x'.repeat(81),1,0,'month',12],[null,1,0,'month',12],['x',null,0,'month',12],['x',-1,0,'month',12],['x',1e12+1,0,'month',12],['x',1,0,'month'],['x',1,0,'month',12,'extra'],{name:'x'}])assert.throws(()=>decodeShare(payloadHash(payload({r:[row]}))));
  const state=defaults();state.streams[0].extra='not allowed';assert.throws(()=>encodeShare(state));
});
test('stream and month counts are bounded and valid limits round-trip',()=>{
  for(const delta of [{r:[]},{r:Array(31).fill(['x',0,0,'month',12])},{m:Array(11).fill('full')},{m:Array(13).fill('full')},{r:{}},{m:{}}])assert.throws(()=>decodeShare(payloadHash(payload(delta))));
  const state=defaults();state.streams=Array.from({length:30},(_,i)=>({name:'🧾'.repeat(40),revenue:i,cost:0,period:'year',rate:12}));roundTrip(state);
});
test('engine model validation also applies to shared scenarios',()=>{
  for(const delta of [{u:'small',pr:120001},{u:'small',pd:59},{ht:'cost',po:false},{u:'custom',m:Array(12).fill('start')}])assert.throws(()=>decodeShare(payloadHash(payload(delta))));
});
test('malformed, invalid UTF-8, non-canonical and oversized hashes fail safely',()=>{
  for(const hash of [payloadHash('{broken'), '#scenario=_w', '#scenario=Zh', '#scenario='+'A'.repeat(24000),null,42]){
    assert.throws(()=>decodeShare(hash),error=>error instanceof Error&&/Nieprawidłowy/.test(error.message)&&!error.message.includes('broken'));
  }
});
test('decoded states and source states never share mutable default arrays',()=>{
  const source=defaults();const encoded=encodeShare(source);const first=decodeShare(encoded).state;
  first.months[0]='start';first.streams[0].name='Changed';
  assert.deepEqual(decodeShare(encoded).state,defaults());
  assert.deepEqual(source,defaults());
});
test('missing fields, accessors, class instances, sparse arrays and extra array keys are rejected',()=>{
  const missing=defaults();delete missing.output;assert.throws(()=>encodeShare(missing));
  const getter=defaults();Object.defineProperty(getter,'output',{get(){throw new Error('not executed');}});assert.throws(()=>encodeShare(getter),/Nieprawidłowy/);
  class Scenario {constructor(){Object.assign(this,defaults());}}
  assert.throws(()=>encodeShare(new Scenario()));
  const sparse=defaults();delete sparse.months[0];assert.throws(()=>encodeShare(sparse));
  const extra=defaults();extra.months.extra=true;assert.throws(()=>encodeShare(extra));
});
