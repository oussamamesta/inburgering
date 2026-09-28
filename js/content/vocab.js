import { VOCAB_PLUS_ROWS } from './vocab_plus.js';
// Vocabulaire A1. Seuls les noms ont un article (de / het) et un pluriel.
// Format : [néerlandais, article|null, nature, français, exemple NL, exemple FR, thème, pluriel|null]
// nature : 'n' nom, 'v' verbe, 'adj' adjectif, 'adv' adverbe, 'x' expression

const RAW = [
  // Courses
  ['appel', 'de', 'n', 'la pomme', 'Ik eet een appel.', 'Je mange une pomme.', 'Courses', 'appels'],
  ['bakker', 'de', 'n', 'le boulanger', 'Ik ga naar de bakker.', 'Je vais chez le boulanger.', 'Courses', 'bakkers'],
  ['brood', 'het', 'n', 'le pain', 'Een bruin brood, alstublieft.', 'Un pain complet, s’il vous plaît.', 'Courses', 'broden'],
  ['kassa', 'de', 'n', 'la caisse', 'U kunt bij de kassa betalen.', 'Vous pouvez payer à la caisse.', 'Courses', 'kassa’s'],
  ['geld', 'het', 'n', 'l’argent', 'Ik heb geen geld bij me.', 'Je n’ai pas d’argent sur moi.', 'Courses', null],
  ['melk', 'de', 'n', 'le lait', 'De melk is op.', 'Il n’y a plus de lait.', 'Courses', null],
  ['tas', 'de', 'n', 'le sac', 'Heeft u een tas?', 'Avez-vous un sac ?', 'Courses', 'tassen'],
  ['markt', 'de', 'n', 'le marché', 'Op zaterdag is er markt.', 'Le samedi, il y a le marché.', 'Courses', 'markten'],
  ['duur', null, 'adj', 'cher', 'Deze jas is te duur.', 'Cette veste est trop chère.', 'Courses', null],
  ['goedkoop', null, 'adj', 'bon marché', 'Dat is erg goedkoop.', 'C’est très bon marché.', 'Courses', null],
  // Transports
  ['fiets', 'de', 'n', 'le vélo', 'Ik ga met de fiets.', 'J’y vais à vélo.', 'Transports', 'fietsen'],
  ['trein', 'de', 'n', 'le train', 'De trein heeft vertraging.', 'Le train a du retard.', 'Transports', 'treinen'],
  ['bus', 'de', 'n', 'le bus', 'Waar is de bushalte?', 'Où est l’arrêt de bus ?', 'Transports', 'bussen'],
  ['station', 'het', 'n', 'la gare', 'Ik wacht op het station.', 'J’attends à la gare.', 'Transports', 'stations'],
  ['auto', 'de', 'n', 'la voiture', 'Mijn auto is kapot.', 'Ma voiture est en panne.', 'Transports', 'auto’s'],
  ['rijden', null, 'v', 'conduire, rouler', 'Ik kan geen auto rijden.', 'Je ne sais pas conduire.', 'Transports', null],
  ['straat', 'de', 'n', 'la rue', 'Ik woon in deze straat.', 'J’habite dans cette rue.', 'Transports', 'straten'],
  ['stoplicht', 'het', 'n', 'le feu (de circulation)', 'Het stoplicht is rood.', 'Le feu est rouge.', 'Transports', 'stoplichten'],
  ['rechts', null, 'adv', 'à droite', 'Ga hier naar rechts.', 'Allez à droite ici.', 'Transports', null],
  ['links', null, 'adv', 'à gauche', 'Ga bij de kerk naar links.', 'À l’église, allez à gauche.', 'Transports', null],
  // Santé
  ['arts', 'de', 'n', 'le médecin', 'Ik moet naar de arts.', 'Je dois aller chez le médecin.', 'Santé', 'artsen'],
  ['ziek', null, 'adj', 'malade', 'Ik ben ziek.', 'Je suis malade.', 'Santé', null],
  ['pijn', 'de', 'n', 'la douleur', 'Ik heb pijn in mijn buik.', 'J’ai mal au ventre.', 'Santé', null],
  ['ziekenhuis', 'het', 'n', 'l’hôpital', 'Zij ligt in het ziekenhuis.', 'Elle est à l’hôpital.', 'Santé', 'ziekenhuizen'],
  ['apotheek', 'de', 'n', 'la pharmacie', 'De apotheek is open.', 'La pharmacie est ouverte.', 'Santé', 'apotheken'],
  ['medicijn', 'het', 'n', 'le médicament', 'U moet dit medicijn nemen.', 'Vous devez prendre ce médicament.', 'Santé', 'medicijnen'],
  ['tandarts', 'de', 'n', 'le dentiste', 'Ik heb kiespijn. Ik ga naar de tandarts.', 'J’ai mal aux dents. Je vais chez le dentiste.', 'Santé', 'tandartsen'],
  ['beter', null, 'adj', 'mieux', 'Het gaat al beter met mij.', 'Je vais déjà mieux.', 'Santé', null],
  ['moe', null, 'adj', 'fatigué', 'Ik ben erg moe.', 'Je suis très fatigué.', 'Santé', null],
  ['slapen', null, 'v', 'dormir', 'Ik ga vroeg slapen.', 'Je vais me coucher tôt.', 'Santé', null],
  // Travail
  ['werken', null, 'v', 'travailler', 'Ik werk op maandag.', 'Je travaille le lundi.', 'Travail', null],
  ['kantoor', 'het', 'n', 'le bureau', 'Ik ben nu op kantoor.', 'Je suis au bureau maintenant.', 'Travail', 'kantoren'],
  ['collega', 'de', 'n', 'le/la collègue', 'Mijn collega is aardig.', 'Mon collègue est gentil.', 'Travail', 'collega’s'],
  ['baas', 'de', 'n', 'le chef', 'Ik vraag het aan mijn baas.', 'Je le demande à mon chef.', 'Travail', 'bazen'],
  ['salaris', 'het', 'n', 'le salaire', 'Ik krijg morgen mijn salaris.', 'Je reçois mon salaire demain.', 'Travail', 'salarissen'],
  ['vrij', null, 'adj', 'libre, en congé', 'Vandaag ben ik vrij.', 'Aujourd’hui, je suis en congé.', 'Travail', null],
  ['druk', null, 'adj', 'occupé, chargé', 'Ik heb het erg druk.', 'Je suis très occupé.', 'Travail', null],
  ['pauze', 'de', 'n', 'la pause', 'We hebben nu pauze.', 'Nous avons une pause maintenant.', 'Travail', 'pauzes'],
  ['solliciteren', null, 'v', 'postuler', 'Ik ga op die baan solliciteren.', 'Je vais postuler pour ce poste.', 'Travail', null],
  ['contract', 'het', 'n', 'le contrat', 'Ik heb een vast contract.', 'J’ai un CDI.', 'Travail', 'contracten'],
  // Logement
  ['huis', 'het', 'n', 'la maison', 'Dit is mijn huis.', 'C’est ma maison.', 'Logement', 'huizen'],
  ['sleutel', 'de', 'n', 'la clé', 'Waar is mijn sleutel?', 'Où est ma clé ?', 'Logement', 'sleutels'],
  ['deur', 'de', 'n', 'la porte', 'Doe de deur dicht.', 'Ferme la porte.', 'Logement', 'deuren'],
  ['raam', 'het', 'n', 'la fenêtre', 'Het raam staat open.', 'La fenêtre est ouverte.', 'Logement', 'ramen'],
  ['tuin', 'de', 'n', 'le jardin', 'Wij zitten in de tuin.', 'Nous sommes assis dans le jardin.', 'Logement', 'tuinen'],
  ['buurman', 'de', 'n', 'le voisin', 'De buurman is vriendelijk.', 'Le voisin est aimable.', 'Logement', 'buurmannen'],
  ['huren', null, 'v', 'louer', 'Ik huur een appartement.', 'Je loue un appartement.', 'Logement', null],
  ['trap', 'de', 'n', 'l’escalier', 'Pas op voor de trap.', 'Attention à l’escalier.', 'Logement', 'trappen'],
  ['slaapkamer', 'de', 'n', 'la chambre', 'De slaapkamer is boven.', 'La chambre est en haut.', 'Logement', 'slaapkamers'],
  ['schoonmaken', null, 'v', 'nettoyer', 'Ik ga het huis schoonmaken.', 'Je vais nettoyer la maison.', 'Logement', null],
  // Personnes
  ['familie', 'de', 'n', 'la famille', 'Mijn familie woont hier.', 'Ma famille habite ici.', 'Personnes', 'families'],
  ['vrouw', 'de', 'n', 'la femme, l’épouse', 'Zij is mijn vrouw.', 'C’est ma femme.', 'Personnes', 'vrouwen'],
  ['man', 'de', 'n', 'l’homme, le mari', 'Hij is mijn man.', 'C’est mon mari.', 'Personnes', 'mannen'],
  ['kind', 'het', 'n', 'l’enfant', 'Het kind speelt buiten.', 'L’enfant joue dehors.', 'Personnes', 'kinderen'],
  ['zoon', 'de', 'n', 'le fils', 'Mijn zoon is zes jaar.', 'Mon fils a six ans.', 'Personnes', 'zonen'],
  ['dochter', 'de', 'n', 'la fille (enfant)', 'Mijn dochter gaat naar school.', 'Ma fille va à l’école.', 'Personnes', 'dochters'],
  ['vriend', 'de', 'n', 'l’ami', 'Hij is een goede vriend.', 'C’est un bon ami.', 'Personnes', 'vrienden'],
  ['naam', 'de', 'n', 'le nom', 'Wat is uw naam?', 'Quel est votre nom ?', 'Personnes', 'namen'],
  ['heten', null, 'v', 's’appeler', 'Ik heet Anna.', 'Je m’appelle Anna.', 'Personnes', null],
  ['wonen', null, 'v', 'habiter', 'Waar wonen jullie?', 'Où habitez-vous ?', 'Personnes', null],
  // Temps
  ['vandaag', null, 'adv', 'aujourd’hui', 'Vandaag is het mooi weer.', 'Aujourd’hui, il fait beau.', 'Temps', null],
  ['morgen', null, 'adv', 'demain', 'Morgen ga ik werken.', 'Demain, je vais travailler.', 'Temps', null],
  ['gisteren', null, 'adv', 'hier', 'Gisteren was ik vrij.', 'Hier, j’étais en congé.', 'Temps', null],
  ['week', 'de', 'n', 'la semaine', 'Tot volgende week!', 'À la semaine prochaine !', 'Temps', 'weken'],
  ['jaar', 'het', 'n', 'l’année', 'Ik woon hier al een jaar.', 'J’habite ici depuis un an.', 'Temps', 'jaren'],
  ['ochtend', 'de', 'n', 'le matin', 'In de ochtend drink ik koffie.', 'Le matin, je bois du café.', 'Temps', 'ochtenden'],
  ['avond', 'de', 'n', 'le soir', 'In de avond lees ik een boek.', 'Le soir, je lis un livre.', 'Temps', 'avonden'],
  ['laat', null, 'adj', 'tard', 'Het is al laat.', 'Il est déjà tard.', 'Temps', null],
  ['vroeg', null, 'adj', 'tôt', 'Ik sta vroeg op.', 'Je me lève tôt.', 'Temps', null],
  ['tijd', 'de', 'n', 'le temps', 'Ik heb geen tijd.', 'Je n’ai pas le temps.', 'Temps', 'tijden'],
  // Général
  ['ja', null, 'x', 'oui', 'Ja, dat klopt.', 'Oui, c’est exact.', 'Général', null],
  ['nee', null, 'x', 'non', 'Nee, dank u wel.', 'Non, merci.', 'Général', null],
  ['alstublieft', null, 'x', 's’il vous plaît / voici', 'Een koffie, alstublieft.', 'Un café, s’il vous plaît.', 'Général', null],
  ['dank je wel', null, 'x', 'merci', 'Dank je wel voor de hulp.', 'Merci pour l’aide.', 'Général', null],
  ['hallo', null, 'x', 'bonjour, salut', 'Hallo, hoe gaat het?', 'Bonjour, comment ça va ?', 'Général', null],
  ['tot ziens', null, 'x', 'au revoir', 'Tot ziens, fijne dag!', 'Au revoir, bonne journée !', 'Général', null],
  ['goed', null, 'adj', 'bon, bien', 'Dat is een goed idee.', 'C’est une bonne idée.', 'Général', null],
  ['slecht', null, 'adj', 'mauvais', 'Het weer is slecht.', 'Il fait mauvais.', 'Général', null],
  ['groot', null, 'adj', 'grand', 'Het is een groot huis.', 'C’est une grande maison.', 'Général', null],
  ['klein', null, 'adj', 'petit', 'Mijn auto is klein.', 'Ma voiture est petite.', 'Général', null],
  // Alimentation
  ['water', 'het', 'n', 'l’eau', 'Mag ik een glas water?', 'Puis-je avoir un verre d’eau ?', 'Alimentation', null],
  ['koffie', 'de', 'n', 'le café', 'Ik drink koffie zonder suiker.', 'Je bois mon café sans sucre.', 'Alimentation', null],
  ['thee', 'de', 'n', 'le thé', 'Zij drinkt graag thee.', 'Elle aime boire du thé.', 'Alimentation', null],
  ['vlees', 'het', 'n', 'la viande', 'Ik eet geen vlees.', 'Je ne mange pas de viande.', 'Alimentation', null],
  ['groente', 'de', 'n', 'le légume', 'Groente is gezond.', 'Les légumes sont bons pour la santé.', 'Alimentation', 'groenten'],
  ['fruit', 'het', 'n', 'les fruits', 'Ik eet elke dag fruit.', 'Je mange des fruits tous les jours.', 'Alimentation', null],
  ['koken', null, 'v', 'cuisiner', 'Ik ga vanavond koken.', 'Je vais cuisiner ce soir.', 'Alimentation', null],
  ['lekker', null, 'adj', 'bon (au goût)', 'Het eten was erg lekker.', 'Le repas était très bon.', 'Alimentation', null],
  ['ontbijt', 'het', 'n', 'le petit-déjeuner', 'Ik eet brood bij het ontbijt.', 'Je mange du pain au petit-déjeuner.', 'Alimentation', 'ontbijten'],
  ['avondeten', 'het', 'n', 'le dîner', 'We eten om zes uur avondeten.', 'Nous dînons à six heures.', 'Alimentation', null],
  // Apprendre
  ['boek', 'het', 'n', 'le livre', 'Ik lees een boek.', 'Je lis un livre.', 'Apprendre', 'boeken'],
  ['lezen', null, 'v', 'lire', 'Ik kan een beetje Nederlands lezen.', 'Je sais lire un peu le néerlandais.', 'Apprendre', null],
  ['schrijven', null, 'v', 'écrire', 'Kunt u dat opschrijven?', 'Pouvez-vous l’écrire ?', 'Apprendre', null],
  ['school', 'de', 'n', 'l’école', 'De kinderen zijn op school.', 'Les enfants sont à l’école.', 'Apprendre', 'scholen'],
  ['docent', 'de', 'n', 'le professeur', 'De docent legt het uit.', 'Le professeur l’explique.', 'Apprendre', 'docenten'],
  ['leren', null, 'v', 'apprendre', 'Ik leer Nederlands.', 'J’apprends le néerlandais.', 'Apprendre', null],
  ['begrijpen', null, 'v', 'comprendre', 'Ik begrijp het niet.', 'Je ne comprends pas.', 'Apprendre', null],
  ['vraag', 'de', 'n', 'la question', 'Ik heb een vraag.', 'J’ai une question.', 'Apprendre', 'vragen'],
  ['moeilijk', null, 'adj', 'difficile', 'Deze taal is moeilijk.', 'Cette langue est difficile.', 'Apprendre', null],
  ['makkelijk', null, 'adj', 'facile', 'De toets was makkelijk.', 'Le test était facile.', 'Apprendre', null],
  // Administration & sécurité (ex-dictionnaire)
  ['gemeente', 'de', 'n', 'la commune', 'Ik ga naar de gemeente.', 'Je vais à la mairie.', 'Administration', 'gemeenten'],
  ['belasting', 'de', 'n', 'l’impôt', 'Ik betaal belasting.', 'Je paie des impôts.', 'Administration', 'belastingen'],
  ['brief', 'de', 'n', 'la lettre', 'Ik heb een brief gekregen.', 'J’ai reçu une lettre.', 'Administration', 'brieven'],
  ['formulier', 'het', 'n', 'le formulaire', 'Vul dit formulier in.', 'Remplissez ce formulaire.', 'Administration', 'formulieren'],
  ['ondertekenen', null, 'v', 'signer', 'U moet hier ondertekenen.', 'Vous devez signer ici.', 'Administration', null],
  ['afspraak', 'de', 'n', 'le rendez-vous', 'Ik heb een afspraak om tien uur.', 'J’ai un rendez-vous à dix heures.', 'Administration', 'afspraken'],
  ['verzetten', null, 'v', 'déplacer (un rendez-vous)', 'Ik wil mijn afspraak verzetten.', 'Je voudrais déplacer mon rendez-vous.', 'Administration', null],
  ['postcode', 'de', 'n', 'le code postal', 'Wat is uw postcode?', 'Quel est votre code postal ?', 'Administration', 'postcodes'],
  ['adres', 'het', 'n', 'l’adresse', 'Mijn adres is veranderd.', 'Mon adresse a changé.', 'Administration', 'adressen'],
  ['paspoort', 'het', 'n', 'le passeport', 'Mijn paspoort is nog geldig.', 'Mon passeport est encore valable.', 'Administration', 'paspoorten'],
  ['verzekering', 'de', 'n', 'l’assurance', 'Ik heb een verzekering.', 'J’ai une assurance.', 'Administration', 'verzekeringen'],
  ['verhuizen', null, 'v', 'déménager', 'Wij gaan verhuizen.', 'Nous allons déménager.', 'Logement', null],
  ['huur', 'de', 'n', 'le loyer', 'De huur is hoog.', 'Le loyer est élevé.', 'Logement', null],
  ['ontslag', 'het', 'n', 'le licenciement, la démission', 'Hij heeft ontslag gekregen.', 'Il a été licencié.', 'Travail', null],
  ['rijbewijs', 'het', 'n', 'le permis de conduire', 'Ik heb een rijbewijs.', 'J’ai le permis de conduire.', 'Transports', 'rijbewijzen'],
  ['boete', 'de', 'n', 'l’amende', 'Ik heb een boete gekregen.', 'J’ai reçu une amende.', 'Transports', 'boetes'],
  ['politie', 'de', 'n', 'la police', 'Bel de politie!', 'Appelle la police !', 'Sécurité', null],
  ['gevaarlijk', null, 'adj', 'dangereux', 'Dat is erg gevaarlijk.', 'C’est très dangereux.', 'Sécurité', null],
  ['veilig', null, 'adj', 'en sécurité, sûr', 'Hier ben je veilig.', 'Ici, tu es en sécurité.', 'Sécurité', null],
];

export const POS_LABELS = { n: 'nom', v: 'verbe', adj: 'adjectif', adv: 'adverbe', x: 'expression' };

// Fusion avec le vocabulaire supplémentaire (un mot n’apparaît qu’une fois).
const seen = new Set();
export const VOCAB = [...RAW, ...VOCAB_PLUS_ROWS].filter(([nl]) => (seen.has(nl) ? false : seen.add(nl))).map(([nl, art, pos, fr, ex, exFr, theme, pl]) => ({
  id: 'v:' + nl, nl, art, pos, fr, ex, exFr, theme, pl,
}));

// Regroupement de thèmes voisins, puis séries de 15 mots maximum par thème.
const THEME_OF = { Général: 'Adjectifs & mots utiles', Sécurité: 'Administration', Leren: 'Travail & école', Apprendre: 'Travail & école', Travail: 'Travail & école',
  Transports: 'Ville & transports', Logement: 'Maison', Santé: 'Corps & santé', Temps: 'Temps & calendrier', Courses: 'Courses & argent' };
VOCAB.forEach((w) => { w.theme = THEME_OF[w.theme] || w.theme; });

export const THEMES = [...new Set(VOCAB.map((w) => w.theme))];
export const FLASH_SETS = THEMES.flatMap((t) => {
  const ids = VOCAB.filter((w) => w.theme === t).map((w) => w.id);
  const n = Math.ceil(ids.length / 15);
  return Array.from({ length: n }, (_, i) => ({ theme: t, label: n > 1 ? `${t} ${i + 1}` : t, ids: ids.slice(i * 15, i * 15 + 15) }));
});
