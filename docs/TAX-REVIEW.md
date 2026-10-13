# Niezależny przegląd modelu podatkowego — v1.1

**13 października 2026 · Polska · pełny rok JDG 2026**

Przegląd wykonał agent AI w roli analityka podatkowego. Nie jest to opinia licencjonowanego doradcy ani weryfikacja indywidualnych uprawnień właściciela działalności. Zakres obejmuje opisany model decyzyjny, nie kompletne zeznanie lub kalendarz wpłat.

## Najważniejsze poprawki

1. **Dostępność form oddzielona od opłacalności.** Liniowy i ryczałt mają stan niepotwierdzony / zadeklarowane spełnienie warunków / zadeklarowany brak prawa. Niepotwierdzone opcje pozostają warunkową symulacją. Zadeklarowana niedostępność wyłącza opcję z rankingu bez ukrywania obliczenia. Weryfikacja PKWiU, pracodawcy, limitu przychodów poprzedniego roku i terminów nie jest automatyczna.
2. **Mały ZUS Plus: brak wiedzy nie jest błędną kwotą.** Modelowane niespełnienie limitu przychodu lub 60 dni blokuje wynik. Brak potwierdzenia pozostałych uprawnień oznacza warunkową symulację całego planu. Liczby i deklaracje są oddzielne.
3. **Niezużyte społeczne nie znikają przy stracie/niskim dochodzie.** W liniowym i ryczałcie społeczne odliczamy najpierw w JDG; niewykorzystana część może obniżyć własny pozostały dochód skali. W karcie społeczne mogą pomniejszać ten inny dochód, ale nie podatek z decyzji. Nie ma podwójnego odliczenia, przenoszenia straty JDG na etat ani przenoszenia składek na małżonka. To ustalona polityka alokacji, nie optymalizator dowolnego podziału między źródłami.
4. **Zdrowotna w kosztach liniowego przy stracie.** Koszt kwalifikowanej, zapłaconej składki w limicie 14 100 zł nie jest ograniczony dodatnim dochodem i może zwiększyć stratę. Najpierw zmienia dochód JDG, potem wykorzystanie społecznych. Odliczenie zdrowotnej wyłącznie od dochodu jest nadal ograniczone dochodem. Przyszła wartość straty pozostaje poza zakresem.
5. **Jeden punkt odniesienia całego porównania.** `pit = totalPit − baselinePit` i `solidarity = totalSolidarity − baselineDs` obowiązują dla każdej formy. Dodatkowe `businessPit` (liniowy, ryczałt, karta) pokazuje sam podatek działalności, a `otherSocialDeduction` wyjaśnia wpływ społecznych na pozostały dochód. Korzyść z odliczeń może prowadzić do ujemnej zmiany PIT/daniny.
6. **Próg zdrowotnej bez podwójnego odliczenia.** Przy ryczałcie społeczne odliczone już od dochodu PIT nie pomniejszają ponownie przychodu progowego zdrowotnej.
7. **Groszowe proporcje sumują się do całości.** Przy wielu stawkach niezależne zaokrąglanie każdego odliczenia mogło zgubić/stworzyć grosz. Zastosowano metodę największych reszt po zsumowaniu tych samych stawek. Kolejność pozycji i rozbijanie jednej pozycji na kilka tej samej stawki nie zmieniają wyniku. To konwencja modelu, nie obietnica zgodności z zaokrąglonymi udziałami procentowymi deklaracji PIT-28.
8. **Wykorzystane a żądane odliczenia.** Szczegóły ryczałtu i karty pokazują użyte odliczenie zdrowotnej, nie kwotę niezdolną już obniżyć podatku/przychodu. Karta zachowuje uproszczenie równych miesięcznych decyzji i składek zapłaconych równych należnym; ręczne płatności liniowego/ryczałtu nie obejmują karty.
9. **Zaokrąglenie daniny jest jawne.** Najpierw podstawa do złotego, potem 4% i należność do złotego. Dotychczasowe przykłady graniczne nadal dają te same kwoty.

## Co ponownie potwierdzono

- Z komunikatu ZUS 2026: pełna podstawa 5 652 zł; preferencyjna 1 441,80 zł; z chorobowym odpowiednio 1 926,76 zł (łącznie z FP/FS) i 456,18 zł miesięcznie. Składniki zaokrąglane oddzielnie.
- Z komunikatu ZUS 2026 i art. 81: minimum zdrowotnej roku składkowego luty 2026–styczeń 2027; trzy progi ryczałtu i ich podstawy. Nie pomylono należności rocznej z sumą płatności kalendarzowych.
- Z obwieszczenia MP/2025/1274: limit zdrowotnej liniowego 14 100 zł w 2026, nie historyczna kwota bazowa z tekstu ustawy.
- Z art. 18c: MZ+ z poprzedniego roku, kolejność zaokrągleń i ustawowe minimum/maksimum. Kwoty poprzedniego dochodu wymagają prawidłowych korekt użytkownika.
- Z art. 11 ustawy ryczałtowej: proporcja odliczeń oraz 50% kwalifikowanej zapłaconej zdrowotnej; koszty operacyjne/FP nie obniżają ryczałtu.
- Z art. 26, 30c i 30h PIT: składki odliczane tylko raz, rozdzielenie źródeł i odliczeń daniny.

Przypadki kontrolne do obecnych zmian są niezależne od kodu silnika i nie zawierają danych użytkownika. Przykładowo: przy pełnych społecznych **21 459,48 zł rocznie**, stracie JDG i innym dochodzie skali **100 000 zł**, niewykorzystane społeczne obniżają jego podatek z **8 400 zł do 5 825 zł**. Strata JDG nie jest odliczana. Przy karcie **500 zł miesięcznie** sam podatek karty wynosi **5 016 zł** przy przyjętych płatnościach, a niezużyte społeczne mogą obniżać wyłącznie osobny PIT skali.

## Testy i odbiór

Dodano **18 regresji** w `tests/tax-advisor.test.js`: dostępność/wykluczenia, migracja starego scenariusza, twarde warunki MZ+, strata i niewykorzystane społeczne, zdrowotna KUP, indywidualny dochód małżonka, danina, konserwacja grosza, brak zależności od kolejności pozycji, ograniczenie odliczenia oraz wspólny punkt odniesienia obciążenia.

Testy silnika nie dowodzą działania opublikowanej strony. Odbiór DOM/przeglądarki i publikacji dokumentowany jest osobno w [TESTING.md](TESTING.md). Komunikaty aplikacji uzgadniane z agentem UX: brak potwierdzenia → warunkowy wynik, zadeklarowany brak prawa → poza rankingiem, nieprawidłowe dane/modelowane warunki liczbowe → blokada wyniku.

## Odczytane źródła

Treści ustaw pobrano w tym przeglądzie narzędziem `prawo.py`, nie wyłącznie odczytano wcześniejszą dokumentację projektu:

- [PIT](https://api.sejm.gov.pl/eli/acts/DU/1991/350/text/U/D19910350Lj.pdf): art. 9a, 23, 26, 30c, 30h; wersja 16.09.2026.
- [Ustawa ryczałtowa](https://api.sejm.gov.pl/eli/acts/DU/1998/930/text/U/D19980930Lj.pdf): art. 6, 8, 11, 12, 31; wersja 26.08.2026.
- [Ustawa systemowa](https://api.sejm.gov.pl/eli/acts/DU/1998/887/text/U/D19980887Lj.pdf): art. 18c; wersja 28.07.2026.
- [Ustawa zdrowotna](https://api.sejm.gov.pl/eli/acts/DU/2004/2135/text/U/D20042135Lj.pdf): art. 81, w szczególności ust. 2 i 2g; wersja 03.08.2026.
- [Ordynacja](https://api.sejm.gov.pl/eli/acts/DU/1997/926/text/U/D19970926Lj.pdf): art. 63; wersja 08.10.2026.
- [Obwieszczenie limitu zdrowotnej 2026](https://api.sejm.gov.pl/eli/acts/MP/2025/1274/text/O/M20251274.pdf): tekst ogłoszony 17.12.2025.
- [Zmiana PIT DU/2026/1287](https://api.sejm.gov.pl/eli/acts/DU/2026/1287/text/O/D20261287.pdf): dodaje art. 52zu od 01.11.2026, bez wpływu na zastosowane stawki. Nie zastosowano przyszłych brzmień na 2027/2028.
- [ZUS — społeczne 2026](https://www.zus.pl/baza-wiedzy/skladki-wskazniki-odsetki/skladki/wysokosc-skladek-na-ubezpieczenia-spoleczne) i [ZUS — zdrowotna 2026](https://www.zus.pl/en/-/informacja-w-sprawie-podstawy-wymiaru-sk%C5%82adki-oraz-kwoty-sk%C5%82adki-na-ubezpieczenie-zdrowotne-w-2026-r.): komunikaty organu z 02.02.2026, odczyt 13.10.2026; bieżące kwoty składek i okresy.
- [MF — odliczenie społecznych](https://www.podatki.gov.pl/ulgi-i-odliczenia/odliczenie-skladek-na-ubezpieczenie-spoleczne-pit): objaśnienie organu, odczyt 13.10.2026; własna zapłata, dochodowy limit i zakaz ponownego odliczenia między PIT-37/PIT-28/PIT-36L.

Robocze teksty ujednolicone Sejmu są pomocą do odczytu, nie samodzielnym źródłem prawa. Nagłówki sygnalizujące przyszłe zmiany i nieuwzględnioną zmianę PIT zostały sprawdzone; nie zastąpiono nimi brzmień właściwych dla 2026.

[VER: Dz.U. 1991 nr 80 poz. 350, tekst ujednolicony Kancelarii Sejmu z 2026-09-16, api.sejm.gov.pl/eli, sprawdzono 2026-10-13]

[VER: Dz.U. 1998 nr 144 poz. 930, tekst ujednolicony Kancelarii Sejmu z 2026-08-26, api.sejm.gov.pl/eli, sprawdzono 2026-10-13]

[VER: Dz.U. 1998 nr 137 poz. 887, tekst ujednolicony Kancelarii Sejmu z 2026-07-28, api.sejm.gov.pl/eli, sprawdzono 2026-10-13]

[VER: Dz.U. 2004 nr 210 poz. 2135, tekst ujednolicony Kancelarii Sejmu z 2026-08-03, api.sejm.gov.pl/eli, sprawdzono 2026-10-13]

[VER: Dz.U. 1997 nr 137 poz. 926, tekst ujednolicony Kancelarii Sejmu z 2026-10-08, api.sejm.gov.pl/eli, sprawdzono 2026-10-13]

[VER: M.P. 2025 poz. 1274, tekst ogłoszony, api.sejm.gov.pl/eli, sprawdzono 2026-10-13]

[VER: Dz.U. 2026 poz. 1287, tekst ogłoszony, api.sejm.gov.pl/eli, sprawdzono 2026-10-13]

## Granice potwierdzenia

Bez indywidualnej kwalifikacji usług, uprawnień ZUS/formy/wspólnego PIT, niepełnego roku, rzeczywistych terminów społecznych, kartowych płatności miesięcznych, podatków zagranicznych, sprzedaży majątku, amortyzacji, remanentu, ulg rodzinnych, IP Box i wcześniejszych strat. Roczne zdrowotne ryczałtu 2026 opierają się na sprawdzonych podstawach i metodzie wcześniejszego testu urzędowego kalkulatora 2025; **nie deklarujemy nowego testu urzędowego kalkulatora za 2026**. Pełny zakres modelu: [METHODOLOGY.md](METHODOLOGY.md).
