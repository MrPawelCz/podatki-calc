# PIT 2026 — źródła i zakres weryfikacji

**Odczyt źródeł: 13 października 2026.** Kalkulator porównuje obciążenia roczne polskiej JDG. Poniższe formuły nie zastępują kwalifikacji działalności, prowadzenia ewidencji i rozliczenia faktycznych płatności. Każda kwota przykładowa jest fikcyjna.

## Weryfikacja podstawowych formuł

### Skala

Ustawa PIT, art. 9, 26 i 27:

```text
dochód JDG = max(0, przychód − koszty − FP/FS)
podstawa = max(0, dochód JDG + inne dochody skali − odliczane społeczne − kwalifikowane odliczenia)
do 120 000 zł: max(0, 12% × podstawa − 3600 zł)
powyżej 120 000 zł: 10 800 zł + 32% × (podstawa − 120 000 zł)
```

Kwota wolna 30 000 zł i próg 120 000 zł są wspólne dla wszystkich dochodów opodatkowanych skalą. Nie nalicza się ich osobno dla kolejnych źródeł. Strata JDG nie pomniejsza dochodu z etatu. Odliczane od dochodu składki społeczne mogą obniżać skalę, o ile nie zostały już ujęte w kosztach lub odliczone gdzie indziej. Zdrowotnej na skali nie odlicza się od podatku ani dochodu i nie ujmuje w kosztach.

„Inny dochód na skali” oznacza podstawę po własnych kosztach i składkach społecznych, nie pensję brutto lub netto. Kalkulator nie prowadzi listy płac. Uproszczone pole dodatkowych odliczeń dotyczy wyłącznie kwalifikowanych kwot wspólnych dla porównywanych form i ogranicza je do JDG; nie optymalizuje wykorzystania ulg między źródłami.

### Wspólne rozliczenie

PIT art. 6 ust. 2–3: podwójny podatek od połowy sumy podstaw małżonków. Najpierw dzieli się podstawę przez dwa, następnie zaokrągla połowę do złotych, oblicza podatek, mnoży go przez dwa i zaokrągla podatek należny.

Warunki obejmują m.in. małżeństwo i wspólność majątkową przez cały rok albo od ślubu do końca roku, właściwą rezydencję i wspólny wniosek. Aktywny liniowy lub ryczałt z działalności jednego z małżonków zasadniczo wyklucza preferencję (art. 6 ust. 8). Prywatny najem ryczałtowy stanowi wyjątek. Szczegółowa kwalifikacja zerowej/zawieszonej działalności nie jest automatyzowana.

Porównanie uwzględnia osobny podatek małżonka w wariantach liniowego i ryczałtu. Wynik „zostaje z JDG” uwzględnia zmianę PIT wobec osobnego opodatkowania pozostałych dochodów bez JDG, nie pełny dochód netto rodziny. Korzyść wspólnego rozliczenia może prowadzić do ujemnego przyrostu PIT.

### Liniowy

PIT art. 30c: 19% podstawy, bez kwoty wolnej. Pozostałe dochody skali pozostają odrębnym podatkiem.

**Limit składek zdrowotnych odliczonych od dochodu lub ujętych w kosztach wynosi w 2026 roku 14 100 zł łącznie.** Potwierdza to odczytany tekst obwieszczenia Ministra Finansów i Gospodarki z 12 grudnia 2025 r., M.P. 2025 poz. 1274. Bazowej kwoty widniejącej w ustawie nie można używać zamiast corocznie ogłaszanego limitu.

Odliczenie dotyczy składek rzeczywiście zapłaconych i kwalifikowanych. W planowaniu kalkulator domyślnie szacuje kwotę zapłaconą jako należną; jest to uproszczenie, nie rozliczenie przelewów. Użytkownik może wpisać rzeczywiście zapłaconą kwotę. Zdrowotna odliczana od dochodu PIT nie obniża podstawy zdrowotnej; zaliczona do kosztów obniża również tę podstawę. Tryb kosztowy wymaga rzeczywistej kwoty zapłaconej, aby uniknąć pozornej rocznej pętli należność–odliczenie.

### Ryczałt

Ustawa ryczałtowa art. 12 przewiduje stawki 17%, 15%, 14%, 12%, 10%, 8,5%, 5,5% i 3% oraz szczególny mechanizm **8,5% do 100 000 zł i 12,5% powyżej progu**. Stawki wynikają z rodzaju czynności, a nie dowolnego wyboru podatnika. Stawka 2% dotyczy szczególnej sprzedaży własnych przetworzonych produktów roślinnych i zwierzęcych, nie zwykłej JDG; nie jest elementem tego porównania.

Koszty działalności i FP/FS nie obniżają przychodu opodatkowanego ryczałtem. Obniżają natomiast kwotę pozostającą przedsiębiorcy. Składki społeczne oraz **50% zapłaconej zdrowotnej** odlicza się od przychodu, nie od podatku. Wielostawkowość wymaga ewidencji rozdzielającej przychody.

Kolejność obliczeń:

1. Sumowanie przychodów wszystkich strumieni objętych progresywnym mechanizmem JDG.
2. Podział **przychodu przed odliczeniami** na część do 100 000 zł w stawce 8,5% oraz nadwyżkę w stawce 12,5%.
3. Połączenie z pozostałymi koszykami stawek. Zwykłe usługi ze stałą stawką 8,5% nie zużywają progu progresywnego.
4. Proporcjonalny podział odliczeń zgodnie z udziałem przychodów poszczególnych stawek.
5. Zaokrąglenie podstaw poszczególnych stawek do złotych, obliczenie i zsumowanie podatku, zaokrąglenie podatku należnego.

Przykład: przychód progresywny 120 000 zł, odliczenia 12 000 zł → przychody 100 000 / 20 000 → podstawy 90 000 / 18 000 → **9900 zł PIT**. Przesunięcie progu o odliczenia i wynik 9500 zł byłyby błędne.

Kalkulator zachowuje pełną proporcję przychodów i zaokrągla kwoty odliczeń do groszy. Oficjalny formularz PIT-28 przewiduje również pola udziałów procentowych z dwoma miejscami po przecinku. Model planistyczny nie obiecuje identycznego wyniku z deklaracją co do złotego.

**Prawo do ryczałtu w 2026:** limit przychodu poprzedniego roku wynosi 2 mln euro, czyli **8 517 200 zł przychodu 2025**. Wynika to z art. 6 ust. 4 i art. 4 ust. 2 oraz kursu EUR 4,2586 z tabeli NBP 190/A/NBP/2025 z 1 października 2025 r. Próg nie dotyczy prognozowanego przychodu bieżącego roku; rozpoczynający mają odrębną regułę. Kalkulator nie potwierdza automatycznie uprawnienia.

Wyłączenia obejmują m.in. apteki, obrót walutami, handel częściami/akcesoriami samochodowymi, niektóre wyroby akcyzowe i określone zmiany działalności między małżonkami. W ryczałcie praca na rzecz obecnego/byłego pracodawcy odpowiadająca czynnościom z etatu w roku bieżącym lub poprzednim może powodować utratę prawa (art. 8 ust. 2). Dla liniowego art. 9a ust. 3 PIT dotyczy czynności pracowniczych z roku bieżącego.

### Karta

Art. 25 ust. 1 pkt 1 ustawy ryczałtowej ogranicza kartę do kontynuujących po 31 grudnia 2021 r. bez utraty prawa lub rezygnacji. To nie nowa forma do wyboru.

Podatek wpisywany jest z decyzji urzędu. Art. 31 pozwala obniżyć go o **19% zapłaconej składki zdrowotnej**. Model przyjmuje stałą kwotę decyzji i zdrowotną równą należnej przez rok; podatek zaokrąglany jest miesięcznie. Nie wyznacza indywidualnej stawki karty, nie uwzględnia przerw, zmian decyzji i harmonogramu rzeczywistych przelewów.

### Danina solidarnościowa

PIT art. 30h: 4% nadwyżki objętych dochodów własnych ponad **1 000 000 zł**. Dotyczy m.in. skali i liniowego, nie przychodów opodatkowanych ryczałtem lub kartą. Objęte ustawą inne dochody, np. niektóre dochody kapitałowe, nie są samodzielnie wyliczane przez aplikację.

Podstawę pomniejszają kwalifikowane społeczne i odliczona zdrowotna liniowego (art. 30h ust. 2 pkt 1 odsyła wprost do art. 30c ust. 2 pkt 2). Zdrowotna zaliczona do KUP zmniejsza dochód wcześniej i nie jest odejmowana drugi raz. Zwykłe ulgi, np. IKZE, nie pomniejszają automatycznie daniny.

Próg jest indywidualny. Wspólny PIT nie dzieli dochodu na potrzeby daniny i nie daje jednej wspólnej kwoty 2 mln zł. Wynik obejmuje tylko podane dochody, nie stanowi kompletnej kalkulacji DSF przy innych źródłach.

## Zakres wyłączony

Prywatny najem nie jest zintegrowany z kalkulatorem. Jego odrębny próg i obowiązkowa proporcja części odliczeń między JDG a najmem w PIT-28 wymagają osobnego modelu. Nie należy mechanicznie dodawać jego podatku do każdego wariantu, zakładając zawsze brak wpływu na ranking.

Nie obejmujemy kwalifikacji indywidualnego PKWiU, ustalenia rezydencji, podatków zagranicznych, IP Box/B+R, PIT-0, ulg na dzieci, strat wcześniejszych lat, sprzedaży majątku, kasowego PIT, decyzji karty, szczegółowych zaliczek ani formularza zeznania. Koszty i przychody należy podać według właściwych zasad podatkowych, bez podwójnego uwzględnienia składek. Ustawowe prawo do ulg ZUS jest opisane oddzielnie.

## Źródła oficjalne — odczytane treści

- [Ustawa PIT — tekst ujednolicony Sejmu](https://api.sejm.gov.pl/eli/acts/DU/1991/350/text/U/D19910350Lj.pdf), wersja z 16.09.2026. Odczytano art. 6, 9, 9a, 23, 26, 27, 30c i 30h.
- [Ustawa ryczałtowa](https://api.sejm.gov.pl/eli/acts/DU/1998/930/text/U/D19980930Lj.pdf), wersja z 26.08.2026. Odczytano art. 4, 6, 8, 11, 12, 25 i 31.
- [Limit zdrowotnej na liniowym w 2026](https://api.sejm.gov.pl/eli/acts/MP/2025/1274/text/O/M20251274.pdf), obwieszczenie 12.12.2025, publikacja 17.12.2025. Potwierdza 14 100 zł.
- [Ordynacja podatkowa](https://api.sejm.gov.pl/eli/acts/DU/1997/926/text/U/D19970926Lj.pdf), wersja z 08.10.2026, art. 63. Podstawa i podatek do pełnych złotych: końcówki poniżej 50 gr w dół, od 50 gr w górę.
- [PIT-28(27)](https://www.gov.pl/attachment/c556126b-8438-424c-a374-128bc219d479), formularz MF dostępny na [stronie formularzy PIT](https://www.podatki.gov.pl/podatki-firmowe/pit/formularze-pit). Części D, E, F i G potwierdzają kolejność podziału przychodów na stawki przed odliczeniami i proporcje; zdrowotna dotyczy wyłącznie JDG.
- [PIT-36(32)](https://www.gov.pl/attachment/99d2a7a6-437b-4093-b125-4670cce7a428), formularz opisany przez MF jako formularz za 2025, pomocniczo poz. 292, 295 i 296: kolejność zaokrągleń wspólnego PIT zgodna z odczytanymi przepisami 2026.
- [NBP — kurs EUR 01.10.2025](https://api.nbp.pl/api/exchangerates/rates/a/eur/2025-10-01/?format=json), tabela 190/A/NBP/2025, 4,2586; kurs do limitu ryczałtu na 2026.
- [ZUS/MZ: odliczenie zdrowotnej i podstawa składki](https://www.zus.pl/en/-/informacja-w-sprawie-sk%C5%82adki-zdrowotnej), komunikat 21.07.2022, użyty w zakresie skutku zaliczenia zdrowotnej do kosztów, nie dla historycznych kwot limitów.

Tekst PIT zgłosił nieuwzględnioną jeszcze [zmianę DU/2026/1287](https://api.sejm.gov.pl/eli/acts/DU/2026/1287/text/O/D20261287.pdf), którą również odczytano: dodaje art. 52zu o podatku od nadzwyczajnych zysków paliwowych, nie zmienia opisanych formuł. Uwzględniono informację o zmianach z przyszłymi datami 2027/2028; nie zastosowano przyszłych brzmień do 2026. Teksty ujednolicone Sejmu są robocze; źródłem prawa są akty ogłoszone w Dzienniku Ustaw i Monitorze Polskim.

## Ślady weryfikacji tekstów prawnych

[VER: Dz.U. 1991 nr 80 poz. 350, tekst ujednolicony Kancelarii Sejmu z 2026-09-16, api.sejm.gov.pl/eli, sprawdzono 2026-10-13]

[VER: Dz.U. 1998 nr 144 poz. 930, tekst ujednolicony Kancelarii Sejmu z 2026-08-26, api.sejm.gov.pl/eli, sprawdzono 2026-10-13]

[VER: M.P. 2025 poz. 1274, tekst ogłoszony, api.sejm.gov.pl/eli, sprawdzono 2026-10-13]

[VER: Dz.U. 1997 nr 137 poz. 926, tekst ujednolicony Kancelarii Sejmu z 2026-10-08, api.sejm.gov.pl/eli, sprawdzono 2026-10-13]

[VER: Dz.U. 2026 poz. 1287, tekst ogłoszony, api.sejm.gov.pl/eli, sprawdzono 2026-10-13]
