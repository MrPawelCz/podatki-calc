# Weryfikacja wydania 1.1

Data: 13.10.2026. Wyłącznie fikcyjne scenariusze testowe.

## Testy automatyczne

**86 testów, 86 zaliczonych** lokalnie oraz w GitHub Actions:

- 32 testy PIT, wspólnego rozliczenia, daniny solidarnościowej, ryczałtu i karty.
- 18 testów ZUS, zdrowotnej, MZ+, wakacji składkowych oraz granic i zaokrągleń.
- 18 dodatkowych regresji niezależnego przeglądu podatkowego: dostępność form, odliczenia społeczne przy innych dochodach, zdrowotna KUP przy stracie, danina oraz zachowanie groszy i ograniczeń odliczeń.
- 18 testów interakcji formularza: okresy, lista przychodów, walidacja z przypisaniem do pól, plan ZUS, KUP zdrowotnej, lokalny zapis, druk, neutralny start, jawny scenariusz zerowy, dostępność form, rozwijanie szczegółów i bezpieczne wyświetlanie nazw.

Zestawy PIT/ZUS opracowano niezależnie od implementacji na ręcznie liczonych przypadkach. GitHub Actions uruchamia testy na każdym pushu i PR.

## Odbiór publicznej strony

Przeglądarka Chromium 155, publiczny adres [GitHub Pages](https://mrpawelcz.github.io/podatki-calc/). **19/19 kontroli przeglądarkowych** ukończonych 13.10.2026 o 12:23:51 UTC przez `npm run test:browser`:

- Neutralny pusty formularz, wczytanie przykładu i zgodność trzech wyników z testowanym silnikiem.
- Konwersja miesiąc/rok bez zmiany rocznych wyników.
- Dodanie i usunięcie przychodu.
- Mały ZUS Plus: przekroczenie granicy przychodu blokuje wynik, poprawna wartość umożliwia obliczenie. W wersji 1.1 niepotwierdzone pozostałe uprawnienia oznaczają symulację warunkową, nie błąd liczbowy.
- Link przy warunkowym wyniku otwiera ustawienia dostępności; niedostępny liniowy i ryczałt nie mogą wygrać rankingu.
- Zapis i ponowne wczytanie scenariusza w odizolowanym kontekście przeglądarki.
- Brak błędów JavaScript.
- Desktop 1440 px oraz szerokości 320, 375, 390, 768 i 1024 px: bez poziomego przepełnienia. Wykonane i obejrzane zrzuty desktop oraz mobilnego porównania.
- Stały skrót na telefonie przewija do początku porównania.
- Automatyczny axe WCAG 2 A/AA i 2.1 A/AA dla przykładu mobilnego: **0 wykrytych naruszeń**. Nie jest to pełna certyfikacja dostępności ani test z czytnikiem ekranu.
- Druk do PDF A4: poprawny dokument, 9 stron dla pełnego formularza i rozwiniętych szczegółów; metadane sprawdzone przez `pdfinfo`.
- HTTP 200 i zgodność SHA-256 `index.html`, `app.js`, `calculator.js`, `styles.css` oraz raportów UX i podatkowego z repozytorium.

Kod aplikacji i jego testy są dostępne w tym repozytorium. Kontrole opisują stan z daty odbioru.

Artefakty: lokalny, ignorowany `test-results/browser/` (zrzuty, PDF, `summary.json`, `accessibility.json`). Nie opublikowano plików użytkownika ani przeglądarkowych danych prywatnych. Wspólne decyzje obu agentów i ich wzajemny odbiór opisano w [UX-REVIEW.md](UX-REVIEW.md) oraz [TAX-REVIEW.md](TAX-REVIEW.md).

Testy potwierdzają opisany model, nie indywidualne prawo konkretnego podatnika do formy, stawki lub ulgi. Przed kolejnym rokiem konieczna jest ponowna aktualizacja parametrów i źródeł.

## Historia

Wydanie 1.0 z 13.10.2026 miało 61 zaliczonych testów (32 PIT, 18 ZUS, 11 UI) oraz odbiór publicznej strony na desktopie i telefonie. Wersja 1.1 zastępuje tamten sposób prezentacji dostępności form i warunków MZ+.
