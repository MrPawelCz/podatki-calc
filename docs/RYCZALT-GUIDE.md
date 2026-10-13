# Przewodnik po stawkach ryczałtu w kalkulatorze

**Polska · JDG · rok podatkowy 2026 · sprawdzono 13.10.2026**

Treść interfejsu jest w [rates.js](../rates.js). Opisy wyjaśniają istniejące opcje kalkulatora; nie zmieniają stawek ani algorytmu podatku. Podstawą jest ponownie odczytany tekst ustawy, a nie potoczne przyporządkowanie zawodu do stawki.

## Jak korzystać

1. Ustal **rzeczywiście wykonywane czynności**, a nie tylko nazwę stanowiska, wpis w CEIDG lub PKD.
2. Sprawdź, czy ustawa przypisuje do nich szczególną stawkę i grupowanie **PKWiU**. PKD i PKWiU nie są tym samym. Oznaczenie **„ex”** zawęża zakres do wskazanych usług z danego grupowania — nie obejmuje automatycznie całego kodu.
3. Osobno sprawdź prawo do samego ryczałtu. Dopasowanie stawki nie uchyla wyłączeń branżowych ani innych warunków tej formy opodatkowania.
4. Jeśli w jednej JDG są różne czynności, dodaj odrębne pozycje przychodów z właściwymi stawkami. Ustawa wymaga ewidencji pozwalającej określić przychód z poszczególnych rodzajów działalności. Nie wybiera się niższej stawki tylko dlatego, że daje lepszy wynik.

Wskazane przykłady nie są zamkniętym katalogiem, indywidualną klasyfikacją ani interpretacją podatkową dla użytkownika.

## Znaczenie opcji

- **17% — wolne zawody.** Chodzi o zamkniętą definicję ustawową, m.in. tłumaczy, adwokatów, radców prawnych, księgowych i doradców podatkowych, przy osobistym wykonywaniu. Ustawa wskazuje brak zatrudniania osób wykonujących czynności związane z istotą zawodu; nie oznacza to zakazu każdej pomocy administracyjnej. Nie każdy freelancer jest „wolnym zawodem” w tym znaczeniu. Opieka zdrowotna nie trafia do 17% tylko dlatego, że lekarz wykonuje zawód samodzielnie.
- **15% — konkretne usługi z listy ustawowej.** Przykłady: reklama i badanie rynku (PKWiU dział 73), fotografia (74.2), pośrednictwo hurtowe (grupa 46.1), wskazane doradztwo związane z zarządzaniem. Usługi prawne, księgowe i doradztwo podatkowe (dział 69) — gdy nie są świadczone w ramach wolnego zawodu. Stąd sam napis „księgowość” nie wystarcza do rozstrzygnięcia między 15% a 17%.
- **14% — opieka zdrowotna, architektura/inżynieria i projektowanie.** Ustawa wskazuje odpowiednio dział 86, dział 71 i grupowanie 74.1. Nazwa „projektant”, np. w branży IT, nie zastępuje sprawdzenia rzeczywistej usługi i klasyfikacji.
- **12% — wskazane usługi IT.** Obejmuje m.in. usługi związane z oprogramowaniem (PKWiU **ex** 62.01.1), doradztwo dotyczące oprogramowania (**ex** 62.02), doradztwo w zakresie sprzętu (62.02.10.0), instalowanie oprogramowania (**ex** 62.09.20.0), zarządzanie siecią i systemami (62.03.1), a także wskazane w ustawie wydawanie oprogramowania. „Programista”, „tester”, „konsultant” i „IT” nie są samodzielnymi przesłankami stawki. Nie opisujemy testerów automatycznie jako 8,5% ani całego IT jako 12%.
- **10% — kupno i sprzedaż nieruchomości na własny rachunek.** Wskazane w ustawie grupowanie to 68.10.1. To nie ta sama kategoria co pośrednictwo (68.3, 15%), najem własnych nieruchomości (68.20.1, 8,5%/12,5%) lub dowolna usługa budowlana. Przewodnik nie rozszerza modelu o rozliczanie sprzedaży środków trwałych.
- **Stałe 8,5% — usługi bez innej szczególnej stawki oraz wymienione kategorie.** Przykłady: edukacja (dział 85), wykonywanie wyrobów z materiału powierzonego przez klienta, gastronomiczna sprzedaż napojów z alkoholem powyżej 1,5%. Ta opcja **nie przechodzi automatycznie na 12,5% po przekroczeniu 100 tys. zł**. Przed zastosowaniem do usług trzeba wykluczyć właściwą szczególną stawkę.
- **5,5% — działalność wytwórcza, roboty budowlane i wskazane przewozy.** Wytwórczość oznacza powstawanie nowych wyrobów, w tym sprzedaż własnej produkcji. Osobno ustawa wymienia przewóz ładunków taborem samochodowym o **ładowności powyżej 2 ton** — nie o dowolnej dopuszczalnej masie całkowitej. Wytwarzanie z materiału powierzonego przez klienta ma odrębne 8,5%; tego wyjątku nie należy automatycznie przenosić na każdą robotę budowlaną z materiałami inwestora.
- **3% — handel i gastronomia z wyjątkami.** Handel oznacza odsprzedaż wcześniej nabytych towarów w stanie nieprzetworzonym; przykładem jest sklep, także internetowy. To nie to samo co wytwarzanie własnych wyrobów ani pośrednictwo hurtowe. Gastronomia ma wyjątek dla sprzedaży napojów zawierających powyżej 1,5% alkoholu (8,5%). Ten wyjątek gastronomiczny nie znaczy, że każda sklepowa odsprzedaż alkoholu podlega 8,5%. Wyłączenia z prawa do ryczałtu trzeba sprawdzić osobno.
- **8,5% / 12,5% — tylko wskazane kategorie z progiem.** Przykłady: zakwaterowanie (dział 55), wynajem i obsługa własnych/dzierżawionych nieruchomości (68.20.1), badania naukowe i prace rozwojowe (dział 72), wynajem samochodów osobowych bez kierowcy (77.11.10.0). Do 100 tys. zł przychodu obowiązuje 8,5%, od nadwyżki 12,5%. W tej aplikacji pozycje objęte mechanizmem należą do jednej JDG i dzielą jeden próg; zwykłe usługi opodatkowane stałym 8,5% go nie zużywają. **Prywatny najem nie należy do zakresu tego kalkulatora**, mimo że ustawa reguluje go w tym samym punkcie, z odrębnymi zasadami.

Nie dodano osobnej stawki 12,5% bez progu ani nowej opcji 2%; przewodnik dotyczy dziewięciu istniejących opcji porównywarki zwykłej JDG. Nie jest kompletnym katalogiem szczególnych przychodów i podatków.

## Zakres odczytu i źródło

Odczyt wykonano przez `prawo.py art DU/1998/930 4 12` w tej rozmowie 13.10.2026:

- **Art. 4 ust. 1 pkt 1–4:** działalność usługowa, gastronomia, handel, wytwórczość.
- **Art. 4 ust. 1 pkt 11:** ustawowa definicja wolnego zawodu i wykonywania osobiście.
- **Art. 4 ust. 4:** znaczenie „ex” przy PKWiU.
- **Art. 12 ust. 1 pkt 1–7:** stawki i zakresy kategorii użytych w przewodniku.
- **Art. 12 ust. 3:** rozdzielenie rodzajów działalności w ewidencji przy kilku stawkach.
- **Art. 12 ust. 14:** odrębność progu dla działalności i najmu prywatnego; aplikacja obejmuje tylko działalność jednego podatnika.

Źródło: [ustawa z 20 listopada 1998 r. o zryczałtowanym podatku dochodowym — tekst ujednolicony Sejmu](https://api.sejm.gov.pl/eli/acts/DU/1998/930/text/U/D19980930Lj.pdf), wersja **26.08.2026**, status `IN_FORCE`, odczyt **13.10.2026**. Skrypt nie zgłosił pominiętych ogłoszonych zmian. Nagłówek sygnalizuje przyszłą zmianę od 01.01.2027; odczytane jednostki art. 4 i art. 12 nie przedstawiają alternatywnego przyszłego brzmienia. Przewodnik odnosi się do roku 2026, nie prognozuje reguł na 2027.

Tekst ujednolicony jest roboczą pomocą do odczytu; źródłem prawa jest akt ogłoszony. Nie odczytywano indywidualnej umowy, dokumentów podatnika ani jego interpretacji KIS i nie wydano indywidualnej kwalifikacji PKWiU. Przykłady z kodami odnoszą się do zakresów wskazanych w samej ustawie, nie do automatycznego przypisania kodu dowolnej usłudze o podobnej nazwie.

[VER: Dz.U. 1998 nr 144 poz. 930, tekst ujednolicony Kancelarii Sejmu z 2026-08-26, api.sejm.gov.pl/eli, sprawdzono 2026-10-13]
