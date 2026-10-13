# Weryfikacja wydania 1.2

Data: 13.10.2026. Wyłącznie fikcyjne scenariusze testowe.

## Testy automatyczne

**115 testów, 115 zaliczonych** lokalnie oraz w GitHub Actions:

- 32 testy PIT, wspólnego rozliczenia, daniny solidarnościowej, ryczałtu i karty.
- 18 testów ZUS, zdrowotnej, MZ+, wakacji składkowych oraz granic i zaokrągleń.
- 18 dodatkowych regresji niezależnego przeglądu podatkowego: dostępność form, odliczenia społeczne przy innych dochodach, zdrowotna KUP przy stracie, danina oraz zachowanie groszy i ograniczeń odliczeń.
- 28 testów interakcji formularza: okresy, lista przychodów, walidacja z przypisaniem do pól, plan ZUS, KUP zdrowotnej, lokalny zapis, druk, neutralny start, jawny scenariusz zerowy, dostępność form, rozwijanie szczegółów, opisy stawek, dialog udostępniania, odtwarzanie linku, pierwszeństwo przed lokalnym zapisem, reset, kopiowanie i odmowa schowka, anulowanie systemowego udostępniania oraz bezpieczne wyświetlanie nazw.
- 19 testów kodowania linków: pełne odtwarzanie danych i wyników, wszystkie ustawienia i stawki, nazwy Unicode, zachowanie precyzji, zamrożone domyślne wartości formatu v1, zwykłe kotwice oraz odrzucanie błędnych wersji/lat, typów, kluczy, wielkości danych i manipulacji prototypem.

Zestawy PIT/ZUS opracowano niezależnie od implementacji na ręcznie liczonych przypadkach. GitHub Actions uruchamia testy na każdym pushu i PR.

## Odbiór publicznej strony

Przeglądarka Chromium 155, publiczny adres [GitHub Pages](https://mrpawelcz.github.io/podatki-calc/). **23/23 kontrole przeglądarkowe** ukończone 13.10.2026 o 13:35:22 UTC przez `npm run test:browser`:

- Neutralny pusty formularz, wczytanie przykładu i zgodność trzech wyników z testowanym silnikiem.
- Konwersja miesiąc/rok bez zmiany rocznych wyników.
- Dodanie i usunięcie przychodu.
- Mały ZUS Plus: przekroczenie granicy przychodu blokuje wynik, poprawna wartość umożliwia obliczenie. W wersji 1.1 niepotwierdzone pozostałe uprawnienia oznaczają symulację warunkową, nie błąd liczbowy.
- Link przy warunkowym wyniku otwiera ustawienia dostępności; niedostępny liniowy i ryczałt nie mogą wygrać rankingu.
- Zapis i ponowne wczytanie scenariusza w odizolowanym kontekście przeglądarki.
- Rzeczywiste skopiowanie linku do schowka Chromium, otwarcie go w drugiej karcie, odtworzenie polskich znaków/emoji, kwot i miesięcznych wyników bez nadpisania istniejącego lokalnego zapisu. Reset usuwa fragment i nie odtwarza danych po odświeżeniu.
- Żądania drugiej karty kierowane tylko do tego samego hostingu; bez `scenario=` w adresach żądań sieciowych. Dane pozostały we fragmencie URL.
- Błędny link daje komunikat i neutralne wyniki; opis stawki podąża za wyborem, a fokus klawiatury pozostaje przy selektorze. Rozwijana ściąga zawiera dziewięć opcji.
- Dialog udostępniania mieści się w 320/390 px, fokus zaczyna się przy kopiowaniu, Escape wraca do przycisku „Udostępnij”. Objęty osobnym automatycznym audytem axe: 0 naruszeń. W lokalnym przeglądzie UX potwierdzono też ręczne zaznaczanie linku przy odmowie schowka. Systemowe wysyłanie przez aplikację zewnętrzną nie było wykonywane; anulowanie i fallback pokrywają testy DOM.
- Brak błędów JavaScript.
- Desktop 1440 px oraz szerokości 320, 375, 390, 768 i 1024 px: bez poziomego przepełnienia. Wykonane i obejrzane zrzuty desktop oraz mobilnego porównania.
- Stały skrót na telefonie przewija do początku porównania.
- Automatyczny axe WCAG 2 A/AA i 2.1 A/AA dla przykładu mobilnego: **0 wykrytych naruszeń**. Nie jest to pełna certyfikacja dostępności ani test z czytnikiem ekranu.
- Druk do PDF A4: poprawny dokument, 9 stron dla pełnego formularza i rozwiniętych szczegółów; metadane sprawdzone przez `pdfinfo`.
- HTTP 200 i zgodność SHA-256 `index.html`, `app.js`, `calculator.js`, `styles.css`, `share.js`, `rates.js` oraz przewodnika stawek z repozytorium.

Kod aplikacji i jego testy są dostępne w tym repozytorium. Kontrole opisują stan z daty odbioru.

Artefakty: lokalny, ignorowany `test-results/browser/` (zrzuty, PDF, `summary.json`, `accessibility.json`). Nie opublikowano plików użytkownika ani przeglądarkowych danych prywatnych. Wspólne decyzje obu agentów i ich wzajemny odbiór opisano w [UX-REVIEW.md](UX-REVIEW.md) oraz [TAX-REVIEW.md](TAX-REVIEW.md).

Testy potwierdzają opisany model, nie indywidualne prawo konkretnego podatnika do formy, stawki lub ulgi. Przed kolejnym rokiem konieczna jest ponowna aktualizacja parametrów i źródeł.

## Historia

Wydanie 1.0 z 13.10.2026 miało 61 zaliczonych testów (32 PIT, 18 ZUS, 11 UI) oraz odbiór publicznej strony na desktopie i telefonie. Wersja 1.1 zastępuje tamten sposób prezentacji dostępności form i warunków MZ+.

Wydanie 1.1 miało 86/86 testów i 19/19 kontroli publicznej strony. Wydanie 1.2 dodaje udostępnianie oraz objaśnienia stawek, bez zmiany silnika podatkowego.
