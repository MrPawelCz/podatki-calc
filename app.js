import {calculate,defaults,example,parseAmount,annual,getPlan,smallZus,zusMonth,MONTHS,MODES,C,RATES} from './calculator.js?v=1.1.0';
import {encodeShare,decodeShare} from './share.js?v=1.2.0';
import {RATE_GUIDE,guideIntro} from './rates.js?v=1.2.0';
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=new Intl.NumberFormat('pl-PL',{style:'currency',currency:'PLN',maximumFractionDigits:2});
const plain=new Intl.NumberFormat('pl-PL',{maximumFractionDigits:2});
const fmt=n=>Number.isFinite(n)?money.format(n):'—';
const inputValue=n=>Number.isFinite(n)?String(Math.round((n+Number.EPSILON)*100)/100).replace('.',','):'';
const STORAGE='podatki-calc-2026-v1';
let state=defaults(),lastResult,showZero=false;
const numeric={ 'start-months':'startMonths','accident':'accident','prev-revenue':'prevRevenue','prev-income':'prevIncome','prev-days':'prevDays','other-income':'otherIncome','spouse-income':'spouseIncome','deduction':'deduction','paid-linear':'paidLinear','paid-lump':'paidLump','card-tax':'cardTax' };
const selects={'zus-mode':'zusMode','prev-form':'prevForm','holiday':'holiday','health-treatment':'healthTreatment','linear-eligibility':'linearEligibility','lump-eligibility':'lumpEligibility'};
const checks={'sickness':'sickness','fp-exempt':'fpExempt','small-eligible':'smallEligible','joint':'joint','paid-override':'paidOverride','card-enabled':'cardEnabled'};
function status(text){$('status').textContent=text;}
function clearSharedAddress(){if(location.hash.startsWith('#scenario')){history.replaceState(null,'',location.pathname+location.search);status('Zmieniono dane z linku. Aby udostępnić aktualną wersję, ponownie wybierz „Udostępnij”.');}}
function loadShared(){
 try{const shared=decodeShare(location.hash);if(!shared)return false;state=shared.state;showZero=shared.showZero;status('Wczytano dane z udostępnionego linku. Nie zmieniono Twojego zapisu na urządzeniu.');}
 catch{state=defaults();showZero=false;status('Nie można odczytać danych z linku: jest uszkodzony albo pochodzi z nieobsługiwanej wersji. Wyświetlamy pusty formularz; Twój zapis na urządzeniu pozostaje bez zmian.');}
 return true;
}
function reveal(id){const target=$(id);if(!target)return;let el=target;while(el){if(el.tagName==='DETAILS')el.open=true;el=el.parentElement;}const focusTarget=target.tagName==='DETAILS'?target.querySelector('summary'):target;focusTarget?.focus({preventScroll:true});target.scrollIntoView?.({block:target.matches('input,select,button')?'center':'start',behavior:'instant'});}
function errorTarget(error){
 const stream=error.match(/Pozycja (\d+):/);if(stream)return `${error.includes('koszt')?'cost':error.includes('staw')?'rate':error.includes('okres')?'period':'rev'}-${Number(stream[1])-1}`;
 if(error.includes('Mały ZUS'))return state.prevDays<60?'prev-days':'prev-revenue';if(error.includes('zapłaconej'))return 'paid-override';if(error.includes('wypadkow'))return 'accident';if(error.includes('dni w'))return 'prev-days';if(error.includes('Ulga na start'))return 'start-months';
 return document.querySelector('[aria-invalid="true"]')?.id??'inputs';
}
function fieldValidation(){
 document.querySelectorAll('.field-error').forEach(el=>el.remove());
 document.querySelectorAll('[aria-invalid]').forEach(el=>{el.removeAttribute('aria-invalid');const ids=(el.getAttribute('aria-describedby')??'').split(' ').filter(id=>!id.endsWith('-error'));if(ids.length)el.setAttribute('aria-describedby',ids.join(' '));else el.removeAttribute('aria-describedby');});
 const show=(id,message)=>{const el=$(id);if(!el||$(`${id}-error`))return;const p=document.createElement('p');p.id=`${id}-error`;p.className='field-error';p.textContent=message;el.setAttribute('aria-invalid','true');el.setAttribute('aria-describedby',`${el.getAttribute('aria-describedby')??''} ${p.id}`.trim());(el.closest('.check')??el).insertAdjacentElement('afterend',p);};
 const amount=(id,value)=>{if(!Number.isFinite(value)||value<0||value>1e12)show(id,'Wpisz kwotę od 0 do 1 bln zł, maks. 2 miejsca po przecinku.');};
 state.streams.forEach((s,i)=>{amount(`rev-${i}`,s.revenue);amount(`cost-${i}`,s.cost);});
 for(const [id,key]of Object.entries(numeric)){if($(id).type==='number'){const v=state[key],min=Number($(id).min),max=Number($(id).max);if(!Number.isFinite(v)||v<min||v>max||(id!=='accident'&&!Number.isInteger(v)))show(id,`Wpisz ${id==='accident'?'liczbę':'całkowitą liczbę'} od ${String(min).replace('.',',')} do ${max}.`);}else amount(id,state[key]);}
 if(getPlan(state).includes('small')){if(state.prevDays<60)show('prev-days','Mały ZUS Plus wymaga co najmniej 60 dni działalności w 2025 roku.');if(state.prevRevenue>smallZus(state).limit)show('prev-revenue',`Przychód przekracza limit ${fmt(smallZus(state).limit)}. Wybierz inny wariant ZUS lub popraw dane.`);}
 if(state.healthTreatment==='cost'&&!state.paidOverride)show('paid-override','Włącz własne kwoty i wpisz zdrowotną zapłaconą w 2026 roku albo wybierz odliczenie od dochodu.');
}
function load(){if(loadShared())return;try{const raw=localStorage.getItem(STORAGE);if(!raw)return;const saved=JSON.parse(raw);if(saved.version!==1||!saved.state||!Array.isArray(saved.state.streams))throw Error();const next={...defaults(),...saved.state};if(calculate(next).errors.length)throw Error();state=next;showZero=saved.showZero===true;status('Wczytano ustawienia zapisane na tym urządzeniu.');}catch{status('Zapisane ustawienia są nieczytelne lub niekompletne. Wczytano pusty formularz.');}}
function rateOptions(selected){return RATE_GUIDE.map(({value,label})=>`<option value="${value}" ${String(selected)===String(value)?'selected':''}>${esc(label)}</option>`).join('');}
function rateHelp(selected){const guide=RATE_GUIDE.find(r=>String(r.value)===String(selected));return guide?`<strong>${esc(guide.label)}</strong> ${esc(guide.description)} <a href="#rate-guide">Przykłady i wszystkie stawki</a>`:'';}
function renderStreams(){
 $('streams').innerHTML=state.streams.map((s,i)=>`<article class="stream" data-index="${i}" aria-label="Przychód ${i+1}">
 <div class="stream-head"><div><label for="name-${i}">Rodzaj przychodu ${i+1}</label><input id="name-${i}" data-field="name" aria-label="Nazwa przychodu ${i+1}" maxlength="80" value="${esc(s.name)}" placeholder="Np. usługi, sprzedaż"></div><button class="remove" data-remove="${i}" aria-label="Usuń przychód ${i+1}" ${state.streams.length===1?'disabled':''}>×</button></div>
 <div class="field-grid"><div><label for="rev-${i}">Przychód (zł/${s.period==='month'?'mies.':'rok'})</label><input id="rev-${i}" data-field="revenue" inputmode="decimal" type="text" value="${inputValue(s.revenue)}" aria-describedby="stream-summary-${i}" data-number></div><div><label for="cost-${i}">Koszty (zł/${s.period==='month'?'mies.':'rok'})</label><input id="cost-${i}" data-field="cost" inputmode="decimal" type="text" value="${inputValue(s.cost)}" data-number></div></div>
 <div class="stream-bottom"><div><label for="rate-${i}">Stawka ryczałtu</label><select id="rate-${i}" data-field="rate" aria-describedby="rate-help-${i}">${rateOptions(s.rate)}</select></div><div><label for="period-${i}">Okres kwot</label><select id="period-${i}" data-field="period"><option value="month" ${s.period==='month'?'selected':''}>Miesiąc</option><option value="year" ${s.period==='year'?'selected':''}>Rok</option></select></div></div>
 <p class="hint rate-help" id="rate-help-${i}">${rateHelp(s.rate)}</p>
 <p class="hint" id="stream-summary-${i}">Rocznie: ${fmt(annual(s,'revenue'))} przychodu · ${fmt(annual(s,'cost'))} kosztów</p></article>`).join('');
 $('streams-count').textContent=`${state.streams.length} / 30`;$('add-stream').disabled=state.streams.length>=30;
}
function syncControls(){
 for(const [id,key]of Object.entries(numeric))$(id).value=$(id).type==='number'?state[key]:inputValue(state[key]);
 for(const [id,key]of Object.entries(selects))$(id).value=state[key]??'unconfirmed';
 for(const [id,key]of Object.entries(checks))$(id).checked=state[key];
 document.querySelectorAll('[data-period]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.period===state.period)));
 document.querySelectorAll('[data-output]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.output===state.output)));
 renderStreams();renderResults();
}
function renderSettings(r){
 const focusedMonth=document.activeElement?.dataset.month;
 const plan=getPlan(state),hasSmall=plan.includes('small');
 $('start-fields').hidden=state.zusMode!=='start';$('small-fields').hidden=!hasSmall;$('spouse-fields').hidden=!state.joint;$('paid-fields').hidden=!state.paidOverride;$('card-fields').hidden=!state.cardEnabled;
 const hints={full:'Minimalna podstawa 5 652 zł miesięcznie. Społeczne oraz FP/FS liczymy oddzielnie.',preferential:'Minimalna podstawa 1 441,80 zł. Ulga przez 24 pełne miesiące po spełnieniu warunków, zwykle bez FP/FS.',start:'Ulga zwalnia ze społecznych, nie ze zdrowotnej. Po wykorzystaniu wskazanych miesięcy przyjmujemy preferencyjny ZUS.',small:'Podstawa z dochodu 2025, nie stała „mała składka”. Od 2026: 36 miesięcy ulgi w 60-miesięcznych okresach.',employment:'Zakładasz inny tytuł zwalniający ze społecznych JDG, np. etat z wynagrodzeniem co najmniej minimalnym. Zdrowotna z JDG pozostaje.',custom:'Każdy miesiąc ma własny wariant. Wybór ulgi jest deklaracją uprawnienia — plan nie ustala historii ubezpieczenia.'};
 $('zus-hint').textContent=hints[state.zusMode]??'';
 if(hasSmall){const small=smallZus(state);$('small-info').textContent=`Limit przychodu: ${fmt(small.limit)}. Wyliczona podstawa: ${fmt(small.base)} / miesiąc. ${small.eligible?'Podstawowe warunki liczbowe spełnione.':'Sprawdź warunki i potwierdzenie uprawnienia.'}`;}
 $('month-plan').innerHTML=plan.map((mode,i)=>{const z=zusMonth(mode,state,i===state.holiday);return `<div class="month-row"><span title="${MONTHS[i]}">${String(i+1).padStart(2,'0')}</span><select data-month="${i}" aria-label="ZUS — ${MONTHS[i]}">${Object.entries(MODES).map(([v,l])=>`<option value="${v}" ${v===mode?'selected':''}>${l}</option>`).join('')}</select><strong title="Społeczne i FP/FS${z.holiday?' — wakacje składkowe':''}">${fmt(z.total)}</strong></div>`;}).join('');
 if(focusedMonth!==undefined)$('month-plan').querySelector(`[data-month="${focusedMonth}"]`)?.focus({preventScroll:true});
 $('zus-summary').textContent=r.zus?`${fmt(r.zus.total)} / rok`:'';
}
function resultCard(r,best,ready){
 const divisor=state.output==='month'?12:1,unit=divisor===12?'średnio / miesiąc':'/ rok',f=n=>fmt(n/divisor);
 const eligibility=r.eligibility?.status??(r.id==='scale'||r.id==='card'?'eligible':'unconfirmed');
 const excluded=eligibility==='ineligible',isBest=ready&&!excluded&&r.id===best.id;
 const eligibilityTarget=getPlan(state).includes('small')&&!state.smallEligible?'small-eligible':'eligibility-settings';
 const delta=r.burden-best.burden,tied=!excluded&&Math.abs(delta)<1;
 const rows=[['Zmiana PIT¹',r.pit],['ZUS społeczny',r.social],['Fundusz Pracy / FS',r.fp],['Zdrowotna',r.health],['Danina solidarnościowa',r.solidarity]];
 return `<article class="tax-card ${isBest?'best':''} ${excluded?'excluded':''} ${ready?'':'empty-card'}" aria-label="${r.name}${isBest?' — najniższe obciążenie w symulacji':''}">
 <div class="card-heading"><h3>${r.name}</h3>${eligibility==='unconfirmed'?`<a class="eligibility-label" href="#${eligibilityTarget}" title="${esc(r.eligibility?.reason??'Sprawdź warunki stosowania')}">Warunkowo</a>`:excluded?'<span class="eligibility-label unavailable">Poza rankingiem</span>':''}</div>
 <p class="rate-label">${r.rate}</p><div class="net-label">Zostaje z JDG</div><div class="net-value ${ready&&r.net<0?'negative':''}">${ready?f(r.net):'—'}</div><div class="net-unit">${unit}</div>
 ${!ready?'<p class="difference">Wynik po wpisaniu kwot</p>':isBest?`<span class="winner">${eligibility==='unconfirmed'?'Najniższe w symulacji':'Najniższe obciążenie'}</span>`:excluded?'<p class="difference">Forma wyłączona z porównania</p>':`<p class="difference">${tied?'Wynik zbliżony do najniższego obciążenia':`${f(delta)} mniej zostaje ${divisor===12?'miesięcznie':'rocznie'}`}</p>`}
 ${ready?`<div class="card-burden"><span>Podatki i składki</span><strong>${f(r.burden)}</strong></div><details class="tax-detail" id="tax-detail-${r.id}"><summary>Składniki obciążenia</summary><dl>${rows.map(([label,value])=>`<div><dt>${label}</dt><dd>${f(value)}</dd></div>`).join('')}</dl><p class="effective">${lastResult.revenue?`${plain.format(r.effective)}% przychodu na obciążenia`:'Brak przychodu: pozostają składki'}</p>${excluded?`<p class="hint">${esc(r.eligibility?.reason??'Brak uprawnienia według Twojego wyboru.')}</p>`:''}</details>`:''}</article>`;
}
function renderResults(){
 const result=calculate(state);lastResult=result;renderSettings(result);
 fieldValidation();
 const ready=showZero||result.revenue>0||result.costs>0;
 $('errors').hidden=!result.errors.length;
 $('errors').innerHTML=result.errors.length?`<strong>Popraw dane, aby zobaczyć wynik</strong><ul>${result.errors.map(e=>`<li><a href="#${errorTarget(e)}">${esc(e)}</a></li>`).join('')}</ul>`:'';
 $('breakdown-panel').hidden=!ready||!!result.errors.length;$('calculation-panel').hidden=!ready||!!result.errors.length;
 if(result.errors.length){
  $('recommendation').innerHTML='<strong>Najpierw popraw dane</strong><p>Wstrzymaliśmy porównanie, aby nie pokazywać nieaktualnego wyniku.</p><button class="text-action" data-reveal="errors">Przejdź do błędów w formularzu</button>';
  $('comparison').innerHTML='';$('bars').innerHTML='';$('calculation').innerHTML='';$('warnings').innerHTML='';$('priority-warnings').innerHTML='';$('assumptions').hidden=true;$('result-context').textContent='';$('revenue-summary').textContent='—';$('cost-summary').textContent='—';$('mobile-summary').textContent='Popraw dane w formularzu';$('mobile-results-link').href='#errors';$('mobile-results-link').innerHTML='Popraw dane <span aria-hidden="true">↑</span>';return;
 }
 const d=state.output==='month'?12:1,f=n=>fmt(n/d),best=result.ranking[0],second=result.ranking[1];
 $('revenue-summary').textContent=fmt(result.revenue);$('cost-summary').textContent=fmt(result.costs);
 const tie=second&&Math.abs(best.burden-second.burden)<1;
 const conditional=best.eligibility?.status==='unconfirmed'||(getPlan(state).includes('small')&&!state.smallEligible);
 if(!ready){
  $('recommendation').innerHTML='<strong>Która forma pasuje do Twoich liczb?</strong><p>Wpisz przychód i koszty. Porównamy skalę, liniowy i ryczałt razem z podatkiem i ZUS.</p><div class="empty-actions"><button class="primary" data-reveal="rev-0">Wpisz pierwszy przychód</button><button class="text-action" data-example>Sprawdź na przykładzie</button></div><button class="text-action zero-action" data-zero>Chcę policzyć rok bez przychodu</button>';
  $('result-context').textContent='Bez konta. Obliczenia i zapis pozostają na Twoim urządzeniu.';
 }else{
  $('recommendation').innerHTML=`<div class="recommend-label">${tie?'Zbliżone obciążenie w symulacji':'Najmniejsze obciążenie w symulacji'}</div><strong>${tie?`${best.name} i ${second.name}`:best.name}</strong><p>${tie?'Różnica poniżej 1 zł rocznie.':second?`Zostaje o <b>${f(second.burden-best.burden)}</b> ${d===12?'miesięcznie (średnio)':'rocznie'} więcej niż w wariancie „${second.name}”.`:'Jedyna forma uwzględniona w rankingu.'}</p>${conditional?`<a class="recommend-check" href="#${getPlan(state).includes('small')&&!state.smallEligible?'small-eligible':'eligibility-settings'}">Sprawdź warunki przed wyborem formy</a>`:''}`;
  $('result-context').textContent=d===12?'Kwoty miesięczne to średnia z całego roku, nie wysokość zaliczek PIT ani przelewu do ZUS.':'Pełny rok 2026. „Zostaje” = przychód minus koszty, ZUS, zdrowotna i zmiana PIT oraz daniny solidarnościowej.';
 }
 const openedDetails=[...$('comparison').querySelectorAll('details[open]')].map(el=>el.id);
 $('comparison').innerHTML=result.results.map(r=>resultCard(r,best,ready)).join('');openedDetails.forEach(id=>{if($(id))$(id).open=true;});
 const ordinary=result.warnings.filter(w=>w.startsWith('Szacunek')),important=result.warnings.filter(w=>!w.startsWith('Szacunek'));
 $('warnings').innerHTML=ordinary.map(w=>`<p class="notice info">${esc(w)}</p>`).join('');
 $('priority-warnings').innerHTML=ready?important.map(w=>`<p class="notice">${esc(w)}</p>`).join(''):'';
 $('assumptions').hidden=!ready||!ordinary.length;$('warnings-count').textContent='Zdrowotna i odliczenia';
 $('mobile-summary').textContent=ready?`${tie?`${best.name} / ${second.name}`:best.name}${conditional?' (warunkowo)':''} · zostaje ${f(best.net)} ${d===12?'/ mies.':'/ rok'}`:'Wpisz przychód, aby porównać podatki';
 $('mobile-results-link').href='#results';$('mobile-results-link').innerHTML='Porównanie <span aria-hidden="true">↓</span>';
 $('breakdown-period').textContent=d===12?'Średnio miesięcznie':'Rocznie';
 $('bars').innerHTML=result.results.map(r=>{const parts=[['net','Zostaje',Math.max(0,r.net)],['costs','Koszty',result.costs],['social','ZUS + FP',r.social+r.fp],['health','Zdrowotna',r.health],['tax','PIT + danina',Math.max(0,r.pit+r.solidarity)]];const total=parts.reduce((a,p)=>a+p[2],0);return `<div class="bar-row"><div class="bar-label"><span>${r.name}</span><strong>${f(r.burden)} obciążeń</strong></div><div class="bar" role="img" aria-label="${esc(parts.map(p=>`${p[1]}: ${f(p[2])}`).join(', '))}">${parts.map(p=>`<span class="${p[0]}" style="width:${total?p[2]/total*100:0}%" title="${p[1]}: ${f(p[2])}"></span>`).join('')}</div></div>`;}).join('');
 const row=(label,value)=>`<div class="calc-row"><span>${label}</span><strong>${fmt(value)}</strong></div>`;
 $('calculation').innerHTML=`<p class="hint">Wszystkie podstawy i odliczenia poniżej są roczne. ¹ Zmiana PIT to różnica podatku z działalnością względem osobnego rozliczenia innych dochodów bez JDG. Kwota może być ujemna, jeśli obniżasz PIT od innych dochodów lub korzystasz ze wspólnego rozliczenia.</p>${row('PIT innych dochodów bez JDG (punkt odniesienia)',result.baselinePit)}${result.results.map(r=>`<section class="calc-section"><h3>${r.name}</h3>${r.id==='card'?row('Podatek z decyzji przed odliczeniem (12 miesięcy)',state.cardTax*12):row('Podstawa PIT po odliczeniach',r.taxBase)}${row(r.id==='lump'?'Przychód do progu zdrowotnej (po społecznych)':'Dochód do zdrowotnej (karta: podstawa miesięczna)',r.healthBase)}${row(r.id==='card'?'Odliczenie zdrowotnej od podatku':'Zdrowotna uwzględniona w PIT',r.healthDeduction)}${r.id!=='card'?row('Inne odliczenia wykorzystane',r.otherDeduction):''}${r.businessPit!==undefined?row('Sam PIT z działalności',r.businessPit):''}${r.otherSocialDeduction?row('Społeczne odliczone od innych dochodów',r.otherSocialDeduction):''}${row('Cały PIT z uwzględnionych dochodów',r.totalPit)}${row('Cała danina z uwzględnionych dochodów',r.totalSolidarity)}${r.buckets?`<p class="hint">Przychody ryczałtu dzielimy na stawki przed proporcjonalnym rozliczeniem odliczeń.</p>${r.buckets.map(b=>row(`${String(b.rate).replace('.',',')}% — podstawa po odliczeniach`,b.taxable)).join('')}${row('Łączne wykorzystane odliczenia ryczałtu',r.totalDeduction)}<p class="hint">Próg zdrowotnej ${r.tier+1}/3; miesięczna składka ${fmt(r.monthlyHealth)}. Należność roczna jest liczona od rocznej podstawy — suma zaokrąglonych składek miesięcznych może różnić się o grosze.</p>`:''}</section>`).join('')}<p class="hint">Wakacje składkowe: ${fmt(result.zus.waived)} społecznych i FP/FS finansowanych przez państwo (nie odliczamy ich od PIT).</p>`;
}
function changePeriod(s,to){if(s.period===to)return;const multiplier=to==='year'?12:1/12;s.revenue*=multiplier;s.cost*=multiplier;s.period=to;}
$('streams').addEventListener('input',e=>{const el=e.target,field=el.dataset.field;if(!field||el.tagName==='SELECT')return;const index=Number(el.closest('[data-index]').dataset.index);state.streams[index][field]=field==='name'?el.value:parseAmount(el.value);if(field!=='name'){el.setAttribute('aria-invalid',String(!Number.isFinite(state.streams[index][field])));const s=state.streams[index];$(`stream-summary-${index}`).textContent=`Rocznie: ${fmt(annual(s,'revenue'))} przychodu · ${fmt(annual(s,'cost'))} kosztów`;renderResults();}});
$('streams').addEventListener('change',e=>{const el=e.target;if(el.tagName!=='SELECT')return;const focusId=el.id,s=state.streams[Number(el.closest('[data-index]').dataset.index)];if(el.dataset.field==='period')changePeriod(s,el.value);else s.rate=el.value==='progressive'?el.value:Number(el.value);renderStreams();renderResults();$(focusId)?.focus({preventScroll:true});});
$('streams').addEventListener('click',e=>{const b=e.target.closest('[data-remove]');if(!b||state.streams.length<2)return;state.streams.splice(Number(b.dataset.remove),1);renderStreams();renderResults();$('add-stream').focus();});
$('add-stream').addEventListener('click',()=>{if(state.streams.length>=30)return;state.streams.push({name:`Przychód ${state.streams.length+1}`,revenue:0,cost:0,rate:8.5,period:state.period});renderStreams();renderResults();$('streams').lastElementChild.querySelector('input').focus();});
document.querySelectorAll('[data-period]').forEach(b=>b.addEventListener('click',()=>{state.period=b.dataset.period;state.streams.forEach(s=>changePeriod(s,state.period));syncControls();status('Zmieniono okres i przeliczono kwoty. Roczne wyniki pozostają takie same.');}));
document.querySelectorAll('[data-output]').forEach(b=>b.addEventListener('click',()=>{state.output=b.dataset.output;document.querySelectorAll('[data-output]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderResults();}));
for(const [id,key]of Object.entries(numeric))$(id).addEventListener('input',()=>{state[key]=$(id).type==='number'?($(id).value===''?NaN:Number($(id).value)):parseAmount($(id).value);$(id).setAttribute('aria-invalid',String(!Number.isFinite(state[key])));renderResults();});
for(const [id,key]of Object.entries(checks))$(id).addEventListener('change',()=>{state[key]=$(id).checked;renderResults();});
for(const [id,key]of Object.entries(selects))$(id).addEventListener('change',()=>{if(key==='zusMode'&&$(id).value==='custom')state.months=getPlan(state);state[key]=key==='holiday'?Number($(id).value):$(id).value;if(key==='zusMode'&&state.zusMode==='custom')$('month-plan-details').open=true;renderResults();});
$('month-plan').addEventListener('change',e=>{const i=Number(e.target.dataset.month);if(!Number.isInteger(i))return;state.months=getPlan(state);state.months[i]=e.target.value;state.zusMode='custom';$('zus-mode').value='custom';renderResults();});
$('example').addEventListener('click',()=>{clearSharedAddress();showZero=false;state=example();syncControls();status('Wczytano fikcyjny przykład: usługi IT i sprzedaż towarów. Nie zapisano go na urządzeniu.');});
$('save').addEventListener('click',()=>{if(calculate(state).errors.length){status('Najpierw popraw dane. Nie zapisano niepełnego scenariusza.');return;}try{localStorage.setItem(STORAGE,JSON.stringify({version:1,state,showZero}));status('Zapisano lokalnie na tym urządzeniu. Ustawienia wczytają się po ponownym otwarciu.');}catch{status('Przeglądarka blokuje lokalny zapis. Możesz zachować wynik jako PDF.');}});
$('reset').addEventListener('click',()=>{clearSharedAddress();showZero=false;state=defaults();try{localStorage.removeItem(STORAGE);}catch{}syncControls();document.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));status('Wyczyszczono formularz i zapis z tego urządzenia.');});
$('share').addEventListener('click',()=>{
 if(calculate(state).errors.length){status('Najpierw popraw dane. Link nie został utworzony.');reveal('errors');return;}
 try{
  const url=new URL(location.href);url.search='';url.hash=encodeShare(state,showZero);
  $('share-link').value=url.href;$('share-status').textContent='';$('share-native').hidden=typeof navigator.share!=='function';
  $('share-dialog').showModal();
 }catch{status('Nie udało się utworzyć linku. Sprawdź dane i spróbuj ponownie.');}
});
$('share-copy').addEventListener('click',async()=>{
 try{await navigator.clipboard.writeText($('share-link').value);$('share-status').textContent='Link skopiowany. Możesz wkleić go w wiadomości.';}
 catch{$('share-link').focus();$('share-link').select();$('share-status').textContent='Przeglądarka nie pozwoliła skopiować linku automatycznie. Zaznaczyliśmy go — skopiuj ręcznie.';}
});
$('share-native').addEventListener('click',async()=>{
 try{await navigator.share({title:'Podatki Calc — porównanie 2026',url:$('share-link').value});$('share-status').textContent='Przekazano link do wybranej aplikacji.';}
 catch(error){$('share-status').textContent=error.name==='AbortError'?'Anulowano udostępnianie. Link jest nadal dostępny.':'Nie udało się udostępnić. Użyj przycisku „Kopiuj link”.';}
});
$('share-close').addEventListener('click',()=>$('share-dialog').close());
window.addEventListener('hashchange',()=>{if(loadShared()){if($('share-dialog').open)$('share-dialog').close();syncControls();}});
for(const event of ['input','change'])$('inputs').addEventListener(event,clearSharedAddress,true);
document.addEventListener('click',e=>{if(e.target.closest('[data-period],[data-output],[data-remove],[data-zero],#add-stream'))clearSharedAddress();},true);
let printDetails=[];
window.addEventListener('beforeprint',()=>{printDetails=[...document.querySelectorAll('details')].map(d=>[d,d.open]);printDetails.forEach(([d])=>d.open=true);});
window.addEventListener('afterprint',()=>{printDetails.forEach(([d,open])=>d.open=open);});
$('print').addEventListener('click',()=>window.print());
document.addEventListener('click',e=>{const action=e.target.closest('[data-reveal],[data-example],[data-zero],a[href^="#"]');if(!action)return;if(action.dataset.reveal){reveal(action.dataset.reveal);}else if(action.hasAttribute('data-example')){$('example').click();}else if(action.hasAttribute('data-zero')){showZero=true;renderResults();}else if(action.hash){e.preventDefault();reveal(action.hash.slice(1));}});
$('holiday').innerHTML+='<option value="0">Styczeń</option>'+MONTHS.slice(1).map((m,i)=>`<option value="${i+1}">${m}</option>`).join('');
$('rate-guide').querySelector('.hint').textContent=guideIntro+' Różne czynności w jednej firmie mogą mieć różne stawki.';
$('rate-guide-content').innerHTML=RATE_GUIDE.map(r=>`<div><dt>${esc(r.label)}</dt><dd><p>${esc(r.description)}</p><p>${esc(r.examples)}</p></dd></div>`).join('');
$('method-content').innerHTML=`<div class="method-grid">
 <div><h3>Co porównujemy</h3><p>Cały 2026 rok aktywnej JDG w Polsce: skalę 12%/32%, liniowy 19%, ryczałt według wskazanych stawek oraz opcjonalnie kartę (kontynuacja). Ryczałt ignoruje koszty przy podatku, ale uwzględnia je w kwocie „zostaje”. Kwoty miesięczne wyników są średnią roczną, nie zaliczką PIT ani przelewem do ZUS.</p><p>Inne dochody na skali wpływają na progi, wspólne rozliczenie i daninę. Nie dodajemy ich do kwoty pozostającej z działalności.</p></div>
 <div><h3>ZUS i ulgi</h3><p>Pełny ZUS: 1 926,76 zł/mies. z chorobowym i FP/FS przy wypadkowym 1,67%. Preferencyjny: 456,18 zł z chorobowym. Ulga na start: bez społecznych. MZ+ wyliczamy z dochodu poprzedniego roku; podstawa od 1 441,80 do 5 652 zł. FP/FS nie odlicza się od przychodu ryczałtu. Wakacje tylko po świadomym wyborze miesiąca.</p><p>Ulga na start i preferencja: sprawdź m.in. 60 miesięcy od poprzedniej działalności i wykonywanie usług dla byłego pracodawcy. MZ+: co najmniej 60 dni w 2025, limit proporcjonalny do 120 tys. zł oraz pozostałe wyłączenia. Od 2026 nowe okresy 36/60 miesięcy.</p></div>
 <div><h3>Zdrowotna: należna a zapłacona</h3><p>Skala: 9%, liniowy: 4,9% dochodu, minimum roczne 5 190,48 zł. Minimum roku składkowego luty 2026–styczeń 2027 wynosi 432,54 zł/mies. Styczeń 2026 miał 314,96 zł — nie mieszamy tych okresów w minimum rocznym.</p><p>Ryczałt: progi po odjęciu zapłaconych społecznych — do 60 tys., do 300 tys. i powyżej. Należność roczna liczona od rocznej podstawy. Odliczenie PIT: 50% zapłaconej zdrowotnej; liniowy do 14 100 zł. Domyślnie przyjmujemy zapłaconą równą należnej. Tryb KUP liniowego wymaga ręcznego podania zapłaconej kwoty.</p></div>
 <div><h3>Zakres i dostępność form</h3><p>To kalkulator porównawczy, nie deklaracja podatkowa. Nie sprawdza PKWiU, uprawnień do ryczałtu, historii ulg, PIT-0, ulg na dzieci, strat z poprzednich lat, IP Box, VAT, remanentów, sprzedaży środków trwałych, emerytur ani zagranicznych dochodów. Danina obejmuje tylko wpisane dochody skali i liniowego, bez innych dochodów kapitałowych.</p><p>Limit ryczałtu na 2026: 8 517 200 zł przychodu za 2025. Usługi dla pracodawcy mogą wyłączać liniowy lub ryczałt. Stawka 2% dla szczególnych produktów rolnych nie jest standardową stawką JDG i nie jest proponowana. Najem prywatny pozostaje poza zakresem; wspólny PIT-28 z najmem wymaga innego podziału odliczeń.</p></div>
 </div><details><summary>Oficjalne źródła</summary><p class="hint">Odczyt: 13.10.2026. Rozdzielamy przepisy, komunikaty organów i własny model ekonomiczny. W dokumentacji podajemy zakres potwierdzenia oraz wersje tekstów prawnych.</p><ul>
 <li><a href="https://github.com/MrPawelCz/podatki-calc/blob/main/docs/PIT-SOURCES.md">PIT — przepisy, formularze i limity z oficjalnych źródeł</a></li>
 <li><a href="https://github.com/MrPawelCz/podatki-calc/blob/main/docs/ZUS-SOURCES.md">ZUS — podstawy, składniki, zdrowotna i Mały ZUS Plus</a></li>
 <li><a href="https://github.com/MrPawelCz/podatki-calc/blob/main/docs/METHODOLOGY.md">Pełna metodologia i zaokrąglenia</a></li>
 </ul><p>Silnik powstał niezależnie na podstawie oficjalnych źródeł. Przed wyborem formy sprawdź właściwą klasyfikację usług i indywidualne uprawnienia z księgowym.</p></details>`;
load();syncControls();
