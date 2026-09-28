// Parler (Spreken) — examen de base à l’étranger, niveau A1.
// Partie 1 à l’examen : 10 questions personnelles. Partie 2 : 12 phrases à compléter.
// Les réponses sont enregistrées et notées par des examinateurs.
// Ici : modèles de réponses, conseils en français, et un entraînement « répéter » pour la prononciation.

// Partie 1 — questions : q (nl), qFr, model (réponses possibles), tip (fr), keys (mots attendus, pour la vérification vocale).
const V = (n, q, qFr, model, tip, keys) => ({ id: `sp-v${String(n).padStart(2, '0')}`, kind: 'vraag', q, qFr, model, tip, keys });

export const SPEAK_QUESTIONS = [
  V(1, 'Hoe heet u?', 'Comment vous appelez-vous ?', ['Ik heet Sara.', 'Mijn naam is Sara.'], 'Reprenez le verbe de la question : « Hoe heet u? » → « Ik heet… ».', ['heet', 'naam']),
  V(2, 'Waar komt u vandaan?', 'D’où venez-vous ?', ['Ik kom uit Marokko.', 'Ik kom uit Frankrijk.'], '« Ik kom uit » + pays.', ['kom', 'uit']),
  V(3, 'Waar woont u?', 'Où habitez-vous ?', ['Ik woon in Casablanca.', 'Ik woon in een klein huis in Tunis.'], '« Ik woon in » + ville.', ['woon']),
  V(4, 'Hoe oud bent u?', 'Quel âge avez-vous ?', ['Ik ben dertig jaar.', 'Ik ben vijfentwintig jaar oud.'], 'En néerlandais, on « est » un âge : « Ik ben … jaar ».', ['ben', 'jaar']),
  V(5, 'Bent u getrouwd?', 'Êtes-vous marié(e) ?', ['Ja, ik ben getrouwd.', 'Nee, ik ben niet getrouwd.'], 'Répondez par une phrase complète : « Ja, ik ben… » ou « Nee, ik ben niet… ».', ['getrouwd']),
  V(6, 'Heeft u kinderen?', 'Avez-vous des enfants ?', ['Ja, ik heb twee kinderen.', 'Nee, ik heb geen kinderen.'], 'Pas d’enfant : « geen kinderen » (pas « niet »).', ['kinderen']),
  V(7, 'Wat is uw beroep?', 'Quel est votre métier ?', ['Ik ben verpleegkundige.', 'Ik werk in een winkel.', 'Ik ben huisvrouw.'], 'Pas d’article devant le métier : « Ik ben kok. »', ['ben', 'werk']),
  V(8, 'Welke talen spreekt u?', 'Quelles langues parlez-vous ?', ['Ik spreek Frans, Arabisch en een beetje Nederlands.'], '« Een beetje » = un peu.', ['spreek']),
  V(9, 'Wat drinkt u graag?', 'Qu’aimez-vous boire ?', ['Ik drink graag thee.', 'Ik drink graag koffie met melk.'], '« graag » = volontiers : « Ik drink graag… ».', ['drink', 'graag']),
  V(10, 'Wat eet u graag?', 'Qu’aimez-vous manger ?', ['Ik eet graag rijst met kip.', 'Ik eet graag vis.'], 'Même structure : « Ik eet graag… ».', ['eet', 'graag']),
  V(11, 'Hoe laat staat u op?', 'À quelle heure vous levez-vous ?', ['Ik sta om zeven uur op.'], 'Verbe séparable : « Ik sta … op ». Le « op » va à la fin.', ['sta', 'op', 'uur']),
  V(12, 'Wat doet u in het weekend?', 'Que faites-vous le week-end ?', ['In het weekend ga ik naar mijn familie.', 'Ik ga in het weekend wandelen.'], 'Si vous commencez par « In het weekend », le verbe vient juste après : « In het weekend ga ik… ».', ['weekend']),
  V(13, 'Hoe gaat u naar uw werk?', 'Comment allez-vous au travail ?', ['Ik ga met de bus naar mijn werk.', 'Ik ga met de fiets.'], '« met de bus / met de fiets / met de auto » ; mais « lopend » (à pied).', ['ga', 'met']),
  V(14, 'Wat is uw hobby?', 'Quel est votre passe-temps ?', ['Mijn hobby is lezen.', 'Mijn hobby is voetballen.'], '« Mijn hobby is » + verbe à l’infinitif.', ['hobby']),
  V(15, 'Waar woont uw partner?', 'Où habite votre partenaire ?', ['Mijn partner woont in Utrecht.', 'Mijn man woont in Nederland.'], 'Avec « mijn partner » (il/elle), le verbe prend un -t : « woont ».', ['woont']),
  V(16, 'Waarom gaat u naar Nederland?', 'Pourquoi allez-vous aux Pays-Bas ?', ['Ik ga naar Nederland, want mijn man woont daar.', 'Ik wil bij mijn partner wonen.'], 'Pour donner une raison : « want » + phrase normale.', ['nederland']),
  V(17, 'Welke dag is het vandaag?', 'Quel jour sommes-nous ?', ['Vandaag is het maandag.', 'Het is dinsdag.'], 'Jours : maandag, dinsdag, woensdag, donderdag, vrijdag, zaterdag, zondag.', ['dag', 'is']),
  V(18, 'Wat voor weer is het vandaag?', 'Quel temps fait-il aujourd’hui ?', ['Het is mooi weer.', 'Het regent.', 'Het is koud.'], 'Le temps se dit avec « het » : « Het regent. Het is warm. »', ['het']),
  V(19, 'Hoeveel kamers heeft uw huis?', 'Combien de pièces a votre maison ?', ['Mijn huis heeft drie kamers.'], 'Reprenez les mots de la question : « Mijn huis heeft … kamers ».', ['kamers']),
  V(20, 'Wat koopt u in de supermarkt?', 'Qu’achetez-vous au supermarché ?', ['Ik koop brood, melk en groente.'], 'Liste simple avec « en » avant le dernier mot.', ['koop']),
  V(21, 'Wanneer bent u jarig?', 'Quand est votre anniversaire ?', ['Ik ben jarig op tien mei.', 'Ik ben in juni jarig.'], '« jarig zijn » = avoir son anniversaire.', ['jarig']),
  V(22, 'Heeft u broers of zussen?', 'Avez-vous des frères ou des sœurs ?', ['Ja, ik heb een broer en twee zussen.', 'Nee, ik heb geen broers of zussen.'], 'broer = frère, zus = sœur ; pluriels : broers, zussen.', ['broer', 'zus', 'zussen', 'broers']),
  V(23, 'Kookt u graag?', 'Aimez-vous cuisiner ?', ['Ja, ik kook graag.', 'Nee, ik kook niet graag.'], 'Négation avec « graag » : « niet graag ».', ['kook']),
  V(24, 'Sport u?', 'Faites-vous du sport ?', ['Ja, ik zwem elke week.', 'Nee, ik sport niet.'], 'Ajoutez un détail simple : « elke week » (chaque semaine).', ['sport', 'zwem', 'voetbal']),
  V(25, 'Wat doet u ’s avonds?', 'Que faites-vous le soir ?', ['’s Avonds kijk ik tv.', 'Ik lees een boek.'], '« ’s avonds » = le soir ; après ce mot, le verbe vient en 2e position.', ['avonds', 'kijk', 'lees']),
  V(26, 'Waar werkt uw partner?', 'Où travaille votre partenaire ?', ['Mijn partner werkt in een fabriek.', 'Mijn vrouw werkt in een ziekenhuis.'], '« in een fabriek / in een winkel / op kantoor ».', ['werkt']),
  V(27, 'Wat is uw lievelingseten?', 'Quel est votre plat préféré ?', ['Mijn lievelingseten is couscous.'], '« lievelings- » = préféré : lievelingskleur, lievelingseten.', ['lievelingseten']),
  V(28, 'Welke kleur heeft uw jas?', 'De quelle couleur est votre manteau ?', ['Mijn jas is zwart.', 'Mijn jas is blauw.'], 'Couleurs : rood, blauw, groen, geel, zwart, wit.', ['jas']),
  V(29, 'Leest u graag?', 'Aimez-vous lire ?', ['Ja, ik lees graag boeken.', 'Nee, ik lees niet zo graag.'], 'Même structure que « Kookt u graag? ».', ['lees']),
  V(30, 'Hoe gaat het met u?', 'Comment allez-vous ?', ['Goed, dank u. En met u?', 'Het gaat goed, dank u wel.'], 'Réponse polie standard, et on retourne la question : « En met u? ».', ['goed']),
];

// Partie 2 — phrases à compléter : context (phrase entendue), start (début à compléter), answers (fins acceptées), full (phrase modèle).
const A = (n, context, start, answers, full, fr) => ({ id: `sp-a${String(n).padStart(2, '0')}`, kind: 'afmaken', context, start, answers, full, fr });

export const SPEAK_COMPLETE = [
  A(1, 'Ik heb honger.', 'Ik ga iets …', ['eten'], 'Ik ga iets eten.', 'J’ai faim. Je vais manger quelque chose.'),
  A(2, 'Ik heb dorst.', 'Ik wil een glas …', ['water', 'melk', 'thee', 'sap'], 'Ik wil een glas water.', 'J’ai soif. Je veux un verre d’eau.'),
  A(3, 'Het is koud buiten.', 'Ik doe mijn jas …', ['aan'], 'Ik doe mijn jas aan.', 'Il fait froid dehors. Je mets mon manteau.'),
  A(4, 'Het regent.', 'Ik neem een …', ['paraplu', 'paraplu mee'], 'Ik neem een paraplu mee.', 'Il pleut. Je prends un parapluie.'),
  A(5, 'De winkel is nu dicht.', 'Ik kom morgen …', ['terug'], 'Ik kom morgen terug.', 'Le magasin est fermé. Je reviens demain.'),
  A(6, 'Mijn kind is ziek.', 'Ik bel de …', ['huisarts', 'dokter', 'arts'], 'Ik bel de huisarts.', 'Mon enfant est malade. J’appelle le médecin.'),
  A(7, 'Ik ben heel moe.', 'Ik ga naar …', ['bed', 'huis'], 'Ik ga naar bed.', 'Je suis très fatigué. Je vais me coucher.'),
  A(8, 'Het is zeven uur ’s ochtends.', 'Ik sta …', ['op'], 'Ik sta op.', 'Il est sept heures du matin. Je me lève.'),
  A(9, 'Het is warm in de kamer.', 'Ik doe het raam …', ['open'], 'Ik doe het raam open.', 'Il fait chaud dans la pièce. J’ouvre la fenêtre.'),
  A(10, 'Ik woon in Amsterdam.', 'Amsterdam is een grote …', ['stad'], 'Amsterdam is een grote stad.', 'J’habite à Amsterdam. Amsterdam est une grande ville.'),
  A(11, 'Mijn zus heeft een baby.', 'Het is een jongen of een …', ['meisje'], 'Het is een jongen of een meisje.', 'Ma sœur a un bébé. C’est un garçon ou une fille.'),
  A(12, 'Het is zondag.', 'Ik hoef vandaag niet te …', ['werken'], 'Ik hoef vandaag niet te werken.', 'C’est dimanche. Je n’ai pas besoin de travailler aujourd’hui.'),
  A(13, 'Ik heb geen brood meer.', 'Ik ga naar de …', ['bakker', 'supermarkt', 'winkel'], 'Ik ga naar de bakker.', 'Je n’ai plus de pain. Je vais à la boulangerie.'),
  A(14, 'Het is donker.', 'Ik doe het licht …', ['aan'], 'Ik doe het licht aan.', 'Il fait noir. J’allume la lumière.'),
  A(15, 'Vandaag is het maandag.', 'Morgen is het …', ['dinsdag'], 'Morgen is het dinsdag.', 'Aujourd’hui, c’est lundi. Demain, c’est mardi.'),
  A(16, 'Ik ben vandaag jarig.', 'Ik krijg veel …', ['cadeaus', 'cadeautjes', 'kaarten'], 'Ik krijg veel cadeaus.', 'C’est mon anniversaire aujourd’hui. Je reçois beaucoup de cadeaux.'),
  A(17, 'Ik heb tien euro en jij hebt tien euro.', 'Samen hebben we … euro.', ['twintig'], 'Samen hebben we twintig euro.', 'J’ai dix euros et tu as dix euros. Ensemble, nous avons vingt euros.'),
  A(18, 'Mijn man drinkt koffie.', 'Ik drink liever …', ['thee', 'water', 'melk'], 'Ik drink liever thee.', 'Mon mari boit du café. Moi, je préfère le thé.'),
  A(19, 'De deur is open en het is koud.', 'Wil je de deur …?', ['dichtdoen', 'dicht doen', 'sluiten', 'dicht'], 'Wil je de deur dichtdoen?', 'La porte est ouverte et il fait froid. Tu veux bien fermer la porte ?'),
  A(20, 'Ik heb om negen uur een afspraak.', 'Ik wil op … komen.', ['tijd'], 'Ik wil op tijd komen.', 'J’ai un rendez-vous à neuf heures. Je veux arriver à l’heure.'),
  A(21, 'Het is winter.', 'Het is buiten erg …', ['koud'], 'Het is buiten erg koud.', 'C’est l’hiver. Il fait très froid dehors.'),
  A(22, 'Mijn auto is kapot.', 'Ik ga met de … naar mijn werk.', ['fiets', 'bus', 'trein', 'tram'], 'Ik ga met de fiets naar mijn werk.', 'Ma voiture est en panne. Je vais au travail à vélo.'),
  A(23, 'We gaan zo eten.', 'Ik dek de …', ['tafel'], 'Ik dek de tafel.', 'Nous allons bientôt manger. Je mets la table.'),
  A(24, 'De baby huilt.', 'Misschien heeft hij …', ['honger', 'dorst', 'pijn'], 'Misschien heeft hij honger.', 'Le bébé pleure. Il a peut-être faim.'),
  A(25, 'Er is geen lift.', 'Ik neem de …', ['trap'], 'Ik neem de trap.', 'Il n’y a pas d’ascenseur. Je prends l’escalier.'),
  A(26, 'Het is mooi weer.', 'We gaan naar het …', ['park', 'strand', 'bos'], 'We gaan naar het park.', 'Il fait beau. Nous allons au parc.'),
  A(27, 'Ik spreek een beetje Nederlands.', 'Ik wil het graag beter …', ['leren', 'spreken'], 'Ik wil het graag beter leren.', 'Je parle un peu néerlandais. Je voudrais mieux l’apprendre.'),
  A(28, 'Mijn telefoon is kapot.', 'Ik koop een nieuwe …', ['telefoon'], 'Ik koop een nieuwe telefoon.', 'Mon téléphone est cassé. J’achète un nouveau téléphone.'),
  A(29, 'Het is acht uur ’s avonds.', 'De kinderen gaan naar …', ['bed'], 'De kinderen gaan naar bed.', 'Il est huit heures du soir. Les enfants vont se coucher.'),
  A(30, 'Ik heb hoofdpijn.', 'Ik neem een …', ['paracetamol', 'tablet', 'pil', 'pilletje'], 'Ik neem een paracetamol.', 'J’ai mal à la tête. Je prends un paracétamol.'),
];

// Entraînement « répéter » : prononciation et intonation.
const N = (n, nl, fr, tip) => ({ id: `sp-n${String(n).padStart(2, '0')}`, kind: 'nazeggen', nl, fr, tip });

export const SPEAK_REPEAT = [
  N(1, 'Goedemorgen, hoe gaat het?', 'Bonjour, comment ça va ?', '« g » se prononce au fond de la gorge, comme un « r » espagnol doux.'),
  N(2, 'Ik woon in Nederland.', 'J’habite aux Pays-Bas.', '« oo » est long : « woon » comme « ô » allongé.'),
  N(3, 'Mijn naam is Sara.', 'Mon nom est Sara.', '« ij » se prononce presque comme « èï ».'),
  N(4, 'Ik heb twee kinderen.', 'J’ai deux enfants.', '« ee » long : « twee » comme « té » allongé.'),
  N(5, 'Mijn man werkt in een fabriek.', 'Mon mari travaille dans une usine.', '« ie » se prononce « i » : « fabriek ».'),
  N(6, 'Ik drink graag thee.', 'J’aime boire du thé.', '« aa » long dans « graag ».'),
  N(7, 'Het is vandaag mooi weer.', 'Il fait beau aujourd’hui.', '« w » est entre le « v » et le « ou » français.'),
  N(8, 'Ik ga met de fiets naar mijn werk.', 'Je vais au travail à vélo.', 'Liez les mots sans pause : « met de fiets ».'),
  N(9, 'Waar is het station?', 'Où est la gare ?', 'Question : la voix monte un peu à la fin.'),
  N(10, 'Ik begrijp het niet.', 'Je ne comprends pas.', '« ij » dans « begrijp » se dit presque « èï » ; « niet » se dit « nit ».'),
  N(11, 'Wilt u dat herhalen?', 'Pouvez-vous répéter ?', '« u » néerlandais ≈ « u » français.'),
  N(12, 'Ik heb een afspraak bij de huisarts.', 'J’ai un rendez-vous chez le médecin.', '« ui » dans « huisarts » : ouvrez la bouche, lèvres arrondies.'),
  N(13, 'Mijn zoon is zes jaar.', 'Mon fils a six ans.', '« z » est sonore, comme en français.'),
  N(14, 'Het brood is lekker.', 'Le pain est bon.', '« oo » long dans « brood » ; « r » roulé ou de gorge : les deux sont acceptés.'),
  N(15, 'Ik kom uit Marokko.', 'Je viens du Maroc.', '« ui » dans « uit ».'),
  N(16, 'We eten om zes uur.', 'Nous mangeons à six heures.', '« uu » long dans « uur ».'),
  N(17, 'Dank u wel, tot ziens!', 'Merci, au revoir !', '« ie » = « i » dans « ziens ».'),
  N(18, 'Ik leer elke dag Nederlands.', 'J’apprends le néerlandais chaque jour.', '« ch » et « g » : même son de gorge.'),
  N(19, 'Mijn partner woont in Rotterdam.', 'Mon partenaire habite à Rotterdam.', 'L’accent tonique est sur « Rot » : ROT-ter-dam.'),
  N(20, 'Ik ben blij dat ik hier ben.', 'Je suis content d’être ici.', '« ij » dans « blij » comme dans « mijn ».'),
];

export const SPEAK_ALL = [...SPEAK_QUESTIONS, ...SPEAK_COMPLETE, ...SPEAK_REPEAT];
