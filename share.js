import {validate} from './calculator.js?v=1.2.1';

// Public link format v1. Keep this snapshot and these keys unchanged when the
// application's defaults evolve; a future format needs its own version.
const V1_DEFAULTS = Object.freeze({
  period:'month',output:'year',
  streams:Object.freeze([Object.freeze({name:'Działalność',revenue:0,cost:0,period:'month',rate:12})]),
  zusMode:'full',startMonths:6,months:Object.freeze(Array(12).fill('full')),
  sickness:true,fpExempt:false,accident:1.67,holiday:-1,
  prevRevenue:100000,prevIncome:60000,prevDays:365,prevForm:'income',smallEligible:false,
  otherIncome:0,joint:false,spouseIncome:0,deduction:0,healthTreatment:'deduction',
  paidOverride:false,paidLinear:0,paidLump:0,cardEnabled:false,cardTax:0,
  linearEligibility:'unconfirmed',lumpEligibility:'unconfirmed'
});
const V1_FIELDS = Object.freeze({
  period:'p',output:'o',streams:'r',zusMode:'u',startMonths:'a',months:'m',
  sickness:'s',fpExempt:'f',accident:'i',holiday:'h',prevRevenue:'pr',
  prevIncome:'pi',prevDays:'pd',prevForm:'pf',smallEligible:'se',otherIncome:'oi',
  joint:'j',spouseIncome:'si',deduction:'d',healthTreatment:'ht',paidOverride:'po',
  paidLinear:'pl',paidLump:'pu',cardEnabled:'ce',cardTax:'ct',
  linearEligibility:'le',lumpEligibility:'re'
});
const STATE_KEYS=Object.freeze(Object.keys(V1_FIELDS));
const DELTA_KEYS=Object.freeze(Object.values(V1_FIELDS));
const ROW_KEYS=Object.freeze(['name','revenue','cost','period','rate']);
const BOOLEAN_KEYS=Object.freeze(['sickness','fpExempt','smallEligible','joint','paidOverride','cardEnabled']);
const NUMBER_KEYS=Object.freeze(['startMonths','accident','holiday','prevRevenue','prevIncome','prevDays','otherIncome','spouseIncome','deduction','paidLinear','paidLump','cardTax']);
const MODES=Object.freeze(['full','preferential','start','small','employment']);
const RATES=Object.freeze([17,15,14,12,10,8.5,5.5,3]);
const PERIODS=Object.freeze(['month','year']);
const ELIGIBILITY=Object.freeze(['unconfirmed','eligible','ineligible']);
const MAX_HASH_LENGTH=24000;
const ERROR_MESSAGE='Nieprawidłowy lub nieobsługiwany link scenariusza. Sprawdź, czy został skopiowany w całości.';
const fail=()=>{throw new Error(ERROR_MESSAGE);};

function record(value,allowed,required=[]) {
  if(value===null||typeof value!=='object'||Array.isArray(value))fail();
  // Also accepts plain objects from another browser realm, but not class
  // instances, custom prototype chains or accessor-backed properties.
  const proto=Object.getPrototypeOf(value);
  if(proto!==null&&Object.getPrototypeOf(proto)!==null)fail();
  for(const key of Reflect.ownKeys(value)) {
    if(typeof key!=='string'||!allowed.includes(key)||!('value' in Object.getOwnPropertyDescriptor(value,key)))fail();
  }
  for(const key of required)if(!Object.hasOwn(value,key))fail();
}

function array(value,min,max) {
  if(!Array.isArray(value)||value.length<min||value.length>max)fail();
  const keys=Reflect.ownKeys(value);
  if(keys.length!==value.length+1)fail();
  for(let i=0;i<value.length;i++)if(!Object.hasOwn(value,i)||!('value' in Object.getOwnPropertyDescriptor(value,i)))fail();
}

function stateCheck(state,showZero) {
  record(state,STATE_KEYS,STATE_KEYS);
  if(typeof showZero!=='boolean'||!PERIODS.includes(state.period)||!PERIODS.includes(state.output))fail();
  for(const key of BOOLEAN_KEYS)if(typeof state[key]!=='boolean')fail();
  for(const key of NUMBER_KEYS)if(typeof state[key]!=='number'||!Number.isFinite(state[key]))fail();
  if(![...MODES,'custom'].includes(state.zusMode)||!['income','lump','card'].includes(state.prevForm)||!['deduction','cost'].includes(state.healthTreatment))fail();
  if(!ELIGIBILITY.includes(state.linearEligibility)||!ELIGIBILITY.includes(state.lumpEligibility))fail();
  array(state.months,12,12);
  for(const mode of state.months)if(!MODES.includes(mode))fail();
  array(state.streams,1,30);
  for(const row of state.streams) {
    record(row,ROW_KEYS,ROW_KEYS);
    if(typeof row.name!=='string'||row.name.length>80||!PERIODS.includes(row.period))fail();
    if(typeof row.revenue!=='number'||typeof row.cost!=='number'||!Number.isFinite(row.revenue)||!Number.isFinite(row.cost))fail();
    if(row.rate!=='progressive'&&(typeof row.rate!=='number'||!RATES.includes(row.rate)))fail();
  }
  if(validate(state).length)fail();
}

function freshDefaults() {
  return {...V1_DEFAULTS,streams:V1_DEFAULTS.streams.map(row=>({...row})),months:[...V1_DEFAULTS.months]};
}

function base64url(bytes) {
  // The bounded payload is small; iteration avoids argument-count limits.
  let binary='';
  for(const byte of bytes)binary+=String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}

/** Return a portable fragment; it contains data, not encryption or a secret. */
export function encodeShare(state,showZero=false) {
  try {
    stateCheck(state,showZero);
    const delta={};
    for(const key of STATE_KEYS) {
      if(JSON.stringify(state[key])===JSON.stringify(V1_DEFAULTS[key]))continue;
      delta[V1_FIELDS[key]]=key==='streams'?state.streams.map(row=>ROW_KEYS.map(field=>row[field])):state[key];
    }
    const payload={v:1,y:2026,d:delta};
    if(showZero)payload.z=true;
    const hash='#scenario='+base64url(new TextEncoder().encode(JSON.stringify(payload)));
    if(hash.length>MAX_HASH_LENGTH)fail();
    return hash;
  } catch {
    fail();
  }
}

/** Ordinary page anchors are not imports. Invalid scenario imports throw. */
export function decodeShare(hash) {
  try {
    if(typeof hash!=='string')fail();
    if(hash!=='#scenario'&&!hash.startsWith('#scenario='))return null;
    if(hash.length>MAX_HASH_LENGTH||!hash.startsWith('#scenario='))fail();
    const encoded=hash.slice('#scenario='.length);
    if(!/^[A-Za-z0-9_-]+$/.test(encoded)||encoded.length%4===1)fail();
    const binary=atob(encoded.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(encoded.length/4)*4,'='));
    const bytes=Uint8Array.from(binary,char=>char.charCodeAt(0));
    if(base64url(bytes)!==encoded)fail();
    const payload=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
    record(payload,['v','y','d','z'],['v','y','d']);
    if(payload.v!==1||payload.y!==2026)fail();
    const showZero=Object.hasOwn(payload,'z')?payload.z:false;
    if(typeof showZero!=='boolean')fail();
    record(payload.d,DELTA_KEYS);
    const state=freshDefaults();
    for(const key of STATE_KEYS) {
      const short=V1_FIELDS[key];
      if(!Object.hasOwn(payload.d,short))continue;
      const value=payload.d[short];
      if(key==='streams') {
        array(value,1,30);
        state.streams=value.map(tuple=>{
          array(tuple,5,5);
          return {name:tuple[0],revenue:tuple[1],cost:tuple[2],period:tuple[3],rate:tuple[4]};
        });
      } else state[key]=value;
    }
    stateCheck(state,showZero);
    return {state,showZero};
  } catch {
    fail();
  }
}
