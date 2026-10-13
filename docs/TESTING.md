# Weryfikacja wydania 1.0

Data: 13.10.2026. Wyłącznie fikcyjne scenariusze testowe.

## Testy automatyczne

61 testów, 61 zaliczonych:

- 32 testy PIT, wspólnego rozliczenia, daniny solidarnościowej, ryczałtu i karty.
- 18 testów ZUS, zdrowotnej, MZ+, wakacji składkowych oraz granic i zaokrągleń.
- 11 testów interakcji formularza: okresy, lista przychodów, walidacja, plan ZUS, KUP zdrowotnej, lokalny zapis, druk i bezpieczne wyświetlanie nazw.

Zestawy PIT/ZUS opracowano niezależnie od implementacji na ręcznie liczonych przypadkach. GitHub Actions uruchamia testy na każdym pushu i PR.

## Odbiór publicznej strony

Przeglądarka Chromium, publiczny adres GitHub Pages:

- Wczytanie strony, przykładu oraz trzech wyników.
- Konwersja miesiąc/rok bez zmiany rocznych wyników.
- Dodanie i usunięcie przychodu.
- Mały ZUS Plus: blokada rankingu przed potwierdzeniem warunków i poprawne wyliczenie po potwierdzeniu.
- Brak błędów JavaScript.
- Widok 1440×1000 oraz 390×844: szerokość dokumentu zgodna z viewportem, bez poziomego przepełnienia; wykonane i obejrzane zrzuty.
- Skrót do wyników na telefonie.
- Druk do PDF A4: wygenerowany poprawny dokument, 6 stron dla rozbudowanego przykładu z rozwiniętymi szczegółami.
- Potwierdzenie odpowiedzi HTTP 200 i zgodności plików aplikacji z repozytorium.

Testy potwierdzają opisany model, nie indywidualne prawo konkretnego podatnika do formy, stawki lub ulgi. Przed kolejnym rokiem konieczna jest ponowna aktualizacja parametrów i źródeł.
