/** Plain-language guide to existing calculator options, Polish JDG in 2026.
 * These are examples, not an automatic classification of an occupation or PKD.
 * Verified legal source and limitations: docs/RYCZALT-GUIDE.md.
 */
export const sourceURL = 'https://api.sejm.gov.pl/eli/acts/DU/1998/930/text/U/D19980930Lj.pdf';
export const verifiedAt = '2026-10-13';
export const guideIntro = 'Stawka zależy od faktycznie wykonywanych czynności, a tam, gdzie wskazuje to ustawa — także od PKWiU. Nie wystarczy nazwa zawodu ani kod PKD. Poniżej przykłady, nie pełny katalog. „ex” przy PKWiU oznacza tylko wskazaną część danego grupowania. Sama stawka nie potwierdza prawa do ryczałtu.';

export const RATE_GUIDE = Object.freeze([
  {
    value: 17,
    label: '17% — wolne zawody z ustawowej definicji',
    description: 'Dotyczy ustawowo wymienionych wolnych zawodów wykonywanych osobiście, bez zatrudniania osób wykonujących czynności związane z istotą zawodu. Nie oznacza każdego freelancera ani każdego specjalisty.',
    examples: 'Np. tłumacz, adwokat, radca prawny, księgowy lub doradca podatkowy spełniający te warunki. Usługi opieki zdrowotnej mają odrębną stawkę 14%.',
    reference: 'Art. 12 ust. 1 pkt 1 oraz art. 4 ust. 1 pkt 11.'
  },
  {
    value: 15,
    label: '15% — reklama, fotografia, wybrane doradztwo',
    description: 'Wybrane usługi wymienione w ustawie, m.in. reklamowe, fotograficzne, pośrednictwa hurtowego i doradztwa związanego z zarządzaniem. To nie ogólna stawka dla wszystkich usług B2B.',
    examples: 'Np. reklama i badanie rynku (PKWiU dział 73), fotografia (74.2). Usługi prawne, księgowe i doradztwo podatkowe (dział 69) — gdy nie są świadczone w ramach wolnego zawodu objętego 17%.',
    reference: 'Art. 12 ust. 1 pkt 2, m.in. lit. c, l, m, o i q.'
  },
  {
    value: 14,
    label: '14% — zdrowie, architektura, inżynieria, projektowanie',
    description: 'Usługi opieki zdrowotnej, architektoniczne i inżynierskie, badania i analizy techniczne oraz specjalistyczne projektowanie w grupowaniach wymienionych w ustawie.',
    examples: 'Np. świadczenia medyczne (PKWiU dział 86), projekty architektoniczne i inżynierskie (dział 71), specjalistyczne projektowanie (74.1). Nazwa „projektant” sama nie przesądza stawki.',
    reference: 'Art. 12 ust. 1 pkt 2a.'
  },
  {
    value: 12,
    label: '12% — oprogramowanie i wskazane usługi IT',
    description: 'Wybrane usługi IT, w szczególności związane z oprogramowaniem, doradztwem dotyczącym sprzętu lub oprogramowania oraz zarządzaniem siecią i systemami. Nie każda praca w IT automatycznie podlega 12%.',
    examples: 'Np. usługi związane z oprogramowaniem (PKWiU ex 62.01.1), doradztwo dotyczące oprogramowania (ex 62.02), zarządzanie siecią i systemami (62.03.1). Liczy się zakres pracy, nie nazwa „programista”, „tester” czy „konsultant”.',
    reference: 'Art. 12 ust. 1 pkt 2b.'
  },
  {
    value: 10,
    label: '10% — kupno i sprzedaż nieruchomości na własny rachunek',
    description: 'Usługi kupna i sprzedaży nieruchomości na własny rachunek sklasyfikowane w PKWiU 68.10.1. Nie jest to ogólna stawka dla każdego przychodu związanego z nieruchomościami.',
    examples: 'Handel nabytymi nieruchomościami w PKWiU 68.10.1. Pośrednictwo nieruchomości (68.3) ma 15%, a wynajem własnych lub dzierżawionych nieruchomości (68.20.1) — 8,5% / 12,5%.',
    reference: 'Art. 12 ust. 1 pkt 3; porównawczo pkt 2 lit. k i pkt 4 lit. d.'
  },
  {
    value: 8.5,
    label: '8,5% — pozostałe usługi, edukacja',
    description: 'Działalność usługowa, dla której ustawa nie przewiduje innej stawki, oraz wskazane w niej szczególne kategorie. Tutaj 8,5% jest stałe — nie rośnie automatycznie po przekroczeniu 100 tys. zł.',
    examples: 'Np. edukacja (PKWiU dział 85), wytwarzanie wyrobów z materiału powierzonego przez klienta. Także gastronomiczna sprzedaż napojów o zawartości alkoholu powyżej 1,5%. Usługi IT trzeba najpierw sprawdzić pod kątem szczególnych stawek.',
    reference: 'Art. 12 ust. 1 pkt 5, m.in. lit. a, c i e.'
  },
  {
    value: 5.5,
    label: '5,5% — produkcja, budownictwo, wybrany transport',
    description: 'Działalność wytwórcza, roboty budowlane oraz przewóz ładunków taborem samochodowym o ładowności powyżej 2 ton. Wytwarzanie z materiału powierzonego przez klienta jest osobną kategorią 8,5%.',
    examples: 'Np. wytwarzanie i sprzedaż nowych wyrobów własnej produkcji, roboty budowlane, drogowy przewóz towarów przy ładowności ponad 2 t. Chodzi o ładowność, nie dopuszczalną masę całkowitą pojazdu.',
    reference: 'Art. 12 ust. 1 pkt 6 lit. a i pkt 5 lit. e oraz art. 4 ust. 1 pkt 4.'
  },
  {
    value: 3,
    label: '3% — handel towarami, gastronomia z wyjątkami',
    description: 'Handel wcześniej nabytymi towarami sprzedawanymi w stanie nieprzetworzonym oraz gastronomia, z wyjątkiem sprzedaży napojów o zawartości alkoholu powyżej 1,5%. Obowiązują ustawowe wyjątki i wyłączenia.',
    examples: 'Np. odsprzedaż kupionych towarów w sklepie, także internetowym, oraz sprzedaż posiłków. Produkcja własnych wyrobów to nie ten sam rodzaj przychodu co odsprzedaż towaru; pośrednictwo hurtowe ma odrębne 15%.',
    reference: 'Art. 12 ust. 1 pkt 7 lit. a–b i pkt 2 lit. c oraz art. 4 ust. 1 pkt 2–3.'
  },
  {
    value: 'progressive',
    label: '8,5% / 12,5% — najem w JDG, zakwaterowanie, wybrane usługi',
    description: 'Tylko wskazane kategorie: m.in. zakwaterowanie, wynajem i obsługa własnych lub dzierżawionych nieruchomości, badania naukowe i prace rozwojowe oraz wybrany wynajem pojazdów. 8,5% do 100 tys. zł przychodu, 12,5% od nadwyżki.',
    examples: 'Np. usługi zakwaterowania (PKWiU dział 55), wynajem nieruchomości (68.20.1), wynajem aut osobowych bez kierowcy (77.11.10.0), badania i rozwój (dział 72). W kalkulatorze dotyczy tylko JDG, nie najmu prywatnego; wszystkie takie pozycje JDG dzielą jeden próg 100 tys. zł.',
    reference: 'Art. 12 ust. 1 pkt 4 oraz ust. 14.'
  }
].map(Object.freeze));
