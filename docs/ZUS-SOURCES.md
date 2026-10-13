# ZUS i zdrowotna — źródła i model 2026

**Sprawdzono 13 października 2026 r.** Zakres: polska jednoosobowa działalność, minimalne podstawy składek społecznych, pełny rok działalności. Kalkulator porównuje roczne obciążenia, nie sporządza deklaracji ZUS ani harmonogramu przelewów.

## Składki społeczne

[ZUS — wysokość składek na ubezpieczenia](https://www.zus.pl/baza-wiedzy/skladki-wskazniki-odsetki/skladki/wysokosc-skladek-na-ubezpieczenia-spoleczne), komunikat 2.02.2026, odczyt 13.10.2026.

Potwierdzone miesięczne kwoty:

| Wariant | Podstawa | Z chorobowym | Bez chorobowego |
|---|---:|---:|---:|
| Pełny, wraz z FP/FS | 5652,00 zł | 1926,76 zł | 1788,29 zł |
| Preferencyjny, bez FP/FS | 1441,80 zł | 456,18 zł | 420,86 zł |

Emerytalne 19,52%, rentowe 8%, chorobowe 2,45%; przyjęte domyślnie wypadkowe 1,67%. Każdą składkę zaokrągla się oddzielnie do grosza. Minimalne wynagrodzenie w 2026 to 4806 zł. Przy pełnej podstawie FP/FS wynosi 138,47 zł i jest wykazywany oddzielnie od społecznych.

[ZUS — Fundusz Pracy](https://www.zus.pl/en/pracujacy/fundusze-pozaubezpieczeniowe/fp), objaśnienie odczytane 13.10.2026: próg obowiązku FP stanowi minimalne wynagrodzenie (z uwzględnieniem innych tytułów), a zwolnienie wiekowe dotyczy kobiet 55+ i mężczyzn 60+. Kalkulator nie rozstrzyga wszystkich zbiegów tytułów. FP/FS nie jest odliczeniem społecznym dla ryczałtu.

## Ulga na start i preferencyjny

[ZUS — warunki ulg](https://www.zus.pl/en/-/ulga-na-start-preferencyjna-podstawa-dzialalnosc-nieewidencjonowana-jakie-sa-warunki-uprawnienia-i-skutk-1), objaśnienie, odczyt 13.10.2026. Ulga na start zwalnia ze społecznych, ale nie ze zdrowotnej. Obejmuje maksymalnie sześć pełnych miesięcy; rozpoczęcie po pierwszym dniu miesiąca pozwala dodatkowo uwzględnić pierwszy niepełny miesiąc. Następnie możliwe są 24 pełne miesiące preferencyjnych. Zawieszenie nie wydłuża tych okresów. Obowiązują warunki dotyczące wcześniejszej działalności i byłego pracodawcy.

## Mały ZUS Plus

Podstawę wyznacza **poprzedni rok**, nie bieżąca prognoza. Potwierdzono w art. 18c [ustawy o systemie ubezpieczeń społecznych](https://api.sejm.gov.pl/eli/acts/DU/1998/887/text/U/D19980887Lj.pdf), tekst ujednolicony z 28.07.2026, odczyt 13.10.2026:

```text
limit = zaokrąglij_do_grosza(120000 / 365 × dni działalności w 2025)
średni dochód miesięczny = zaokrąglij_do_grosza(dochód MZ z 2025 / dni × 30)
podstawa = zaokrąglij_do_grosza(średni dochód miesięczny × 0,5)
podstawę ogranicza się do przedziału 1441,80–5652,00 zł
```

Dochód należy podać po właściwych korektach — m.in. z doliczeniem społecznych wcześniej ujętych w kosztach. Przy poprzednim ryczałcie dochód MZ stanowi połowę przychodu, również zaokrągloną do grosza przed dalszymi działaniami. Wymagane są co najmniej 60 dni działalności w poprzednim roku i spełnienie pozostałych warunków. Zaznaczenie ich w kalkulatorze nie zastępuje weryfikacji uprawnienia.

[ZUS — nowe zasady od 2026](https://www.zus.pl/en/-/%E2%80%9Ema%C5%82y-zus-plus-nowe-zasady-od-2026-r.), objaśnienie odczytane 13.10.2026: od 2026 obowiązuje 36 miesięcy ulgi w kolejnych okresach 60 miesięcy prowadzenia działalności, z nowym okresem liczonym od pierwszego użycia po 2025. Wykorzystanie ulgi przed 2026 nie pomniejsza nowego limitu. Szczególny dodatkowy limit dla uprawnionych z 2023 nie jest automatycznie rozstrzygany.

## Zdrowotna skali i liniowego

[ZUS — komunikat zdrowotnej 2026](https://www.zus.pl/en/-/informacja-w-sprawie-podstawy-wymiaru-sk%C5%82adki-oraz-kwoty-sk%C5%82adki-na-ubezpieczenie-zdrowotne-w-2026-r.), 2.02.2026; [ZUS — stopy zdrowotnej](https://bip.zus.pl/pl/web/guest/firmy/rozliczenia-z-zus/skladki-na-ubezpieczenia/zdrowotne), 24.02.2026. Oba odczytano 13.10.2026.

- Skala: 9% dochodu zdrowotnego.
- Liniowy: 4,9%, z minimum liczonym według 9% minimalnej podstawy.
- Styczeń 2026: minimum 314,96 zł — ostatni miesiąc poprzedniego roku składkowego.
- Luty 2026–styczeń 2027: minimum 432,54 zł.
- Roczne minimum rozliczenia dochodu 2026 przy 12 miesiącach ubezpieczenia: **5190,48 zł**.

Dochód roku kalendarzowego jest rozliczany za rok składkowy luty–styczeń. Dlatego roczne minimum nie jest sumą styczniowego minimum 2026 i jedenastu kolejnych miesięcy. Miesięczne podstawy opierają się na poprzednim miesiącu; sumy płatności w roku kalendarzowym mogą różnić się od rocznej należności.

## Zdrowotna ryczałtu i zaokrąglenie roczne

Komunikat ZUS z 2.02.2026 potwierdza:

| Przychód po właściwym odjęciu zapłaconych społecznych | Podstawa miesięczna | Składka miesięczna |
|---|---:|---:|
| Do 60 000 zł włącznie | 5537,18 zł | 498,35 zł |
| Ponad 60 000 do 300 000 zł włącznie | 9228,64 zł | 830,58 zł |
| Ponad 300 000 zł | 16611,55 zł | 1495,04 zł |

FP/FS ani zdrowotna nie obniżają tego progu. Roczny próg dotyczy wszystkich miesięcy ubezpieczenia, nawet po przekroczeniu dopiero w ostatnim miesiącu.

**Zaokrąglenie modelu rocznego:** kalkulator stosuje `zaokrąglenie(podstawa miesięczna × 12 × 9%)`, a nie `zaokrąglona składka miesięczna × 12`. Daje to **5980,15 / 9966,93 / 17940,47 zł** dla 2026.

Te trzy kwoty są **wyliczeniem modelu z oficjalnych podstaw 2026**, nie wynikiem urzędowego kalkulatora dla 2026. [Oficjalny kalkulator roczny ZUS](https://www.zus.pl/firmy/przedsiebiorco-przeczytaj-wazne/kalkulator-rocznej-skladki-zdrowotnej) w dniu sprawdzenia pozwalał wybrać najwyżej 2025. Zweryfikowany na nim test kontrolny dla **2025**: ryczałt, przychód testowy 50 000 zł, 12 miesięcy → roczna podstawa **61 554,12 zł**, roczna składka **5539,87 zł**. Potwierdza to metodę zaokrąglenia od rocznej podstawy, zastosowaną w modelu 2026. Nie jest to test kalkulatora urzędowego za 2026.

Podstawy roczne i progi odczytano również w art. 79, 79a i 81 [ustawy o świadczeniach opieki zdrowotnej](https://api.sejm.gov.pl/eli/acts/DU/2004/2135/text/U/D20042135Lj.pdf), tekst ujednolicony z 3.08.2026.

## Odliczenia i rzeczywiste płatności

[MF — zdrowotne](https://podatki.gov.pl/ulgi-i-odliczenia/odliczenie-skladek-na-ubezpieczenie-zdrowotne-pit), aktualizacja 24.06.2026; [MF — społeczne](https://www.podatki.gov.pl/ulgi-i-odliczenia/odliczenie-skladek-na-ubezpieczenie-spoleczne-pit), aktualizacja 6.10.2026. Odczyt 13.10.2026.

Skala nie odlicza zdrowotnej. Liniowy: wspólny limit KUP/odliczenia zdrowotnej **14 100 zł w 2026**. Ryczałt: **50% zapłaconej zdrowotnej** od przychodu; odliczenia dzieli się proporcjonalnie między stawki. Społeczne odlicza się tylko raz.

[ZUS — stanowisko MZ o odliczeniach](https://www.zus.pl/en/-/informacja-w-sprawie-sk%C5%82adki-zdrowotnej), 21.07.2022, odczyt 13.10.2026: przy liniowym zdrowotna w KUP obniża także podstawę zdrowotnej; odliczenie tylko od dochodu PIT jej nie obniża. Historyczna kwota limitu z tej strony nie jest używana — limit 2026 potwierdza MF.

Domyślnie porównywarka przybliża zapłacone składki należnymi obciążeniami rocznymi i odlicza zdrowotną liniowego od dochodu. Opcja KUP wymaga podania faktycznie zapłaconej kwoty; nie stosuje się fikcyjnej rocznej pętli, w której jeszcze niezapłacona składka obniża samą siebie.

## Wakacje składkowe

[ZUS — wakacje składkowe](https://www.zus.pl/-/zwolnienie-z-op%C5%82acania-sk%C5%82adek-zus-wakacje-sk%C5%82adkowe), objaśnienie 26.06.2026, odczyt 13.10.2026. Jeden miesiąc na wniosek, przy spełnieniu warunków; obejmuje własne społeczne oraz FP/FS, nie obejmuje zdrowotnej. Dla chorobowego wymagane jest odpowiednie wcześniejsze podleganie. Warunki obejmują m.in. liczbę ubezpieczonych, przychód, byłego pracodawcę i pomoc de minimis.

Model pomniejsza również własne odliczane składki, ponieważ miesiąc finansowany z budżetu nie jest własną płatnością. Przy ryczałcie utrata tego odliczenia może podnieść próg zdrowotnej — oszczędność netto nie zawsze równa się umorzonym składkom.

## Ślad weryfikacji i granice

Odczytano skryptem z API Sejmu: ustawa systemowa art. 17a, 18, 18a, 18c, 18d, 22; zdrowotna art. 79, 79a, 81.

[VER: Dz.U. 1998 nr 137 poz. 887, tekst ujednolicony Kancelarii Sejmu z 2026-07-28, api.sejm.gov.pl/eli, sprawdzono 2026-10-13]

[VER: Dz.U. 2004 nr 210 poz. 2135, tekst ujednolicony Kancelarii Sejmu z 2026-08-03, api.sejm.gov.pl/eli, sprawdzono 2026-10-13]

Skrypt nie zgłosił ogłoszonych zmian pominiętych w pobranych tekstach. Zmiany przyszłe sygnalizowane w nagłówkach nie zmieniają użytych tutaj brzmień na 2026. Tekst ujednolicony jest narzędziem informacyjnym; źródłem prawa jest Dziennik Ustaw.

Nie zautomatyzowano pełnego badania uprawnień, zbiegów tytułów, KRUS/ubezpieczeń zagranicznych, szczególnych zwolnień zdrowotnej, rozliczenia sprzedaży środków trwałych, remanentu, kasowego PIT ani proporcji dziennych społecznych. Kwoty wejściowe powinny odpowiadać właściwym przychodom i kosztom podatkowym dla modelowanego przypadku.
