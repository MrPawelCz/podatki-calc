# Podatki Calc 2026

**Aplikacja:** https://mrpawelcz.github.io/podatki-calc/

Porównanie opodatkowania polskiej JDG: skala, liniowy, ryczałt i opcjonalna kontynuowana karta podatkowa. Niezależny silnik obliczeń na podstawie źródeł MF, ZUS i ELI, sprawdzonych 13.10.2026.

## Funkcje

- Kilka przychodów i kosztów z osobnymi stawkami ryczałtu.
- Kwoty miesięczne i roczne, automatyczna konwersja.
- Pełny i preferencyjny ZUS, ulga na start, wyliczany Mały ZUS Plus, zbieg z innym tytułem, własny plan 12 miesięcy.
- Chorobowe, stawka wypadkowa, zwolnienie z FP/FS, wakacje składkowe.
- Inny dochód na skali, wspólne rozliczenie z małżonkiem, danina solidarnościowa.
- Rozbicie PIT, społecznych, FP/FS i zdrowotnej; ranking oraz wykresy obciążeń.
- Rzeczywiście zapłacona zdrowotna i odliczenie liniowego od dochodu lub w KUP.
- Zapis tylko na urządzeniu na żądanie, PDF przez drukowanie, widok mobilny.
- Czytelny start bez automatycznej rekomendacji dla pustego formularza; szczegóły składek i założeń rozwijane na żądanie.
- Osobna deklaracja dostępności liniowego i ryczałtu: wynik warunkowy, potwierdzenie użytkownika lub wyłączenie z rankingu.
- **Udostępnij** → **Kopiuj link**: link odtwarza przychody, koszty, okresy i wszystkie ustawienia scenariusza, także plan ZUS i inne dochody. Na obsługiwanych urządzeniach dostępne jest też systemowe „Wyślij przez…”.
- Opisy działalności przy stawkach ryczałtu, wyjaśnienie wybranej stawki i rozwijana ściąga z przykładami oraz PKWiU. Nazwa przychodu nie wybiera stawki automatycznie.

## Udostępnianie danych

Link zawiera dane scenariusza w części po `#` (fragment URL). Ta część nie jest wysyłana do hostingu podczas otwierania strony; kalkulator nie używa bazy scenariuszy ani zewnętrznego skracacza linków. To **kodowanie, nie szyfrowanie**: każdy posiadacz linku może odczytać dane. Skopiowany link możesz przekazać wybranej osobie; komunikator lub inna usługa, do której go wkleisz, również otrzyma ten link.

Link jest kopią danych z chwili utworzenia. Odbiorca może zmieniać swój scenariusz, nie zmieniając Twojego. Po edycji wygeneruj nowy link. Otwarcie linku ma pierwszeństwo przed lokalnym zapisem, ale go nie nadpisuje — zapis nadal wymaga przycisku. Błędny link pokazuje pusty formularz i komunikat, zamiast cudzego lokalnego scenariusza. „Wyczyść” usuwa także scenariusz z paska adresu.

Format v1 jest przypisany do 2026 roku i zachowuje pełną precyzję wartości. Wyniki są przeliczane przez aktualny silnik roku 2026; link nie jest podpisanym ani niezmiennym raportem podatkowym. Przy 30 rozbudowanych pozycjach adres może być długi — należy przekazać go w całości.

## Ważne założenie

To **pełnoroczny model porównawczy**, nie deklaracja lub kalendarz przelewów. Domyślnie zdrowotna zapłacona do odliczenia jest szacowana jako należność roczna, a społeczne jako kwota planu. Model nie potwierdza indywidualnych uprawnień. Najem prywatny, PIT-0, ulgi dziecięce, IP Box i niepełny rok działalności są poza zakresem.

- [Metodologia](docs/METHODOLOGY.md)
- [Źródła PIT](docs/PIT-SOURCES.md)
- [Źródła ZUS](docs/ZUS-SOURCES.md)
- [Wspólny przegląd UX i podatków — wersja 1.1](docs/UX-REVIEW.md)
- [Poprawki po niezależnym przeglądzie podatkowym](docs/TAX-REVIEW.md)
- [Stawki ryczałtu — opisy, przykłady i źródła](docs/RYCZALT-GUIDE.md)

Obliczenia opierają się na aktualnych przepisach i oficjalnych komunikatach MF oraz ZUS.

## Uruchomienie i testy

Wymagane Node 22+ i Python 3 do lokalnego serwera; brak zależności produkcyjnych, frameworka i procesu budowania.

```sh
npm ci
npm test
npm run serve
```

Serwer lokalny: `http://127.0.0.1:8766/`. Statyczne pliki mogą być hostowane na GitHub Pages. Testy zawierają niezależne ręczne przypadki PIT i ZUS, regresje granic i zaokrągleń oraz testy interakcji formularza w lokalnym DOM (jsdom jest wyłącznie zależnością developerską). Przed każdą zmianą parametrów podatkowych należy ponownie zweryfikować źródła i datę obowiązywania.

Odbiór opublikowanej strony (interakcje, szerokości ekranu, zrzuty, PDF i automatyczne kontrole dostępności axe):

```sh
CHROME_BIN="/ścieżka/do/chromium" npm run test:browser
```

Na macOS domyślnie używany jest zainstalowany Google Chrome. `TEST_URL` pozwala wskazać autoryzowany adres wdrożonej wersji testowej; domyślnie sprawdzana jest publiczna aplikacja powyżej. Przeglądarka używa osobnego kontekstu, bez prywatnych plików/cookies. Artefakty trafiają do ignorowanego `test-results/browser/`. Automatyczny audyt dostępności nie zastępuje ręcznej oceny z czytnikiem ekranu.
