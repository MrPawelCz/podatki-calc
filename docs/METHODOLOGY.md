# Metodologia — Podatki Calc 2026

Stan weryfikacji: 13 października 2026. Silnik: `calculator.js`. Źródła: [PIT](PIT-SOURCES.md), [ZUS](ZUS-SOURCES.md).

## Cel i zakres

Porównanie ekonomicznego obciążenia pełnego roku aktywnej polskiej JDG: skala, liniowy, ryczałt; opcjonalnie kontynuowana karta podatkowa. To nie deklaracja ani harmonogram miesięcznych przelewów. Nie wskazuje, czy działalność kwalifikuje się do wybranej formy, stawki lub ulgi. Pola ZUS są deklaracją uprawnień. Przegląd v1.1: [raport podatkowy](TAX-REVIEW.md).

Dostępność liniowego i ryczałtu ma trzy stany: niepotwierdzona, zadeklarowane spełnienie warunków, zadeklarowany brak uprawnienia. Niepotwierdzone formy pozostają w **warunkowej symulacji**. Brak uprawnienia wyłącza formę z rankingu, ale nie ukrywa obliczenia. Nawet deklaracja spełnienia warunków nie stanowi indywidualnej kwalifikacji przez aplikację. Skala jest formą podstawową, przy zachowaniu warunków wskazanych ulg. Błędne kwoty i niespełnione modelowane warunki liczbowe blokują wyniki.

Wszystkie przychody i koszty są kwotami podatkowymi bez VAT podlegającego odliczeniu. Przy VAT nieodliczalnym jego część może być kosztem; użytkownik wprowadza prawidłową kwotę. Koszty nie obejmują już składek społecznych, zdrowotnej ani FP/FS — są liczone osobno. Model utożsamia koszty podatkowe z ekonomicznym wydatkiem i nie modeluje amortyzacji/cashflow.

Dowolna pozycja przychodowa ma kwotę przychodu, koszt i stawkę ryczałtu. Wszystkie pozycje są działalnością tego samego podatnika. Okres miesięczny oznacza powtarzalną kwotę razy 12. Przełączanie okresu zachowuje roczną wartość w pamięci obliczeń; wyświetlenie miesięczne jest zaokrąglone do grosza. Zmiana tak wyświetlonej kwoty jest nowym wejściem.

Wynik „miesięcznie” jest rocznym wynikiem podzielonym przez 12. Nie służy do wpłaty zaliczki podatkowej.

## ZUS społeczny

Każdy miesiąc planu ma wariant: pełny, preferencyjny, ulga na start, MZ+, inny tytuł zwalniający ze społecznych. Składniki liczymy osobno do groszy i sumujemy: emerytalne, rentowe, chorobowe, wypadkowe. FP/FS pozostaje oddzielną pozycją.

Pełna podstawa 5 652 zł, preferencyjna 1 441,80 zł. MZ+:

1. Limit przychodu poprzedniego roku = zaokrąglone do grosza `120000 / 365 × dni działalności 2025`.
2. Dochód MZ za 2025: wpisany dochód powiększony przez użytkownika o społeczne ujęte w kosztach; przy ryczałcie/karcie z VAT: zaokrąglone do grosza 50% przychodu.
3. Przeciętny dochód miesięczny = zaokrąglone do grosza `dochód / dni × 30`.
4. Podstawa = zaokrąglona do grosza połowa tego dochodu, ograniczona do przedziału 1 441,80–5 652 zł.
5. Co najmniej 60 dni i limit przychodu weryfikowane liczbowo; brak potwierdzenia pozostałych warunków oznacza warunkową symulację dla wszystkich form, a nie błąd kwoty. Potwierdzenie należy do użytkownika. Nowe okresy 36/60 od 2026. Nie modelujemy dodatkowych uprawnień przejściowych za 2023.

FP/FS naliczamy, gdy podstawa JDG osiąga 4 806 zł i brak wskazanego zwolnienia. Nie sumujemy podstaw z innych tytułów; takie zbiegi wymagają osobnego wyliczenia. Przełącznik innego tytułu nie bada wynagrodzenia etatowego ani miesięcznych zmian uprawnień.

Wakacje dotyczą jednego przyznanego miesiąca. Obciążenie i odliczenia społecznych oraz FP/FS wynoszą w nim zero; zdrowotna pozostaje. Nie zakładamy wakacji domyślnie.

Ulga na start przechodzi po wskazanych miesiącach w preferencyjny ZUS. Dopuszczalne 7 miesięcy wymaga pierwszego niepełnego miesiąca rozpoczęcia w styczniu; model nadal liczy wprowadzony pełnoroczny przychód. Nie modelujemy proporcjonalnych składek społecznych za niepełne miesiące, zawieszenia lub rozpoczęcia w połowie roku.

## PIT i zdrowotna

Oznaczenia: R — przychód, K — koszty operacyjne, S — zapłacone społeczne z planu, F — FP/FS, O — inny dochód na skali po jego własnych kosztach i składkach, D — pozostałe wpisane odliczenia.

Społeczne przyjmujemy jako zapłacone w kwocie rocznego planu. Nie rozliczamy przesunięcia grudzień/styczeń, dopłat ani zwrotów społecznych. Społeczne odliczamy najpierw w JDG, a niezużytą część od własnego innego dochodu skali; w karcie całość może trafić na ten inny dochód. Nie przenosimy ich na dochód małżonka i nie optymalizujemy dowolnego podziału między źródłami według stawek. Inne odliczenia ograniczamy do dodatniego dochodu JDG i nie przenosimy ich na etat; przy ryczałcie do przychodu. Wpisywać można wyłącznie odliczenia przysługujące we wszystkich porównywanych formach. Ulgi od podatku, straty z poprzednich lat, PIT-0 i ulgi dziecięce są poza zakresem.

### Skala

- Podstawa skali: `max(0, max(0,R−K−F) + O − S − D_wykorzystane)`.
- Strata działalności nie obniża etatu. Społeczne odliczane od dochodu mogą obniżyć pozostały dochód na skali również przy stracie JDG.
- Podatek: do 120 000 zł podstawy 12% minus 3 600 zł, nie mniej niż zero; powyżej 10 800 zł + 32% nadwyżki.
- Zdrowotna: `max(5190,48; 9% × max(0,R−K−F−S))`; bez odliczenia zdrowotnej.

### Liniowy

- Dochód przed odliczeniami: `max(0,R−K−F−S)`.
- Zdrowotna należna: 4,9% dochodu zdrowotnego, minimum 5 190,48 zł.
- Domyślnie odliczamy zdrowotną od dochodu PIT, nie jako KUP. Przy braku własnej kwoty przyjmujemy zapłaconą równą oszacowanej należności rocznej. To jawne uproszczenie, nie rzeczywisty cashflow płatności.
- Zdrowotna odliczana **od dochodu** jest ograniczona do zapłaconej kwoty, limitu 14 100 zł oraz dodatniego dochodu po społecznych. PIT 19% pozostałej podstawy.
- Tryb zdrowotnej w KUP wymaga ręcznego wpisania kwoty zapłaconej. W granicach tego samego limitu zmniejsza dochód i podstawę zdrowotnej. Koszt zdrowotnej nie jest ograniczony do bieżącego dodatniego dochodu: może tworzyć/powiększać stratę, której nie odliczamy od etatu. Najpierw obniża wynik JDG, a następnie od dodatniego wyniku odliczamy społeczne; niezużyte społeczne mogą pomniejszyć własny inny dochód skali. Nie rozwiązujemy ukrytej pętli „składka od dochodu po odjęciu tej samej należnej składki”.
- Nadwyżek zdrowotnej odliczanej od dochodu i pozostałych odliczeń D nie przenosimy na etat ani przyszły rok. Wyjątkiem są niezużyte społeczne, jak opisano powyżej; rozliczenie straty KUP w przyszłych latach jest poza zakresem.

### Ryczałt

- Koszty K i FP/FS nie obniżają podatku ani progu zdrowotnej, ale obniżają pozostającą kwotę.
- Zdrowotna: próg od `max(0,R−S_pozostałe)`, gdzie S_pozostałe nie obejmuje składek odliczonych już od innego dochodu na skali; do 60 000 zł włącznie, do 300 000 zł włącznie i powyżej.
- Podstawy miesięczne 5 537,18 / 9 228,64 / 16 611,55 zł. Należność roczna to 9% dwunastokrotności podstawy, zaokrąglona do grosza: 5 980,15 / 9 966,93 / 17 940,47 zł. Roczne rozliczenie danego progu obejmuje wszystkie miesiące, a nie tylko okres po przekroczeniu.
- Wzór rocznych zaokrągleń zweryfikowany testem urzędowego kalkulatora dla 2025; parametry 2026 z komunikatu ZUS. Kalkulator urzędowy roku 2026 nie był jeszcze dostępny podczas audytu. Nie są to trzy opublikowane wyniki tego narzędzia za 2026.
- Odliczenia od przychodu: S + 50% zapłaconej zdrowotnej + D; nie więcej niż R. Jawna kolejność modelu to najpierw społeczne, potem zdrowotna, następnie D. Pola wynikowe pokazują wykorzystane kwoty; niezużyte społeczne mogą pomniejszyć własny inny dochód skali, ale nie obniżają wtedy ponownie progu zdrowotnej ryczałtu. Domyślnie zapłacona zdrowotna = należna; można wpisać rzeczywistą kwotę.
- Odliczenia dzielimy proporcjonalnie według udziału przychodów każdej stawki. Pozycje tej samej stawki sumujemy. Reszty groszowe rozdzielamy metodą największych reszt, z jednoznacznym rozstrzyganiem remisu według rosnącej stawki. Suma przypisanych odliczeń zawsze odpowiada odliczeniu łącznemu do grosza. To konwencja modelu planistycznego, nie odwzorowanie procentów formularza PIT-28.
- Dla wariantu 8,5%/12,5% najpierw dzielimy przychód według wspólnego progu 100 000 zł, dopiero potem proporcjonalnie przypisujemy odliczenia. Wszystkie progresywne pozycje JDG mają wspólny próg. Zwykłe usługi 8,5% nie zużywają tego progu.
- Nie obejmujemy prywatnego najmu. Przy najmie i JDG w jednym PIT-28 potrzebna jest inna proporcja części odliczeń. Stawka rolnicza 2% nie jest opcją zwykłej JDG.

### Karta

Wyłącznie kontynuacja przez osoby uprawnione, nie forma dostępna dla nowej działalności. Kwota z decyzji US jest wpisywana ręcznie. Zdrowotna 432,54 zł miesięcznie. Od miesięcznego podatku odejmujemy 19% miesięcznej zdrowotnej, ograniczamy do zera i zaokrąglamy podatek do złotego; sumujemy 12 miesięcy. Zakładamy zapłaconą zdrowotną równą należnej, bez przenoszenia nadwyżek i bez ulg w decyzji US. Pola własnej zdrowotnej liniowego/ryczałtu nie zmieniają karty. Karta nie daje wspólnego rozliczenia; zapłacone społeczne mogą jednak pomniejszać własny inny dochód skali, nie sam podatek z decyzji.

## Rodzina i danina

Przy wspólnym rozliczeniu na skali: suma podstaw podatnika i małżonka / 2, zaokrąglenie połowy do pełnego złotego, skala, razy dwa, zaokrąglenie podatku. Małżonek ma jedynie wskazany dochód skali i nie prowadzi aktywnej działalności opodatkowanej liniowo/ryczałtem. Pozostałe warunki wspólnego rozliczenia potwierdza użytkownik.

Punkt odniesienia to osobny PIT innych dochodów bez JDG (i małżonka, gdy porównanie wspólne jest włączone). „Zmiana PIT” **w każdej formie** jest różnicą podatku gospodarstwa względem tego punktu. Może być ujemna dzięki wspólnemu rozliczeniu albo wykorzystaniu składek społecznych przy innych dochodach. Dla liniowego, ryczałtu i karty osobno pokazujemy także sam podatek JDG (`businessPit`). Pozostałe formy nie korzystają ze wspólnego rozliczenia. Kwota „zostaje z JDG” nie jest dochodem netto całej rodziny ani wynagrodzeniem netto z etatu.

Danina solidarnościowa: 4% ponad indywidualne 1 mln zł uwzględnionych dochodów skali/liniowego. Łączymy własny dochód JDG i O; małżonek ma osobny próg, nawet przy wspólnym PIT. Przychody ryczałtu i karty nie zwiększają podstawy. Odliczenie niezużytych społecznych od innych dochodów objętych daniną może zmniejszyć daninę względem punktu odniesienia. Społeczne i kwalifikowane odliczenie zdrowotnej liniowego obniżają podstawę; zwykłe odliczenia D, np. IKZE, nie. Nie modelujemy dochodów kapitałowych, zagranicznych i strat z innych lat. Wynik pokazuje przyrost daniny po dodaniu JDG względem innych dochodów.

## Zaokrąglenia i ograniczenia precyzji

Składniki społecznych, podstawy MZ+ i składka zdrowotna — do grosza, połowa w górę. Podstawy PIT — do pełnego złotego, następnie należny PIT do złotego. Ryczałt: odliczenia przydzielone do stawek do grosza, podstawy według stawek do złotego, suma podatków do złotego. Podstawa daniny i następnie danina — do złotego. Kwoty wynikowe i koszty — grosze. Poszczególne pozycje mogą różnić się minimalnie od wyliczeń formularza przy skrajnych proporcjach lub innych metodach alokacji grosza; w szczególności ten model nie rekonstruuje procentów udziału zaokrąglanych w każdym historycznym formularzu.

Brak modułu zaliczek miesięcznych, księgowania faktur, kasowego PIT, remanentów, amortyzacji, sprzedaży środków trwałych, IP Box, szczególnych zwolnień zdrowotnych, KRUS, zagranicznych systemów i pełnego zbiegu tytułów. Nie jest to pełny audyt indywidualnego rozliczenia. Przed zmianą formy należy potwierdzić klasyfikację usług, uprawnienia i rzeczywiste płatności.

## Prywatność

Bez backendu, logowania, zewnętrznych fontów i analityki. Kwoty nie opuszczają przeglądarki. Zapis scenariusza do `localStorage` wyłącznie po kliknięciu; „Wyczyść” usuwa ten zapis. GitHub Pages obsługuje standardowe żądania plików statycznych. Druk/PDF realizuje przeglądarka.
