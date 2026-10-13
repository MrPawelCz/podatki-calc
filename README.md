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

## Ważne założenie

To **pełnoroczny model porównawczy**, nie deklaracja lub kalendarz przelewów. Domyślnie zdrowotna zapłacona do odliczenia jest szacowana jako należność roczna, a społeczne jako kwota planu. Model nie potwierdza indywidualnych uprawnień. Najem prywatny, PIT-0, ulgi dziecięce, IP Box i niepełny rok działalności są poza zakresem.

- [Metodologia](docs/METHODOLOGY.md)
- [Źródła PIT](docs/PIT-SOURCES.md)
- [Źródła ZUS](docs/ZUS-SOURCES.md)

Obliczenia opierają się na aktualnych przepisach i oficjalnych komunikatach MF oraz ZUS.

## Uruchomienie i testy

Wymagane Node 22+ i Python 3 do lokalnego serwera; brak zależności produkcyjnych, frameworka i procesu budowania.

```sh
npm test
npm run serve
```

Serwer lokalny: `http://127.0.0.1:8766/`. Statyczne pliki mogą być hostowane na GitHub Pages. Testy zawierają niezależne ręczne przypadki PIT i ZUS oraz regresje granic i zaokrągleń. Przed każdą zmianą parametrów podatkowych należy ponownie zweryfikować źródła i datę obowiązywania.
