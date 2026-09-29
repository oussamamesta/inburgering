// Verhalen : petites histoires illustrées au niveau A1, pour lire avec plaisir.
// Chaque histoire : 4 scènes (illustration + 3 à 4 phrases, traduction française par phrase),
// une liste de mots et 3 questions de compréhension (bonne réponse en premier).
// Ces histoires ne sont pas un format de l’examen : elles entraînent la lecture fluide et le vocabulaire.

const L = (nl, fr) => [nl, fr];
const Q = (q, qFr, opts, optsFr) => ({ q, qFr, opts, optsFr, corr: 0 });

export const STORIES = [
  {
    id: 'fiets', title: 'Een nieuwe fiets', fr: 'Un nouveau vélo', minutes: 3,
    scenes: [
      [L('Samir woont nu drie weken in Utrecht.', 'Samir habite à Utrecht depuis trois semaines.'), L('Hij heeft nog geen fiets.', 'Il n’a pas encore de vélo.'), L('Vandaag gaat hij naar de fietsenwinkel.', 'Aujourd’hui, il va au magasin de vélos.')],
      [L('De verkoper heet Joost.', 'Le vendeur s’appelle Joost.'), L('Joost laat een blauwe fiets zien.', 'Joost montre un vélo bleu.'), L('„Hij is tweedehands, maar hij is goed,” zegt Joost.', '« Il est d’occasion, mais il est bon », dit Joost.'), L('De fiets kost 120 euro.', 'Le vélo coûte 120 euros.')],
      [L('Samir fietst langs de gracht.', 'Samir roule le long du canal.'), L('De zon schijnt en het waait een beetje.', 'Le soleil brille et il y a un peu de vent.'), L('Hij is blij. Fietsen is leuk!', 'Il est content. Faire du vélo, c’est chouette !')],
      [L('Bij het station staan heel veel fietsen.', 'À la gare, il y a énormément de vélos.'), L('Samir zet zijn fiets in het rek.', 'Samir met son vélo dans le râtelier.'), L('Hij doet de fiets altijd op slot.', 'Il attache toujours son vélo avec un antivol.'), L('Twee sloten is nog beter!', 'Deux antivols, c’est encore mieux !')],
    ],
    words: [L('de fiets', 'le vélo'), L('de winkel', 'le magasin'), L('de verkoper', 'le vendeur'), L('tweedehands', 'd’occasion'), L('de gracht', 'le canal'), L('het rek', 'le râtelier'), L('het slot', 'l’antivol'), L('fietsen', 'faire du vélo')],
    qs: [
      Q('Waar woont Samir?', 'Où habite Samir ?', ['In Utrecht', 'In Amsterdam', 'In Den Haag'], ['À Utrecht', 'À Amsterdam', 'À La Haye']),
      Q('Hoeveel kost de fiets?', 'Combien coûte le vélo ?', ['120 euro', '12 euro', '210 euro'], ['120 euros', '12 euros', '210 euros']),
      Q('Wat doet Samir altijd bij het station?', 'Que fait toujours Samir à la gare ?', ['Hij doet zijn fiets op slot.', 'Hij koopt een kaartje.', 'Hij drinkt koffie.'], ['Il attache son vélo.', 'Il achète un billet.', 'Il boit un café.']),
    ],
  },
  {
    id: 'werkdag', title: 'De eerste werkdag', fr: 'Le premier jour de travail', minutes: 3,
    scenes: [
      [L('Het is maandag, zes uur ’s ochtends.', 'C’est lundi, six heures du matin.'), L('Amina staat vroeg op.', 'Amina se lève tôt.'), L('Vandaag is haar eerste werkdag bij de bakker.', 'Aujourd’hui, c’est son premier jour de travail à la boulangerie.'), L('Ze is een beetje zenuwachtig.', 'Elle est un peu nerveuse.')],
      [L('Om zeven uur is ze bij de bakkerij.', 'À sept heures, elle est à la boulangerie.'), L('Haar collega Lotte zegt: „Goedemorgen! Welkom!”', 'Sa collègue Lotte dit : « Bonjour ! Bienvenue ! »'), L('Amina krijgt een schort.', 'Amina reçoit un tablier.')],
      [L('Lotte laat de oven zien.', 'Lotte montre le four.'), L('Samen maken ze brood en krentenbollen.', 'Ensemble, elles font du pain et des petits pains aux raisins.'), L('Het ruikt heerlijk in de winkel.', 'Ça sent très bon dans la boutique.')],
      [L('Om twaalf uur hebben ze pauze.', 'À midi, elles ont leur pause.'), L('Ze eten samen een broodje.', 'Elles mangent un sandwich ensemble.'), L('Om drie uur zegt Lotte: „Tot morgen!”', 'À trois heures, Lotte dit : « À demain ! »'), L('Amina fietst blij naar huis.', 'Amina rentre chez elle à vélo, contente.')],
    ],
    words: [L('de werkdag', 'le jour de travail'), L('opstaan', 'se lever'), L('de bakkerij', 'la boulangerie'), L('de collega', 'le / la collègue'), L('de schort', 'le tablier'), L('de oven', 'le four'), L('de pauze', 'la pause'), L('zenuwachtig', 'nerveux')],
    qs: [
      Q('Hoe laat staat Amina op?', 'À quelle heure Amina se lève-t-elle ?', ['Om zes uur', 'Om zeven uur', 'Om twaalf uur'], ['À six heures', 'À sept heures', 'À midi']),
      Q('Wie is Lotte?', 'Qui est Lotte ?', ['Een collega van Amina', 'De dochter van Amina', 'Een klant'], ['Une collègue d’Amina', 'La fille d’Amina', 'Une cliente']),
      Q('Wat maken ze samen?', 'Que font-elles ensemble ?', ['Brood en krentenbollen', 'Soep', 'Een taart'], ['Du pain et des petits pains aux raisins', 'De la soupe', 'Un gâteau']),
    ],
  },
  {
    id: 'soep', title: 'Soep voor de buurvrouw', fr: 'De la soupe pour la voisine', minutes: 3,
    scenes: [
      [L('Mevrouw De Vries is de buurvrouw van Karim.', 'Madame De Vries est la voisine de Karim.'), L('Ze is 82 jaar en woont alleen.', 'Elle a 82 ans et vit seule.'), L('Deze week is ze ziek.', 'Cette semaine, elle est malade.')],
      [L('Karim maakt soep.', 'Karim fait de la soupe.'), L('Hij snijdt wortels, uien en aardappels.', 'Il coupe des carottes, des oignons et des pommes de terre.'), L('De soep is warm en lekker.', 'La soupe est chaude et bonne.')],
      [L('Karim belt aan bij mevrouw De Vries.', 'Karim sonne chez madame De Vries.'), L('„Ik heb soep voor u,” zegt hij.', '« J’ai de la soupe pour vous », dit-il.'), L('Mevrouw De Vries lacht. „Wat lief! Dank je wel.”', 'Madame De Vries sourit. « Comme c’est gentil ! Merci. »')],
      [L('Een week later is ze weer beter.', 'Une semaine plus tard, elle va de nouveau bien.'), L('Ze staat bij de deur met een appeltaart.', 'Elle est à la porte avec une tarte aux pommes.'), L('„Voor jou, buurman!”', '« Pour toi, voisin ! »'), L('Nu drinken ze elke vrijdag samen koffie.', 'Maintenant, ils boivent un café ensemble chaque vendredi.')],
    ],
    words: [L('de buurvrouw', 'la voisine'), L('de buurman', 'le voisin'), L('ziek', 'malade'), L('de soep', 'la soupe'), L('snijden', 'couper'), L('aanbellen', 'sonner (à la porte)'), L('de appeltaart', 'la tarte aux pommes'), L('lief', 'gentil')],
    qs: [
      Q('Waarom maakt Karim soep?', 'Pourquoi Karim fait-il de la soupe ?', ['Mevrouw De Vries is ziek.', 'Het is haar verjaardag.', 'Hij heeft honger.'], ['Madame De Vries est malade.', 'C’est son anniversaire.', 'Il a faim.']),
      Q('Wat neemt mevrouw De Vries mee?', 'Qu’apporte madame De Vries ?', ['Een appeltaart', 'Bloemen', 'Soep'], ['Une tarte aux pommes', 'Des fleurs', 'De la soupe']),
      Q('Wanneer drinken ze samen koffie?', 'Quand boivent-ils un café ensemble ?', ['Elke vrijdag', 'Elke maandag', 'Nooit'], ['Chaque vendredi', 'Chaque lundi', 'Jamais']),
    ],
  },
  {
    id: 'regen', title: 'Regen!', fr: 'De la pluie !', minutes: 3,
    scenes: [
      [L('Het is november. Het regent weer.', 'C’est novembre. Il pleut encore.'), L('Yusuf heeft een paraplu, maar het waait hard.', 'Yusuf a un parapluie, mais le vent souffle fort.'), L('Zijn paraplu gaat kapot!', 'Son parapluie se casse !')],
      [L('Hij wacht bij de bushalte.', 'Il attend à l’arrêt de bus.'), L('De bus is tien minuten te laat.', 'Le bus a dix minutes de retard.'), L('Yusuf is nat en koud.', 'Yusuf est mouillé et a froid.')],
      [L('Hij gaat naar een café.', 'Il va dans un café.'), L('Hij bestelt een warme chocolademelk.', 'Il commande un chocolat chaud.'), L('Een vrouw zegt: „Typisch Nederlands weer, hè?”', 'Une femme dit : « Un temps typiquement néerlandais, hein ? »'), L('Ze lachen allebei.', 'Ils rient tous les deux.')],
      [L('Na een uur stopt de regen.', 'Au bout d’une heure, la pluie s’arrête.'), L('Er is een regenboog boven de stad.', 'Il y a un arc-en-ciel au-dessus de la ville.'), L('Nederlanders zeggen: „Er is geen slecht weer, alleen slechte kleren.”', 'Les Néerlandais disent : « Il n’y a pas de mauvais temps, seulement de mauvais vêtements. »')],
    ],
    words: [L('de regen', 'la pluie'), L('het regent', 'il pleut'), L('de paraplu', 'le parapluie'), L('kapot', 'cassé'), L('de bushalte', 'l’arrêt de bus'), L('te laat', 'en retard'), L('nat', 'mouillé'), L('de regenboog', 'l’arc-en-ciel')],
    qs: [
      Q('Wat gebeurt er met de paraplu?', 'Qu’arrive-t-il au parapluie ?', ['Hij gaat kapot.', 'Hij is weg.', 'Hij is nieuw.'], ['Il se casse.', 'Il a disparu.', 'Il est neuf.']),
      Q('Is de bus op tijd?', 'Le bus est-il à l’heure ?', ['Nee, tien minuten te laat.', 'Ja, precies op tijd.', 'Nee, een uur te laat.'], ['Non, dix minutes de retard.', 'Oui, pile à l’heure.', 'Non, une heure de retard.']),
      Q('Wat drinkt Yusuf in het café?', 'Que boit Yusuf au café ?', ['Warme chocolademelk', 'Thee', 'Water'], ['Un chocolat chaud', 'Du thé', 'De l’eau']),
    ],
  },
  {
    id: 'markt', title: 'Op de markt', fr: 'Au marché', minutes: 3,
    scenes: [
      [L('Elke zaterdag is er markt op het plein.', 'Chaque samedi, il y a un marché sur la place.'), L('Fatima gaat met een grote tas.', 'Fatima y va avec un grand sac.'), L('Er zijn kramen met groente, fruit, kaas en vis.', 'Il y a des étals de légumes, de fruits, de fromage et de poisson.')],
      [L('Bij de fruitkraam koopt ze appels.', 'À l’étal de fruits, elle achète des pommes.'), L('„Een kilo appels, alstublieft.”', '« Un kilo de pommes, s’il vous plaît. »'), L('„Dat is twee euro vijftig,” zegt de man.', '« Ça fait deux euros cinquante », dit l’homme.')],
      [L('Bij de kaaskraam mag ze proeven.', 'À l’étal de fromage, elle peut goûter.'), L('„Jong of oud?” vraagt de verkoopster.', '« Jeune ou vieux ? » demande la vendeuse.'), L('Fatima neemt een stuk jonge kaas.', 'Fatima prend un morceau de fromage jeune.')],
      [L('Ze koopt ook een bos tulpen voor vijf euro.', 'Elle achète aussi un bouquet de tulipes pour cinq euros.'), L('Haar tas is vol en zwaar.', 'Son sac est plein et lourd.'), L('„Fijne dag!” zegt de bloemenman.', '« Bonne journée ! » dit le fleuriste.')],
    ],
    words: [L('de markt', 'le marché'), L('het plein', 'la place'), L('de kraam', 'l’étal'), L('de kilo', 'le kilo'), L('proeven', 'goûter'), L('jong / oud', 'jeune / vieux (fromage)'), L('de tulp', 'la tulipe'), L('zwaar', 'lourd')],
    qs: [
      Q('Wanneer is er markt?', 'Quand y a-t-il marché ?', ['Elke zaterdag', 'Elke zondag', 'Elke dag'], ['Chaque samedi', 'Chaque dimanche', 'Tous les jours']),
      Q('Hoeveel kost een kilo appels?', 'Combien coûte un kilo de pommes ?', ['€ 2,50', '€ 5,00', '€ 1,00'], ['2,50 €', '5,00 €', '1,00 €']),
      Q('Welke kaas neemt Fatima?', 'Quel fromage prend Fatima ?', ['Jonge kaas', 'Oude kaas', 'Geen kaas'], ['Du fromage jeune', 'Du fromage vieux', 'Pas de fromage']),
    ],
  },
  {
    id: 'verjaardag', title: 'Verjaardag in de kring', fr: 'Un anniversaire en cercle', minutes: 3,
    scenes: [
      [L('Priya gaat naar de verjaardag van haar collega Daan.', 'Priya va à l’anniversaire de son collègue Daan.'), L('Ze neemt bloemen mee.', 'Elle apporte des fleurs.'), L('Het feest begint om acht uur.', 'La fête commence à huit heures.')],
      [L('In de kamer staan de stoelen in een kring.', 'Dans le salon, les chaises sont en cercle.'), L('Priya geeft iedereen een hand.', 'Priya serre la main de tout le monde.'), L('Tegen de moeder van Daan zegt ze: „Gefeliciteerd met Daan!”', 'À la mère de Daan, elle dit : « Félicitations pour Daan ! »')],
      [L('Eerst is er koffie met taart.', 'D’abord, il y a du café avec du gâteau.'), L('Daarna zijn er drankjes en hapjes.', 'Ensuite, il y a des boissons et des amuse-bouches.'), L('Iedereen praat en lacht.', 'Tout le monde parle et rit.')],
      [L('Om tien uur zingen ze: „Lang zal hij leven!”', 'À dix heures, ils chantent : « Lang zal hij leven ! »'), L('Priya kent het lied nu ook.', 'Priya connaît maintenant la chanson aussi.'), L('Om elf uur gaat ze tevreden naar huis.', 'À onze heures, elle rentre chez elle, contente.')],
    ],
    words: [L('de verjaardag', 'l’anniversaire'), L('het feest', 'la fête'), L('de kring', 'le cercle'), L('een hand geven', 'serrer la main'), L('gefeliciteerd', 'félicitations'), L('de taart', 'le gâteau'), L('de hapjes', 'les amuse-bouches'), L('zingen', 'chanter')],
    qs: [
      Q('Wie is Daan?', 'Qui est Daan ?', ['Een collega van Priya', 'De broer van Priya', 'De buurman van Priya'], ['Un collègue de Priya', 'Le frère de Priya', 'Le voisin de Priya']),
      Q('Wat zegt Priya tegen de moeder van Daan?', 'Que dit Priya à la mère de Daan ?', ['Gefeliciteerd met Daan!', 'Goedemorgen!', 'Tot ziens!'], ['Félicitations pour Daan !', 'Bonjour !', 'Au revoir !']),
      Q('Wat is er eerst?', 'Qu’est-ce qu’il y a d’abord ?', ['Koffie met taart', 'Drankjes en hapjes', 'Soep'], ['Du café avec du gâteau', 'Des boissons et des amuse-bouches', 'De la soupe']),
    ],
  },
  {
    id: 'huisarts', title: 'Bij de huisarts', fr: 'Chez le médecin', minutes: 3,
    scenes: [
      [L('Ahmed heeft al drie dagen hoofdpijn en koorts.', 'Ahmed a mal à la tête et de la fièvre depuis trois jours.'), L('Om acht uur belt hij de huisarts.', 'À huit heures, il appelle le médecin.'), L('De assistente zegt: „U kunt om half elf komen.”', 'L’assistante dit : « Vous pouvez venir à dix heures et demie. »')],
      [L('Ahmed zit in de wachtkamer.', 'Ahmed est assis dans la salle d’attente.'), L('Hij heeft zijn zorgpas bij zich.', 'Il a sa carte d’assurance santé sur lui.'), L('Na tien minuten roept de dokter zijn naam.', 'Au bout de dix minutes, le médecin appelle son nom.')],
      [L('De huisarts luistert goed.', 'Le médecin écoute bien.'), L('Ze meet zijn temperatuur.', 'Elle prend sa température.'), L('„U heeft griep. Rust goed uit en drink veel water.”', '« Vous avez la grippe. Reposez-vous bien et buvez beaucoup d’eau. »')],
      [L('Bij de apotheek haalt hij paracetamol.', 'À la pharmacie, il prend du paracétamol.'), L('Hij belt zijn werk: „Ik ben ziek.”', 'Il appelle son travail : « Je suis malade. »'), L('Na een week is hij weer beter.', 'Au bout d’une semaine, il va de nouveau bien.')],
    ],
    words: [L('de huisarts', 'le médecin généraliste'), L('de hoofdpijn', 'le mal de tête'), L('de koorts', 'la fièvre'), L('de wachtkamer', 'la salle d’attente'), L('de zorgpas', 'la carte d’assurance santé'), L('de griep', 'la grippe'), L('uitrusten', 'se reposer'), L('de apotheek', 'la pharmacie')],
    qs: [
      Q('Hoe lang heeft Ahmed al hoofdpijn?', 'Depuis combien de temps Ahmed a-t-il mal à la tête ?', ['Drie dagen', 'Een week', 'Een uur'], ['Trois jours', 'Une semaine', 'Une heure']),
      Q('Wat zegt de huisarts?', 'Que dit le médecin ?', ['Hij heeft griep.', 'Hij moet naar het ziekenhuis.', 'Hij is niet ziek.'], ['Il a la grippe.', 'Il doit aller à l’hôpital.', 'Il n’est pas malade.']),
      Q('Waar haalt Ahmed paracetamol?', 'Où Ahmed prend-il du paracétamol ?', ['Bij de apotheek', 'Bij de bakker', 'Bij de huisarts'], ['À la pharmacie', 'À la boulangerie', 'Chez le médecin']),
    ],
  },
  {
    id: 'koningsdag', title: 'Koningsdag', fr: 'Le jour du Roi', minutes: 3,
    scenes: [
      [L('Op 27 april is het Koningsdag.', 'Le 27 avril, c’est le jour du Roi.'), L('De koning is jarig.', 'C’est l’anniversaire du roi.'), L('Veel mensen dragen oranje kleren.', 'Beaucoup de gens portent des vêtements orange.')],
      [L('Op straat is een vrijmarkt.', 'Dans la rue, il y a un marché libre.'), L('Iedereen mag oude spullen verkopen.', 'Tout le monde peut vendre de vieilles affaires.'), L('Sanne verkoopt boeken en een lamp.', 'Sanne vend des livres et une lampe.')],
      [L('Overal is muziek.', 'Il y a de la musique partout.'), L('Mensen dansen en zingen op straat.', 'Les gens dansent et chantent dans la rue.'), L('Sanne eet een tompouce met oranje glazuur.', 'Sanne mange un tompouce avec un glaçage orange.')],
      [L('’s Avonds is Sanne moe, maar blij.', 'Le soir, Sanne est fatiguée, mais contente.'), L('Ze heeft vijftien euro verdiend.', 'Elle a gagné quinze euros.'), L('Volgend jaar doet ze weer mee!', 'L’année prochaine, elle participera encore !')],
    ],
    words: [L('de koning', 'le roi'), L('jarig zijn', 'fêter son anniversaire'), L('oranje', 'orange'), L('de vrijmarkt', 'le marché libre'), L('de spullen', 'les affaires'), L('verkopen', 'vendre'), L('dansen', 'danser'), L('moe', 'fatigué')],
    qs: [
      Q('Wanneer is het Koningsdag?', 'Quand est-ce le jour du Roi ?', ['Op 27 april', 'Op 5 mei', 'Op 25 december'], ['Le 27 avril', 'Le 5 mai', 'Le 25 décembre']),
      Q('Welke kleur dragen veel mensen?', 'Quelle couleur portent beaucoup de gens ?', ['Oranje', 'Blauw', 'Groen'], ['Orange', 'Bleu', 'Vert']),
      Q('Wat verkoopt Sanne?', 'Que vend Sanne ?', ['Boeken en een lamp', 'Kaas', 'Bloemen'], ['Des livres et une lampe', 'Du fromage', 'Des fleurs']),
    ],
  },
];

// Questions de compréhension, enregistrées comme éléments « story » (révision espacée).
export const STORY_QUESTIONS = STORIES.flatMap((s, si) => s.qs.map((q, qi) => ({ ...q, id: `st-${s.id}-${qi + 1}`, story: s.id, si, cat: 'verhaal' })));
