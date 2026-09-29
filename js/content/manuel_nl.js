// Handboek in eenvoudig Nederlands (niveau A1). Per pagina : titel, korte zinnen, vraag en antwoorden.
// La version française détaillée (manuel.js) reste disponible sous « Uitleg in het Frans ».
// Les réponses sont dans le même ordre qu’en français (la bonne réponse est la première).

const P = (t, nl, q, opts) => ({ t, nl, q, opts });

export const MANUEL_NL = {
  // ── Aardrijkskunde en wonen ──
  'm6p3': P('Nederland in het kort', [
    'In Nederland wonen ongeveer 18 miljoen mensen.', 'Nederland heeft 12 provincies.', 'De hoofdstad is Amsterdam.',
    'De regering en het parlement zitten in Den Haag.', 'De buurlanden zijn België en Duitsland.', 'In het westen liggen vier grote steden: Amsterdam, Rotterdam, Den Haag en Utrecht. Dat is de Randstad.'],
    'Waar zitten de regering en het parlement?', ['In Den Haag', 'In Amsterdam', 'In Rotterdam']),
  'm-royaume': P('Het Koninkrijk der Nederlanden', [
    'Het Koninkrijk der Nederlanden heeft vier landen.', 'Die landen zijn Nederland, Aruba, Curaçao en Sint Maarten.', 'Aruba, Curaçao en Sint Maarten zijn eilanden in de Caribische Zee.',
    'Bonaire, Sint Eustatius en Saba zijn bijzondere gemeenten van Nederland.', 'De koning is het staatshoofd van het hele koninkrijk.'],
    'Hoeveel landen horen bij het Koninkrijk der Nederlanden?', ['Vier', 'Eén', 'Twaalf']),
  'm6p1': P('Water, dijken en polders', [
    'Een groot deel van Nederland ligt onder de zeespiegel.', 'Dijken beschermen het land tegen het water.', 'Een polder is land dat vroeger water was.',
    'Vroeger pompten molens het water weg.', 'Na de overstroming van 1953 bouwde Nederland de Deltawerken.', 'Het water uit de kraan is schoon. Je kunt het drinken.'],
    'Wat is een polder?', ['Land dat vroeger water was', 'Een berg', 'Een bos']),
  'm-woning': P('Een huis zoeken', [
    'Je kunt een huis huren of kopen.', 'Een sociale huurwoning is goedkoper.', 'Voor een sociale huurwoning schrijf je je in. Dan wacht je op je beurt.',
    'In grote steden wacht je soms jaren.', 'Moet je betalen voordat je het huis ziet? Pas op, dat is vaak oplichting.', 'Met een laag inkomen krijg je misschien huurtoeslag.'],
    'Hoe krijg je een sociale huurwoning?', ['Je schrijft je in en je wacht', 'De gemeente geeft je meteen een huis', 'Je wint het in een loterij']),
  'm3p1': P('Huurder en verhuurder', [
    'Je huurt een huis van een verhuurder.', 'Wil je een muur weghalen of een nieuwe keuken? Vraag eerst toestemming, op papier.', 'Kleine dingen mogen meestal wel, zoals verven of een plank ophangen.',
    'De verhuurder betaalt groot onderhoud, zoals een nieuw dak.', 'Kun je de huur niet betalen? Bel dan snel de verhuurder.'],
    'Je wilt een nieuwe keuken in je huurhuis. Wat doe je?', ['Ik vraag de verhuurder om toestemming op papier', 'Ik vraag het aan de buurman', 'Ik doe het en zeg niets']),
  'm3p2': P('Afval en veiligheid', [
    'In Nederland scheiden we afval.', 'Groente en fruit gaan in de gft-bak.', 'Glas gaat in de glasbak. Papier gaat in de papierbak.',
    'Oude meubels zijn grofvuil. Die breng je naar de milieustraat.', 'Elke woning moet een rookmelder hebben, op elke verdieping.'],
    'Waar gaat een oude bank naartoe?', ['Naar de milieustraat, of het wordt opgehaald als grofvuil', 'In de papierbak', 'Op de stoep']),

  // ── Geschiedenis ──
  'm-gouden': P('Willem van Oranje en de Gouden Eeuw', [
    'Lang geleden was Nederland van de koning van Spanje.', 'Willem van Oranje leidde de opstand tegen Spanje.', 'Hij heet de ‘Vader des Vaderlands’.',
    'Het volkslied, het Wilhelmus, gaat over hem.', 'In de 17e eeuw werd Nederland rijk door handel. Dat heet de Gouden Eeuw.', 'In die tijd schilderde Rembrandt.'],
    'Hoe heet de 17e eeuw in Nederland?', ['De Gouden Eeuw', 'De IJzertijd', 'De Renaissance']),
  'm-slavernij': P('Koloniën en slavernij', [
    'Nederland had vroeger koloniën, bijvoorbeeld Indonesië en Suriname.', 'Nederlandse handelaren verkochten mensen als slaaf.', 'Op 1 juli 1863 schafte Nederland de slavernij af.',
    'Elk jaar op 1 juli herdenken mensen dat: Keti Koti.', 'In 2023 zei de koning sorry voor de slavernij.'],
    'In welk jaar schafte Nederland de slavernij af?', ['In 1863', 'In 1945', 'In 1975']),
  'm6p2': P('De Tweede Wereldoorlog', [
    'Van 1940 tot 1945 was Nederland bezet door Duitsland.', 'Meer dan 100.000 Joodse Nederlanders zijn vermoord.', 'Anne Frank schreef een dagboek in haar schuilplaats in Amsterdam.',
    'Op 4 mei om 20.00 uur zijn we twee minuten stil. We denken aan de doden.', 'Op 5 mei vieren we de bevrijding.'],
    'Wat doen we op 4 mei om 20.00 uur?', ['We zijn twee minuten stil', 'We kijken naar vuurwerk', 'We vieren Koningsdag']),
  'm-na1945': P('Na 1945', [
    'In 1953 was er een grote overstroming in Zeeland.', 'Daarna bouwde Nederland de Deltawerken.', 'Suriname werd in 1975 onafhankelijk.',
    'Rond 1965 was er veel werk in fabrieken. Er kwamen arbeiders uit onder andere Turkije en Marokko.', 'Sinds 2002 betalen we met de euro.'],
    'Waarom kwamen er rond 1965 veel arbeiders naar Nederland?', ['Er was te weinig personeel in de fabrieken', 'Voor vakantie', 'Om te studeren']),
  'm-feesten': P('Feesten en herdenkingen', [
    'Op 27 april is het Koningsdag. Dan is de koning jarig.', 'Veel mensen dragen dan oranje kleren.', 'Op 4 mei herdenken we de doden. Op 5 mei vieren we de bevrijding.',
    'Op 5 december krijgen kinderen cadeautjes van Sinterklaas.', 'Kerst, Pasen en Nieuwjaar zijn ook vrije dagen.'],
    'Wanneer is Koningsdag?', ['Op 27 april', 'Op 5 mei', 'Op 5 december']),

  // ── Staatsinrichting en rechtsstaat ──
  'm5p1': P('De koning en de regering', [
    'Koning Willem-Alexander is het staatshoofd.', 'De koning maakt geen wetten. De ministers besturen het land.', 'De minister-president leidt de regering.',
    'Meestal werken een paar partijen samen in de regering.'],
    'Wat doet de koning?', ['Hij is staatshoofd, maar hij bestuurt het land niet', 'Hij maakt alleen alle wetten', 'Hij is de baas van de politie']),
  'm5p2': P('Het parlement en de verkiezingen', [
    'Het parlement zit in Den Haag.', 'De Tweede Kamer heeft 150 leden. We kiezen ze elke vier jaar.', 'De Tweede Kamer maakt wetten. De Eerste Kamer controleert de wetten.',
    'We stemmen ook voor de gemeenteraad en de provincie.', 'De burgemeester kiezen we niet. De regering benoemt hem.'],
    'Hoeveel leden heeft de Tweede Kamer?', ['150', '100', '200']),
  'm5p3': P('De Grondwet en gelijkheid', [
    'De belangrijkste wet is de Grondwet.', 'Artikel 1 zegt: iedereen is gelijk. Discriminatie is verboden.', 'Je mag zeggen wat je denkt. Je mag je eigen geloof hebben.',
    'Mannen en vrouwen hebben dezelfde rechten.', 'Sinds 2001 mogen twee mannen of twee vrouwen trouwen.'],
    'Wat staat er in artikel 1 van de Grondwet?', ['Iedereen is gelijk; discriminatie is verboden', 'Iedereen moet stemmen', 'Er is één godsdienst']),
  'm-recht': P('Het recht en jouw rechten', [
    'Een rechter beslist in een rechtszaak. De regering mag de rechter niets opdragen.', 'Geweld is altijd verboden, ook thuis.', 'Word je gediscrimineerd? Meld het, of doe aangifte bij de politie.',
    'Gratis juridisch advies krijg je bij het Juridisch Loket.', 'Vanaf 14 jaar moet je een identiteitsbewijs kunnen laten zien.'],
    'Vanaf welke leeftijd moet je een identiteitsbewijs kunnen laten zien?', ['14 jaar', '18 jaar', '21 jaar']),
  'm-ind': P('Verblijfsvergunning en naturalisatie', [
    'De IND beslist over visa en verblijfsvergunningen.', 'Na aankomst krijg je een verblijfsvergunning.', 'Kijk goed wanneer je vergunning verloopt. Vraag op tijd een nieuwe aan.',
    'Na een aantal jaren kun je Nederlander worden. Dat heet naturalisatie.'],
    'Wie beslist over je verblijfsvergunning?', ['De IND', 'DUO', 'De gemeente']),
  'm7p1': P('De gemeente, BSN en DigiD', [
    'Na aankomst schrijf je je in bij de gemeente.', 'Dan krijg je een BSN. Dat is je persoonlijke nummer.', 'Met DigiD regel je dingen op internet, bijvoorbeeld met de belasting.',
    'Geef je DigiD nooit aan iemand anders.', 'Ga je verhuizen? Geef je nieuwe adres door aan de gemeente.'],
    'Waarvoor gebruik je DigiD?', ['Om zaken met de overheid te regelen op internet', 'Om treinkaartjes te kopen', 'Om boodschappen te doen']),
  'm7p2': P('Politie: 112 of 0900-8844?', [
    'Bel 112 bij gevaar: brand, een ongeluk of een misdrijf dat nu gebeurt.', 'Is het niet dringend? Bel dan 0900-8844.', 'Is je fiets gisteren gestolen? Dan bel je 0900-8844.',
    'De politie helpt je. Je hoeft niet bang te zijn.'],
    'Je fiets is gisteren gestolen. Welk nummer bel je?', ['0900-8844', '112', '911']),

  // ── Nederlandse taal ──
  'm-taal1': P('Waar spreken ze Nederlands?', [
    'De officiële taal is Nederlands.', 'In Vlaanderen, in België, spreken ze ook Nederlands. In Suriname ook.', 'In Friesland is Fries ook een officiële taal.',
    'Veel Nederlanders spreken Engels. Maar op het werk en op school spreek je Nederlands.'],
    'In welke provincie is Fries ook een officiële taal?', ['Friesland', 'Limburg', 'Zeeland']),
  'm-taal2': P('Na het examen: verder leren', [
    'Het examen in het buitenland is de eerste stap.', 'In Nederland praat de gemeente met je over je inburgering.', 'Meestal moet je daarna nog een examen halen, vaak op niveau B1.',
    'Je hebt daarvoor drie jaar.', 'Kom je voor je partner? Dan betaal je de cursus zelf. Je kunt geld lenen bij DUO.'],
    'Wie betaalt meestal de cursus van een partner die naar Nederland komt?', ['Hij of zij zelf (lenen bij DUO kan)', 'De gemeente', 'De werkgever']),
  'm-taal3': P('Elke dag oefenen', [
    'Je leert sneller als je elke dag praat.', 'In de bibliotheek kun je vaak oefenen in een taalcafé.', 'Vrijwilligerswerk helpt ook: je ontmoet nieuwe mensen.',
    'Begrijp je iets niet? Zeg: ‘Wilt u dat herhalen?’', 'Tegen mensen die je niet kent, zeg je ‘u’.'],
    'Waar kun je vaak Nederlands oefenen met vrijwilligers?', ['In de bibliotheek (taalcafé)', 'Bij de politie', 'Bij de bank']),

  // ── Opvoeding en onderwijs ──
  'm-klein': P('Kleine kinderen', [
    'Met je baby ga je naar het consultatiebureau.', 'Daar kijken ze of je kind goed groeit. Je kind krijgt er ook vaccinaties.', 'Dat is gratis.',
    'Werken beide ouders? Dan kan je kind naar de kinderopvang.', 'Voor elk kind krijg je kinderbijslag van de SVB.'],
    'Wat gebeurt er op het consultatiebureau?', ['Ze kijken naar de gezondheid van je baby en geven vaccinaties', 'Je schrijft je kind in voor school', 'Je betaalt belasting']),
  'm4p1': P('De leerplicht', [
    'De meeste kinderen gaan met 4 jaar naar school.', 'Vanaf 5 jaar moet een kind naar school. Dat heet leerplicht.', 'Jongeren moeten tot hun 18e naar school, of tot ze een diploma hebben.',
    'Op vakantie buiten de schoolvakanties? Dat mag alleen met toestemming van de directeur.'],
    'Vanaf welke leeftijd moet een kind naar school?', ['5 jaar', '4 jaar', '6 jaar']),
  'm4p2': P('Ouders en school', [
    'Ouders praten regelmatig met de leraar. Dat heet een tienminutengesprek.', 'Dan hoor je hoe het gaat met je kind.', 'De school vraagt soms een ouderbijdrage. Die is vrijwillig.',
    'Wordt je kind gepest? Praat dan met de leraar.'],
    'Waarvoor is het tienminutengesprek?', ['Om met de leraar over je kind te praten', 'Om een taalexamen te doen', 'Om de lunch te betalen']),
  'm4p3': P('De school in Nederland', [
    'De basisschool duurt acht jaar, van groep 1 tot groep 8.', 'In groep 8 maken kinderen een toets.', 'Daarna gaan ze naar het vmbo, de havo of het vwo.',
    'Na het vmbo kun je een beroep leren op het mbo.'],
    'Hoeveel jaar duurt de basisschool?', ['8 jaar', '5 jaar', '12 jaar']),
  'm-opvoeding': P('Kinderen opvoeden', [
    'Je mag een kind nooit slaan, ook niet als straf.', 'Vader en moeder beslissen samen over de opvoeding.', 'Tot 18 jaar is een kind minderjarig.',
    'Heb je vragen over opvoeding? Je kunt gratis hulp vragen.'],
    'Mag je je kind slaan als straf?', ['Nee, dat is verboden', 'Ja, thuis mag dat', 'Alleen een beetje']),

  // ── Gezondheidszorg ──
  'm1p1': P('De huisarts', [
    'Ben je ziek? Bel dan eerst de huisarts.', 'De assistente vraagt wat er is. Zij maakt een afspraak.', 'Moet je naar een specialist in het ziekenhuis? Dan krijg je een verwijsbrief van de huisarts.',
    'Ook als je je somber voelt, kun je naar de huisarts.'],
    'Wat heb je nodig voor een specialist in het ziekenhuis?', ['Een verwijsbrief van de huisarts', 'Een bankpas', 'Een brief van de gemeente']),
  'm1p2': P('Spoed: 112 of de huisartsenpost?', [
    'Bel 112 bij levensgevaar.', 'Is het avond, nacht of weekend, en kan het niet wachten? Bel de huisartsenpost.', 'Ga niet zomaar naar het ziekenhuis. Bel altijd eerst.',
    'Kiespijn in het weekend? Je tandarts vertelt welke tandarts dienst heeft.'],
    'Het is zondag en je kind heeft hoge koorts. Wat doe je?', ['Ik bel de huisartsenpost', 'Ik bel 112', 'Ik ga meteen naar het ziekenhuis']),
  'm1p3': P('De zorgverzekering', [
    'Iedereen in Nederland moet een zorgverzekering hebben.', 'Vanaf 18 jaar betaal je elke maand premie.', 'Kinderen zijn gratis verzekerd bij hun ouders.',
    'Het eigen risico betaal je eerst zelf. Voor de huisarts betaal je niets.', 'Met een laag inkomen krijg je misschien zorgtoeslag.'],
    'Wat kost de zorgverzekering voor een kind van 10?', ['Niets: het kind is gratis verzekerd', 'Hetzelfde als voor een volwassene', 'De helft']),
  'm-zwanger': P('Zwanger', [
    'Ben je zwanger? Dan ga je naar de verloskundige.', 'Je kunt thuis bevallen of in het ziekenhuis.', 'Na de geboorte komt er kraamzorg bij je thuis.',
    'Een baby moet je binnen 3 dagen aangeven bij de gemeente.'],
    'Wie helpt meestal bij een gewone zwangerschap?', ['De verloskundige', 'De tandarts', 'De apotheker']),

  // ── Werk en inkomen ──
  'm-werkzoeken': P('Werk zoeken', [
    'Werk zoeken kan op internet, bijvoorbeeld op werk.nl.', 'Een uitzendbureau helpt je aan werk, vaak voor een korte tijd.', 'Maak een kort cv.',
    'Voor veel banen moet je Nederlands spreken.'],
    'Wat is een uitzendbureau?', ['Een bedrijf dat je helpt aan (tijdelijk) werk', 'Een reisbureau', 'Een postkantoor']),
  'm2p1': P('Het contract', [
    'Voor je werk krijg je een contract. Lees het goed.', 'In het begin is er soms een proeftijd.', 'In de proeftijd mag je werkgever het contract meteen stoppen. Jij mag dat ook.',
    'Er is een minimumloon.', 'Mannen en vrouwen krijgen hetzelfde loon voor hetzelfde werk.'],
    'Wat kan er gebeuren in de proeftijd?', ['Het contract kan meteen stoppen', 'Je krijgt geen loon', 'Je mag niet ziek zijn']),
  'm2p2': P('Ziek, vakantie en zwartwerk', [
    'Ben je ziek? Bel je werkgever voordat je werk begint.', 'Met een contract heb je betaalde vakantie.', 'Je krijgt ook vakantiegeld.',
    'Zwartwerken is werken zonder dat de belasting het weet. Dat is verboden.', 'Een vakbond helpt werknemers.'],
    'Wat is zwartwerken?', ['Werken zonder dat de belasting het weet', 'Werken in de nacht', 'Overuren maken']),
  'm2p3': P('Loon en belasting', [
    'Op je loonstrook staan je uren en je loon.', 'Bruto is het loon voor de belasting. Netto krijg je op je rekening.', 'De Belastingdienst int de belasting.',
    'De Belastingdienst betaalt ook toeslagen, zoals huurtoeslag.', 'Je doet elk jaar aangifte, meestal voor 1 mei.'],
    'Wie int de belasting en betaalt toeslagen?', ['De Belastingdienst', 'De politie', 'De gemeente']),
  'm-geld': P('Geld en pensioen', [
    'In Nederland betaal je bijna overal met je bankpas.', 'Open dus snel een bankrekening.', 'Heb je schulden? De gemeente helpt je gratis.',
    'Vanaf ongeveer 67 jaar krijg je AOW. Dat is het pensioen van de overheid.'],
    'Wat is de AOW?', ['Het pensioen van de overheid', 'Geld voor studenten', 'Belasting op auto’s']),

  // ── Omgangsvormen en dagelijks leven ──
  'm8p1': P('Op tijd komen', [
    'Nederlanders komen op tijd.', 'Kom je te laat? Bel of stuur een bericht.', 'Mensen maken vaak een afspraak, ook voor een bezoek.',
    'Veel mensen eten om zes uur.'],
    'Wat vinden Nederlanders van te laat komen zonder bericht?', ['Onbeleefd', 'Normaal', 'Grappig']),
  'm8p2': P('Verjaardagen en begroeten', [
    'Op een verjaardag zitten mensen vaak in een kring.', 'Je feliciteert de jarige en ook de familie: ‘Gefeliciteerd met je vrouw!’', 'Ontmoet je iemand voor het eerst? Geef een hand en zeg je naam.',
    'Nederlanders zijn vaak direct. Dat is niet onbeleefd.'],
    'Wie feliciteer je op een verjaardag?', ['De jarige en de familie en vrienden', 'Alleen de jarige', 'Niemand']),
  'm3p3': P('De buren', [
    'In een nieuw huis stel je je voor aan de buren.', 'Na 22.00 uur ben je rustig.', 'Heb je last van de buren? Praat eerst rustig met ze.',
    'Helpt dat niet? Vraag hulp aan de verhuurder of aan buurtbemiddeling.'],
    'De buurman maakt ’s avonds laat lawaai. Wat doe je eerst?', ['Ik praat rustig met hem', 'Ik bel 112', 'Ik maak ook lawaai']),
  'm-verkeer': P('Fiets en verkeer', [
    'Op een kruispunt zonder borden heeft verkeer van rechts voorrang.', 'Als het donker is, heeft je fiets een wit licht voor en een rood licht achter.', 'Ga je afslaan? Steek je arm uit.',
    'In de bus en de trein check je in en uit.', 'Zet je fiets altijd op slot.'],
    'Wie heeft voorrang op een kruispunt zonder borden?', ['Verkeer van rechts', 'Verkeer van links', 'Wie het snelst rijdt']),
};
