import { WARMTH_PHRASES } from "./personality";
import type { UserEmotion } from "@/components/EmotionSelector";

export interface BibleResponse {
  acolhimento: string;
  contexto: string;
  explicacao: string;
  aplicacao: string;
  versiculos: string[];
  oracao: string;
  followUp: string;
}

export const helpTopics = [
  {
    id: "ansiedade",
    emoji: "😰",
    label: "Ansiedade",
    response: {
      acolhimento: "Ei, eu entendo como é difícil quando a ansiedade aperta. Você não está sozinho(a) nisso, tá? Respira fundo comigo — Deus está bem aqui, do seu lado.",
      contexto: "A Bíblia fala bastante sobre ansiedade. Deus sabe que somos frágeis e nunca nos condena por sentir medo do amanhã.",
      explicacao: "A ansiedade é como carregar um peso que não foi feito pra gente. Deus não pede que a gente seja forte — Ele pede que a gente confie.",
      aplicacao: "Fecha os olhos por um minutinho, respira fundo e diz: 'Senhor, eu entrego essa ansiedade nas Tuas mãos.' Depois, escreve 3 coisas pelas quais você é grato(a).",
      versiculos: [
        'Filipenses 4:6-7 — "Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, com ação de graças, apresentem seus pedidos a Deus."',
        '1 Pedro 5:7 — "Lancem sobre ele toda a sua ansiedade, porque ele tem cuidado de vocês."',
      ],
      oracao: "Senhor, Tu conheces cada pensamento que me inquieta. Troca a minha ansiedade pela Tua paz. Amém.",
      followUp: "Quer que eu te ajude com uma meditação guiada sobre paz?",
    },
  },
  {
    id: "tristeza",
    emoji: "😢",
    label: "Tristeza",
    response: {
      acolhimento: "Tudo bem se sentir triste. Sério, tá tudo bem. Até Jesus chorou. Eu estou aqui pra te ouvir. 💙",
      contexto: "A Bíblia nunca esconde a tristeza. Davi, Jeremias, até o próprio Jesus sentiram dor profunda.",
      explicacao: "Tristeza não é fraqueza. É parte de ser humano. Deus promete estar perto de quem tem o coração partido.",
      aplicacao: "Não se cobre pra 'melhorar rápido.' Permita-se sentir. Mas tenta não ficar isolado(a).",
      versiculos: [
        'Salmos 34:18 — "Perto está o Senhor dos que têm o coração quebrantado."',
        'Salmos 30:5 — "O choro pode durar uma noite, mas a alegria vem pela manhã."',
      ],
      oracao: "Pai, Tu vês meu coração agora. Abraça-me com Teu amor, restaura minha esperança. Amém.",
      followUp: "Quer me contar o que está pesando no seu coração?",
    },
  },
  {
    id: "medo",
    emoji: "😨",
    label: "Medo",
    response: {
      acolhimento: "Ter medo é humano. E tá tudo bem admitir isso. Eu estou aqui. 💙",
      contexto: '"Não temas" aparece mais de 365 vezes na Bíblia. Uma pra cada dia do ano.',
      explicacao: "Medo não é o oposto de fé. Até os heróis da Bíblia sentiram medo — Moisés, Gideão, Pedro. A diferença é que eles escolheram confiar em Deus mesmo tremendo.",
      aplicacao: "Identifica o que está te causando medo. Dá um nome pra ele. Depois, fala com Deus especificamente sobre isso.",
      versiculos: [
        'Isaías 41:10 — "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus."',
        '2 Timóteo 1:7 — "Porque Deus não nos deu espírito de covardia, mas de poder, de amor e de equilíbrio."',
      ],
      oracao: "Deus, eu sou honesto(a): estou com medo. Mas escolho acreditar que Tu és maior do que aquilo que me assusta. Amém.",
      followUp: "Quer me dizer o que está te assustando?",
    },
  },
  {
    id: "tentacao",
    emoji: "🔥",
    label: "Tentação",
    response: {
      acolhimento: "Obrigado por ter coragem de falar sobre isso. Sem julgamento aqui, tá? 💙",
      contexto: "Jesus também foi tentado. No deserto, depois de 40 dias de jejum, o diabo veio com tudo. E Jesus respondeu com a Palavra.",
      explicacao: "Ser tentado não é pecado. O que importa é o que a gente faz depois. Deus promete que nunca vai permitir uma tentação maior do que a gente pode suportar.",
      aplicacao: "Quando a tentação vier: 1) Se afaste fisicamente. 2) Ore na hora. 3) Fale com alguém de confiança.",
      versiculos: [
        '1 Coríntios 10:13 — "Fiel é Deus, que não permitirá que sejais tentados além do que podeis suportar."',
        'Tiago 4:7 — "Resisti ao diabo, e ele fugirá de vós."',
      ],
      oracao: "Senhor, me dá forças pra resistir. Mostra a porta de saída que Tu já preparaste. Amém.",
      followUp: "Quer que eu te ajude a criar um plano prático pra quando a tentação aparecer?",
    },
  },
];

export { SYSTEM_PROMPT } from "./personality";
export { WARMTH_PHRASES };

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Intent detection ──
type Intent = "factual" | "theological" | "emotional" | "prayer" | "verse" | "general";

function detectIntent(q: string): Intent {
  const lower = q.toLowerCase();

  if (/orar|ora[cç][aã]o|reza|reze|intercede|ore\s+por/.test(lower)) return "prayer";
  if (/vers[íi]culo|me\s+mostra\s+um\s+vers/i.test(lower)) return "verse";

  // Theology BEFORE factual and emotional
  if (
    /salva[cç][aã]o|gra[cç]a|pecado|trindade|esp[ií]rito\s+santo|batismo|inferno|c[eé]u|predestina|livre\s*arb|apocalipse|arrebatamento|doutrina|teolog|justifica[cç][aã]o|santifica[cç][aã]o|regenera[cç][aã]o|apostasia|jejum|d[ií]zimo|ceia|comunh[aã]o|guerra\s+espiritual|dem[oô]nio|igreja|arrependimento/.test(
      lower
    )
  ) return "theological";

  if (
    /trist|ansio|medo|sozinho|vazio|dor|sofr|culpa|cansa|confus|ang[uú]st|desespero|preocup|aflito|afli[cç]/.test(
      lower
    )
  ) return "emotional";

  if (/^(quem|qual|quantos?|quantas?|onde|quando|como|o que|por que)\b/.test(lower)) return "factual";

  return "general";
}

// ── Emotion-aware openings ──
const emotionOpenings: Record<string, string[]> = {
  triste: [
    "Eu sinto que isso está pesado pra você…",
    "Imagino que isso não esteja sendo fácil…",
    "Seu coração merece cuidado agora.",
    "Deus vê cada lágrima sua, e nenhuma é esquecida.",
  ],
  ansioso: [
    "Respira fundo… vai ficar tudo bem.",
    "Imagino que o coração esteja acelerado. Vamos com calma.",
    "A ansiedade pode apertar, mas Deus segura você.",
    "Isso realmente pode mexer com a gente…",
  ],
  cansado: [
    "Eu entendo esse cansaço. Deus também descansou — e te convida pra isso.",
    "Estar cansado não é fraqueza. É sinal de que você tem dado tudo.",
    "Vem, vamos respirar junto. Sem pressa.",
  ],
  confuso: [
    "Eu sei como é não ter clareza. Mas Deus não te deixa no escuro.",
    "A confusão passa. A Palavra traz direção.",
    "Você não precisa ter todas as respostas agora.",
  ],
  em_paz: [
    "Que lindo sentir paz. Isso é um presente de Deus. 😊",
    "A paz do Senhor é diferente — ela sustenta a alma.",
    "Aproveita esse momento. Deus está sorrindo com você.",
  ],
};

const defaultOpenings = [
  "Entendo você.",
  "Obrigado por confiar em mim pra falar sobre isso.",
  "Faz total sentido sentir isso.",
  "Isso realmente pode mexer com a gente…",
  "Eu te ouço. E Deus também.",
  "Imagino como isso pode ser pesado…",
];

function getEmotionAcolhimento(emotion: UserEmotion): string {
  if (emotion && emotionOpenings[emotion]) {
    return pick(emotionOpenings[emotion]);
  }
  return pick(defaultOpenings);
}

// ── Helper builders ──
function buildDirectTheologyResponse(opts: {
  direct: string;
  context: string;
  explanation: string;
  application: string;
  verses: string[];
  prayer: string;
  followUp: string;
}): BibleResponse {
  return {
    acolhimento: opts.direct,
    contexto: opts.context,
    explicacao: opts.explanation,
    aplicacao: opts.application,
    versiculos: opts.verses,
    oracao: opts.prayer,
    followUp: opts.followUp,
  };
}

function buildDebatedTheologyResponse(opts: {
  direct: string;
  context: string;
  explanation: string;
  application: string;
  verses: string[];
  prayer: string;
}): BibleResponse {
  return {
    acolhimento: opts.direct,
    contexto: opts.context,
    explicacao: opts.explanation,
    aplicacao: opts.application,
    versiculos: opts.verses,
    oracao: opts.prayer,
    followUp: "Quer que eu aprofunde algum desses pontos de vista?",
  };
}

// ── Theological matcher ──
function matchTheological(q: string): BibleResponse | null {
  const lower = q.toLowerCase();

  if (/salva[cç][aã]o|como\s+(ser|sou)\s+salvo/.test(lower)) {
    return buildDirectTheologyResponse({
      direct: "Salvação é o resgate que Deus faz da humanidade através de Jesus Cristo.",
      context: "A Bíblia ensina que todos pecaram e estão separados de Deus. A salvação é a ponte que Deus construiu pra restaurar esse relacionamento.",
      explanation: "Não é por mérito ou esforço humano. É pela graça de Deus, recebida pela fé em Jesus. Ele viveu, morreu e ressuscitou pra que a gente pudesse ter vida eterna.",
      application: "A salvação começa com um 'sim' sincero a Jesus. Não precisa ser perfeito — precisa ser honesto.",
      verses: [
        'Efésios 2:8-9 — "Pois vocês são salvos pela graça, por meio da fé, e isso não vem de vocês, é dom de Deus."',
        'Romanos 10:9 — "Se você confessar com a sua boca que Jesus é Senhor e crer em seu coração que Deus o ressuscitou dentre os mortos, será salvo."',
      ],
      prayer: "Senhor Jesus, eu reconheço que preciso de Ti. Aceito Tua graça e entrego minha vida nas Tuas mãos. Amém.",
      followUp: "Quer entender melhor o que muda na vida de alguém que aceita Jesus?",
    });
  }

  if (/gra[cç]a/.test(lower)) {
    return buildDirectTheologyResponse({
      direct: "Graça é o favor imerecido de Deus — algo que recebemos sem ter como pagar.",
      context: "No Antigo Testamento, a graça já aparecia nas promessas e na paciência de Deus. No Novo Testamento, ela se torna central em Jesus.",
      explanation: "Graça não é Deus ignorando o pecado. É Deus pagando o preço que a gente deveria pagar. É amor em ação quando a gente menos merece.",
      application: "Viver pela graça é parar de tentar 'merecer' Deus e começar a descansar no que Ele já fez.",
      verses: [
        'Romanos 3:24 — "Sendo justificados gratuitamente por sua graça, por meio da redenção que há em Cristo Jesus."',
        '2 Coríntios 12:9 — "A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza."',
      ],
      prayer: "Pai, obrigado pela Tua graça. Me ajuda a viver nela sem culpa e sem medo. Amém.",
      followUp: "Quer entender a diferença entre graça e misericórdia?",
    });
  }

  if (/pecado/.test(lower)) {
    return buildDirectTheologyResponse({
      direct: "Pecado é tudo aquilo que nos separa de Deus — em ação, pensamento ou omissão.",
      context: "Desde Gênesis 3, a humanidade vive com as consequências do pecado. Mas a história não termina aí — Deus já providenciou a solução.",
      explanation: "Pecado não é só 'fazer coisas ruins'. É viver desalinhado do propósito de Deus. Todos pecaram — mas em Cristo, temos perdão e restauração.",
      application: "Reconhecer o pecado não é motivo de vergonha. É o primeiro passo pra liberdade. Deus não te condena — Ele te convida a voltar.",
      verses: [
        'Romanos 3:23 — "Pois todos pecaram e estão destituídos da glória de Deus."',
        '1 João 1:9 — "Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar."',
      ],
      prayer: "Senhor, eu reconheço que errei. Mas sei que Teu perdão é maior que qualquer falha minha. Amém.",
      followUp: "Quer entender como lidar com a culpa de forma saudável?",
    });
  }

  if (/trindade/.test(lower)) {
    return buildDirectTheologyResponse({
      direct: "A Trindade é a doutrina de um só Deus em três pessoas: Pai, Filho e Espírito Santo.",
      context: "A fé cristã histórica afirma um único Deus em essência, revelado eternamente como três pessoas distintas.",
      explanation: "Não são três deuses, nem um Deus mudando de forma. É um único Deus, eternamente Pai, Filho e Espírito Santo — cada um plenamente Deus, cada um distinto.",
      application: "A Trindade nos ajuda a enxergar a profundidade de quem Deus é e a beleza do relacionamento dentro do próprio ser divino.",
      verses: [
        'Mateus 28:19 — "Em nome do Pai, do Filho e do Espírito Santo."',
        '2 Coríntios 13:13 — "A graça do Senhor Jesus Cristo, o amor de Deus e a comunhão do Espírito Santo sejam com todos vocês."',
      ],
      prayer: "Senhor, aumenta minha reverência e meu entendimento diante da Tua grandeza. Amém.",
      followUp: "Quer que eu te explique a Trindade de forma ainda mais simples?",
    });
  }

  if (/esp[ií]rito\s+santo/.test(lower)) {
    return buildDirectTheologyResponse({
      direct: "O Espírito Santo é Deus presente e atuante na vida do cristão.",
      context: "Jesus prometeu o Consolador, e o Espírito Santo foi derramado para habitar, ensinar, convencer e fortalecer o povo de Deus.",
      explanation: "Ele não é uma força impessoal. É pessoa divina: consola, guia, ensina, convence do pecado e produz fruto em quem caminha com Deus.",
      application: "A vida cristã não foi feita para ser vivida só na força humana. Busque sensibilidade à direção do Espírito Santo no dia a dia.",
      verses: [
        'João 14:26 — "O Consolador, o Espírito Santo, vos ensinará todas as coisas."',
        'Gálatas 5:22 — "O fruto do Espírito é amor, alegria, paz, paciência, amabilidade, bondade, fidelidade, mansidão e domínio próprio."',
      ],
      prayer: "Espírito Santo, guia meus pensamentos, minhas escolhas e meu coração hoje. Amém.",
      followUp: "Quer que eu te explique o que significa ser guiado pelo Espírito?",
    });
  }

  if (/predestina|livre\s*arb/.test(lower)) {
    return buildDebatedTheologyResponse({
      direct: "Esse é um dos temas mais debatidos da teologia cristã — e ambos os lados têm base bíblica.",
      context: "Alguns enfatizam a soberania de Deus na salvação; outros enfatizam mais a responsabilidade humana em responder ao chamado divino.",
      explanation: "Textos como Efésios 1 e Romanos 8 são usados por quem destaca predestinação. Já textos de convite, escolha e responsabilidade são usados por quem enfatiza livre-arbítrio. Ambas as posições reconhecem que Deus é soberano e que o ser humano é responsável.",
      application: "Mais importante que vencer debate é responder a Deus com fé, reverência e humildade. Confie no caráter de Deus.",
      verses: [
        'Efésios 1:5 — "Nos predestinou para ele, para a adoção de filhos."',
        'Josué 24:15 — "Escolhei hoje a quem sirvais."',
      ],
      prayer: "Senhor, me dá humildade diante do que é profundo e fidelidade diante do que já está claro. Amém.",
    });
  }

  if (/batismo/.test(lower)) {
    return buildDirectTheologyResponse({
      direct: "Batismo é um sinal público de fé e identificação com Cristo.",
      context: "No Novo Testamento, ele aparece ligado à conversão e arrependimento. É um ato de obediência e testemunho.",
      explanation: "Simboliza morte para a velha vida e nova vida em Cristo. Não é o que salva, mas é parte importante da caminhada cristã.",
      application: "Se você crê em Cristo e ainda não foi batizado, vale tratar isso com seriedade e conversar com sua igreja.",
      verses: [
        'Romanos 6:4 — "Fomos sepultados com ele na morte pelo batismo, para que andemos em novidade de vida."',
        'Atos 2:38 — "Arrependam-se e cada um de vocês seja batizado em nome de Jesus Cristo."',
      ],
      prayer: "Senhor, me ajuda a viver de forma pública aquilo que creio no meu coração. Amém.",
      followUp: "Quer entender as diferentes formas de batismo nas tradições cristãs?",
    });
  }

  if (/justifica[cç][aã]o/.test(lower)) {
    return buildDirectTheologyResponse({
      direct: "Justificação é o ato de Deus declarar justo quem crê em Cristo.",
      context: "Paulo desenvolve isso especialmente em Romanos: somos declarados justos não por obras, mas pela fé no sacrifício de Jesus.",
      explanation: "Não é que Deus finge que somos perfeitos. Ele nos vê através de Cristo. É como se a justiça de Jesus fosse creditada na nossa conta.",
      application: "Isso muda tudo: você não precisa viver tentando provar valor pra Deus. Já foi aceito.",
      verses: [
        'Romanos 5:1 — "Tendo sido justificados pela fé, temos paz com Deus."',
        'Romanos 3:28 — "O homem é justificado pela fé, independentemente das obras da Lei."',
      ],
      prayer: "Pai, obrigado por me aceitar não pelo que eu faço, mas pelo que Jesus fez por mim. Amém.",
      followUp: "Quer que eu compare justificação com santificação de forma simples?",
    });
  }

  if (/santifica[cç][aã]o/.test(lower)) {
    return buildDirectTheologyResponse({
      direct: "Santificação é o processo de ser transformado à imagem de Cristo ao longo da vida.",
      context: "Diferente da justificação (que é instantânea), a santificação é progressiva. É o Espírito Santo trabalhando em nós dia após dia.",
      explanation: "Não é perfeição instantânea. É crescimento. É querer ser mais parecido com Jesus em cada decisão, cada pensamento, cada atitude.",
      application: "Santificação não é esforço solitário — é cooperação com o Espírito Santo. Leia a Palavra, ore, esteja em comunidade.",
      verses: [
        '1 Tessalonicenses 4:3 — "A vontade de Deus é a santificação de vocês."',
        'Filipenses 1:6 — "Aquele que começou boa obra em vocês vai completá-la."',
      ],
      prayer: "Senhor, continua me transformando. Eu quero parecer mais com Jesus a cada dia. Amém.",
      followUp: "Quer que eu te explique práticas que ajudam na santificação?",
    });
  }

  if (/regenera[cç][aã]o|novo\s+nascimento|nascer\s+de\s+novo/.test(lower)) {
    return buildDirectTheologyResponse({
      direct: "Regeneração é o novo nascimento operado por Deus no coração humano.",
      context: "Jesus falou sobre isso com Nicodemos em João 3, mostrando que ninguém entra no Reino apenas por tradição, religião ou esforço.",
      explanation: "Ser regenerado é receber nova vida espiritual. Não é só melhorar hábitos, mas ser transformado de dentro pra fora pela ação de Deus.",
      application: "Isso mostra que o cristianismo não é maquiagem moral. É vida nova em Cristo.",
      verses: [
        'João 3:3 — "Se alguém não nascer de novo, não pode ver o Reino de Deus."',
        'Tito 3:5 — "Ele nos salvou... mediante o lavar regenerador e renovador do Espírito Santo."',
      ],
      prayer: "Senhor, continua renovando meu coração e produzindo em mim vida nova. Amém.",
      followUp: "Quer que eu te explique a diferença entre regeneração, conversão e santificação?",
    });
  }

  if (/d[ií]zimo/.test(lower)) {
    return buildDebatedTheologyResponse({
      direct: "O dízimo é um tema com diferentes interpretações entre os cristãos.",
      context: "No Antigo Testamento, o dízimo (10%) era parte da Lei mosaica. No Novo Testamento, Paulo fala em generosidade voluntária.",
      explanation: "Alguns entendem que o dízimo continua como princípio; outros enfatizam a oferta generosa e voluntária como modelo neotestamentário. Ambos concordam que Deus valoriza um coração generoso.",
      application: "Mais do que percentual, Deus olha pro coração. Dê com alegria, com propósito, e confie na provisão dEle.",
      verses: [
        'Malaquias 3:10 — "Trazei todos os dízimos à casa do tesouro."',
        '2 Coríntios 9:7 — "Cada um dê conforme determinou em seu coração, não com tristeza nem por obrigação."',
      ],
      prayer: "Senhor, me ensina a ser generoso como Tu és comigo. Amém.",
    });
  }

  if (/inferno/.test(lower)) {
    return buildDirectTheologyResponse({
      direct: "O inferno é descrito na Bíblia como o lugar de separação eterna de Deus.",
      context: "Jesus falou mais sobre o inferno do que qualquer outro personagem bíblico. Ele usou termos como 'Geena' e 'trevas exteriores'.",
      explanation: "A essência do inferno não é fogo literal necessariamente, mas a ausência total de Deus — de tudo que é bom, belo e verdadeiro. É a consequência final da rejeição de Deus.",
      application: "A existência do inferno mostra a seriedade das nossas escolhas — mas também a grandeza da salvação que Deus oferece em Cristo.",
      verses: [
        'Mateus 25:46 — "E irão estes para o castigo eterno, porém os justos, para a vida eterna."',
        'João 3:16 — "Para que todo o que nele crê não pereça, mas tenha a vida eterna."',
      ],
      prayer: "Senhor, obrigado pela salvação em Cristo. Me ajuda a viver com essa urgência no coração. Amém.",
      followUp: "Quer entender melhor o que Jesus ensinou sobre a eternidade?",
    });
  }

  if (/apocalipse|arrebatamento/.test(lower)) {
    return buildDebatedTheologyResponse({
      direct: "Escatologia (o estudo dos últimos tempos) é um tema com múltiplas interpretações entre cristãos sinceros.",
      context: "O livro de Apocalipse usa linguagem simbólica e profética. Sobre o arrebatamento, cristãos divergem quanto ao momento e ao modo.",
      explanation: "Existem visões pré-tribulacionistas, pós-tribulacionistas e amilenistas, entre outras. Todas se baseiam em textos bíblicos, mas com ênfases diferentes.",
      application: "O mais importante não é acertar a cronologia, mas viver preparado — com fé, amor e esperança em Cristo.",
      verses: [
        '1 Tessalonicenses 4:17 — "Seremos arrebatados juntamente com eles nas nuvens."',
        'Apocalipse 21:4 — "Ele enxugará dos seus olhos toda lágrima."',
      ],
      prayer: "Senhor, me ajuda a viver cada dia como se fosse o último — e como se houvesse mil pela frente. Amém.",
    });
  }

  if (/arrependimento/.test(lower)) {
    return buildDirectTheologyResponse({
      direct: "Arrependimento é mudar de direção — é reconhecer o erro e voltar pra Deus.",
      context: "A palavra grega 'metanoia' significa literalmente 'mudança de mente'. É mais do que remorso — é transformação.",
      explanation: "Arrependimento bíblico não é apenas sentir culpa. É uma decisão de abandonar o caminho errado e caminhar na direção de Deus. E é o Espírito Santo quem produz isso em nós.",
      application: "Se algo no seu coração te incomoda, isso pode ser o Espírito te chamando. Não ignore — responda.",
      verses: [
        'Atos 3:19 — "Arrependam-se e voltem-se para Deus, para que os seus pecados sejam cancelados."',
        '2 Crônicas 7:14 — "Se o meu povo... se humilhar, orar... eu perdoarei os seus pecados."',
      ],
      prayer: "Pai, me dá coragem pra mudar de direção onde eu preciso. Eu quero andar contigo. Amém.",
      followUp: "Quer conversar sobre algo específico que está no seu coração?",
    });
  }

  if (/igreja/.test(lower)) {
    return buildDirectTheologyResponse({
      direct: "Igreja não é um prédio — é o corpo de Cristo, formado por todos os que creem nEle.",
      context: "No Novo Testamento, 'ekklesia' significa 'os chamados para fora'. A igreja é a comunidade dos que seguem Jesus.",
      explanation: "A igreja local é onde cristãos se reúnem pra adorar, aprender, servir e crescer juntos. Não é perfeita — mas é o plano de Deus pra comunidade.",
      application: "Se você está longe da igreja, considere voltar. Se está na igreja mas desanimado, lembre que o objetivo não é a instituição — é Jesus.",
      verses: [
        'Mateus 16:18 — "Edificarei a minha igreja."',
        'Hebreus 10:25 — "Não deixemos de congregar-nos."',
      ],
      prayer: "Senhor, me ajuda a encontrar meu lugar no Teu corpo. Amém.",
      followUp: "Quer conversar sobre como encontrar uma boa igreja?",
    });
  }

  return null;
}

// ── Factual matcher ──
function matchFactual(q: string): BibleResponse | null {
  const lower = q.toLowerCase();

  if (/rei\s+(antes|anterior)\s+(d[eo]\s+)?davi|antes\s+d[eo]\s+davi/.test(lower)) {
    return {
      acolhimento: "Foi Saul. 😊",
      contexto: "O primeiro rei de Israel foi Saul, da tribo de Benjamim. Ele foi ungido pelo profeta Samuel a pedido do povo.",
      explicacao: "Saul reinou por cerca de 40 anos, mas desobedeceu a Deus repetidamente. Quando Deus o rejeitou como rei, enviou Samuel para ungir Davi.",
      aplicacao: "A história de Saul nos ensina que posição sem obediência não se sustenta.",
      versiculos: [
        '1 Samuel 15:22 — "Obedecer é melhor do que sacrificar."',
        '1 Samuel 16:7 — "O Senhor não vê como o homem vê. O homem vê a aparência, mas o Senhor vê o coração."',
      ],
      oracao: "Senhor, me dá um coração obediente como o de Davi. Amém.",
      followUp: "Quer saber mais sobre a vida de Davi?",
    };
  }

  if (/quantos\s+livros/.test(lower)) {
    return {
      acolhimento: "A Bíblia tem 66 livros. 😊",
      contexto: "São 39 no Antigo Testamento e 27 no Novo Testamento. Escrita por cerca de 40 autores ao longo de ~1.500 anos.",
      explicacao: "O AT inclui a Lei, Históricos, Poéticos e Proféticos. O NT tem os Evangelhos, Atos, as Cartas e o Apocalipse.",
      aplicacao: "Comece com João, depois Salmos e Provérbios. Aos poucos, cada livro vai ganhando sentido.",
      versiculos: [
        '2 Timóteo 3:16 — "Toda a Escritura é inspirada por Deus e útil para o ensino."',
      ],
      oracao: "Deus, me ajuda a amar a Tua Palavra cada dia mais. Amém.",
      followUp: "Quer que eu te sugira um plano de leitura?",
    };
  }

  if (/quantos\s+(disc[ií]pulos|apóstolos)|12\s+disc[ií]pulos|doze\s+disc/.test(lower)) {
    return {
      acolhimento: "Jesus escolheu 12 discípulos. 😊",
      contexto: "Os doze eram: Pedro, André, Tiago, João, Filipe, Bartolomeu, Mateus, Tomé, Tiago (filho de Alfeu), Tadeu, Simão e Judas Iscariotes.",
      explicacao: "Depois da traição de Judas, Matias foi escolhido. Mais tarde, Paulo também foi chamado como apóstolo.",
      aplicacao: "Eram pessoas comuns. Deus não escolhe os capacitados — Ele capacita os escolhidos.",
      versiculos: [
        'Marcos 3:14 — "Designou doze, para que estivessem com ele e os enviasse a pregar."',
      ],
      oracao: "Senhor, usa a minha vida para espalhar o Teu amor. Amém.",
      followUp: "Quer conhecer a história de algum discípulo em particular?",
    };
  }

  if (/onde\s+jesus\s+nasceu|nascimento\s+de\s+jesus/.test(lower)) {
    return {
      acolhimento: "Jesus nasceu em Belém de Judá. 😊",
      contexto: "Maria e José estavam lá por causa de um censo ordenado por César Augusto.",
      explicacao: "O nascimento em Belém era profecia de Miquéias (5:2). Jesus nasceu em uma manjedoura — o Rei dos reis veio da forma mais humilde.",
      aplicacao: "Deus não se importa com status. Ele está perto dos mais humildes.",
      versiculos: [
        'Miquéias 5:2 — "Mas tu, Belém Efrata… de ti me sairá o que governará em Israel."',
        'Lucas 2:7 — "Deu à luz o seu filho primogênito… e o deitou em uma manjedoura."',
      ],
      oracao: "Senhor Jesus, obrigado por ter vindo ao mundo por mim. Amém.",
      followUp: "Quer saber mais sobre a infância de Jesus?",
    };
  }

  return null;
}

// ── Emotional matcher ──
function matchEmotional(q: string, emotion?: UserEmotion | null): BibleResponse | null {
  const lower = q.toLowerCase();

  if (/ansio|preocup|nervos/.test(lower) || emotion === "ansioso") {
    return {
      acolhimento: "Eu sinto que isso está pesado pra você… mas você não está sozinho. 💙",
      contexto: "Deus não ignora sua ansiedade. Ele te convida a lançar sobre Ele tudo que te pesa.",
      explicacao: "Ansiedade é real, e Deus entende. Ele não pede que você seja forte — pede que confie nEle.",
      aplicacao: "Respira fundo agora. Inspira contando até 4, segura 4, solta 4. Faz isso 3 vezes.",
      versiculos: [
        'Filipenses 4:6-7 — "Não andem ansiosos por coisa alguma… a paz de Deus guardará o coração de vocês."',
        '1 Pedro 5:7 — "Lancem sobre ele toda a sua ansiedade."',
      ],
      oracao: "Senhor, acalma meu coração. Eu entrego o que não consigo controlar. Amém.",
      followUp: "Quer que eu te guie em um exercício de respiração agora?",
    };
  }

  if (/medo/.test(lower) || emotion === "medo") {
    return {
      acolhimento: "Eu entendo esse medo… e tá tudo bem sentir isso. 💙",
      contexto: "Deus está com você — mesmo quando tudo parece incerto.",
      explicacao: "O medo não te define. Até os heróis da Bíblia sentiram medo. O que importa é pra quem você corre quando o medo vem.",
      aplicacao: "Dá um nome pro que te assusta. Fala com Deus sobre isso agora — Ele já sabe, mas quer ouvir de você.",
      versiculos: [
        'Isaías 41:10 — "Não temas, porque eu sou contigo."',
        '2 Timóteo 1:7 — "Deus não nos deu espírito de covardia, mas de poder, amor e equilíbrio."',
      ],
      oracao: "Senhor, tira meu medo e enche meu coração de coragem. Amém.",
      followUp: "Quer orar mais específico sobre o que está te assustando?",
    };
  }

  if (/trist|chorar|sozinho/.test(lower) || emotion === "triste") {
    return {
      acolhimento: "Eu sinto muito por isso… mas você não precisa enfrentar sozinho. 💙",
      contexto: "Deus guarda cada lágrima sua. Ele está perto dos que sofrem.",
      explicacao: "Sentir tristeza não é fraqueza. É humano. Até Jesus chorou. O que importa é não ficar sozinho nela.",
      aplicacao: "Se permita sentir. Mas não se isole. Fala com Deus, fala com alguém de confiança.",
      versiculos: [
        'Salmos 34:18 — "Perto está o Senhor dos que têm o coração quebrantado."',
        'Salmos 30:5 — "O choro pode durar uma noite, mas a alegria vem pela manhã."',
      ],
      oracao: "Pai, abraça meu coração agora. Restaura minha esperança. Amém.",
      followUp: "Quer me contar mais sobre o que está pesando no seu coração?",
    };
  }

  if (/culpa/.test(lower)) {
    return {
      acolhimento: "Imagino como isso pode estar te consumindo… mas existe graça pra isso. 💙",
      contexto: "A culpa pode ser pesada, mas Deus não quer que você viva preso nela.",
      explicacao: "Existe uma diferença entre convicção (que vem do Espírito e leva ao arrependimento) e condenação (que vem do inimigo e paralisa). Deus convence — não condena.",
      aplicacao: "Se tem algo que precisa acertar, dê o primeiro passo. Mas saiba que o perdão de Deus já está disponível.",
      versiculos: [
        'Romanos 8:1 — "Não há condenação para os que estão em Cristo Jesus."',
        '1 João 1:9 — "Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar."',
      ],
      oracao: "Senhor, me liberta da culpa. Eu aceito Teu perdão e escolho não me condenar mais. Amém.",
      followUp: "Quer conversar sobre como lidar com a culpa de forma saudável?",
    };
  }

  if (/cansa|exaust|esgota/.test(lower) || emotion === "cansado") {
    return {
      acolhimento: "Eu entendo esse cansaço… você tem dado tudo de si. 💙",
      contexto: "Deus também descansou — e te convida pra fazer o mesmo.",
      explicacao: "Cansaço não é falta de fé. É sinal de que você precisa de cuidado. Deus não espera que você carregue tudo sozinho.",
      aplicacao: "Pare um pouco. Respire. Não precisa resolver tudo hoje. Descanse na presença de Deus.",
      versiculos: [
        'Mateus 11:28 — "Venham a mim, todos os que estão cansados e sobrecarregados, e eu darei descanso."',
      ],
      oracao: "Senhor, renova minhas forças. Eu descanso em Ti. Amém.",
      followUp: "Quer que eu te ajude com um momento de pausa guiada?",
    };
  }

  return null;
}

// ── Named topic matches ──
function matchNamedTopic(q: string, emotion: UserEmotion): BibleResponse | null {
  const lower = q.toLowerCase();

  if (/paulo|apóstolo/.test(lower)) {
    return {
      acolhimento: "Que pergunta boa! A história de Paulo é incrível. 😊",
      contexto: "Paulo — antes chamado Saulo — perseguia cristãos com toda energia. Até que teve um encontro com Jesus na estrada de Damasco.",
      explicacao: "Depois daquele encontro, Paulo se tornou o maior missionário da história. Viajou fundando igrejas, enfrentou prisões — e escreveu boa parte do Novo Testamento.",
      aplicacao: "Se Deus transformou o maior perseguidor no maior missionário, imagina o que Ele pode fazer com a sua história?",
      versiculos: [
        'Atos 9:15 — "Este é para mim um instrumento escolhido."',
        'Gálatas 2:20 — "Já estou crucificado com Cristo; e vivo, não mais eu, mas Cristo vive em mim."',
      ],
      oracao: "Senhor, transforma a minha vida como transformaste a de Paulo. Amém.",
      followUp: "Quer saber mais sobre alguma passagem da vida de Paulo?",
    };
  }

  if (/perd[aã]o|perdoar/.test(lower)) {
    return {
      acolhimento: `${getEmotionAcolhimento(emotion)} Falar sobre perdão nem sempre é fácil, né? 💙`,
      contexto: "O perdão é central na Bíblia. Quando Pedro perguntou 'Quantas vezes devo perdoar?', Jesus respondeu: 'Não sete, mas setenta vezes sete.'",
      explicacao: "Perdoar não significa fingir que não doeu. É soltar o peso da mágoa — não pelo outro, mas por você.",
      aplicacao: "Se tem alguém que você precisa perdoar, fale com Deus sobre isso: 'Deus, eu não consigo sozinho(a). Me ajuda.'",
      versiculos: [
        'Efésios 4:32 — "Perdoando-se mutuamente, assim como Deus os perdoou em Cristo."',
        'Mateus 6:14 — "Se perdoardes aos homens, também vosso Pai celestial vos perdoará."',
      ],
      oracao: "Pai, tira de mim a amargura e enche meu coração de graça. Amém.",
      followUp: "Quer dar o próximo passo sobre como perdoar quando parece impossível?",
    };
  }

  if (/f[eé]/.test(lower)) {
    return {
      acolhimento: `${getEmotionAcolhimento(emotion)} Falar sobre fé é falar sobre o que sustenta tudo. 😊`,
      contexto: 'Hebreus 11:1 define fé como "a certeza daquilo que esperamos e a prova das coisas que não vemos."',
      explicacao: "Fé não é ausência de dúvida. É escolher confiar em Deus mesmo sem entender tudo. Todo herói da fé na Bíblia teve momentos de questionamento.",
      aplicacao: "Fé se fortalece com prática: ler a Palavra, orar, lembrar do que Deus já fez. Comece pequeno — Deus honra cada passo.",
      versiculos: [
        'Hebreus 11:1 — "A fé é a certeza daquilo que esperamos e a prova das coisas que não vemos."',
        'Marcos 9:24 — "Eu creio, Senhor! Ajuda-me na minha falta de fé."',
      ],
      oracao: "Senhor, aumenta minha fé. Me ajuda a confiar em Ti mesmo quando não entendo. Amém.",
      followUp: "Quer que eu te conte a história de algum personagem bíblico que viveu por fé?",
    };
  }

  return null;
}

// ── Prayer response ──
function buildPrayerResponse(emotion: UserEmotion): BibleResponse {
  return {
    acolhimento: `${getEmotionAcolhimento(emotion)} Vamos orar juntos. 💙`,
    contexto: "A oração é a conversa mais íntima que você pode ter com Deus. Ele ouve — sempre.",
    explicacao: "Não precisa ser bonito ou formal. Deus quer ouvir o que está no seu coração, do jeito que vier.",
    aplicacao: "Fecha os olhos, respira fundo, e fala com Deus como se Ele estivesse sentado do seu lado. Porque Ele está.",
    versiculos: [
      'Filipenses 4:6 — "Em tudo, pela oração… apresentem seus pedidos a Deus."',
      'Salmos 145:18 — "Perto está o Senhor de todos os que o invocam."',
    ],
    oracao: "Pai, eu venho a Ti agora com tudo que sou. Ouve meu coração. Me encontra aqui. Amém.",
    followUp: "Quer que eu faça uma oração mais específica sobre algo que está no seu coração?",
  };
}

// ── Verse response ──
function buildVerseResponse(): BibleResponse {
  const verses = [
    { ref: "Salmos 23:1", text: "O Senhor é o meu pastor, nada me faltará." },
    { ref: "Jeremias 29:11", text: "Eu sei os planos que tenho pra vocês — planos de paz e não de mal." },
    { ref: "Romanos 8:28", text: "Todas as coisas cooperam para o bem daqueles que amam a Deus." },
    { ref: "Isaías 40:31", text: "Os que esperam no Senhor renovam suas forças." },
    { ref: "Josué 1:9", text: "Seja forte e corajoso! Não se apavore, porque o Senhor está com você." },
  ];
  const v = pick(verses);
  return {
    acolhimento: "Aqui vai um versículo pra te acompanhar hoje. 😊",
    contexto: `${v.ref}`,
    explicacao: `"${v.text}"`,
    aplicacao: "Guarda esse versículo no coração. Lê de novo antes de dormir.",
    versiculos: [`${v.ref} — "${v.text}"`],
    oracao: "Senhor, que essa palavra se torne real na minha vida. Amém.",
    followUp: "Quer outro versículo ou quer refletir mais sobre esse?",
  };
}

// ── Main export ──
export function generateMockResponse(
  question: string,
  emotion?: UserEmotion | null
): BibleResponse {
  const q = question.toLowerCase().trim();
  const intent = detectIntent(q);

  // 1. Theological FIRST
  const theological = matchTheological(q);
  if (theological) return theological;

  // 2. Factual
  const factual = matchFactual(q);
  if (factual) return factual;

  // 3. Emotional
  const emotional = matchEmotional(q, emotion);
  if (emotional) return emotional;

  // 4. Named topics
  const named = matchNamedTopic(q, emotion ?? null);
  if (named) return named;

  // 5. Intent-based fallbacks
  if (intent === "prayer") return buildPrayerResponse(emotion ?? null);
  if (intent === "verse") return buildVerseResponse();

  // 6. General fallback
  return {
    acolhimento: pick([
      "Vamos olhar isso juntos. 💙",
      "Boa pergunta. Deixa eu te ajudar com isso.",
      "Que bom que você trouxe isso. Vamos conversar.",
    ]),
    contexto: "A Bíblia tem direção pra isso.",
    explicacao: "Deus fala de forma clara quando buscamos com sinceridade.",
    aplicacao: "Separe um tempo com Deus hoje. Pode ser 5 minutos — Ele não precisa de muito tempo pra falar ao seu coração.",
    versiculos: [
      'Tiago 1:5 — "Se algum de vocês tem falta de sabedoria, peça-a a Deus, que a todos dá liberalmente."',
    ],
    oracao: "Senhor, me guia nessa questão. Eu confio em Ti. Amém.",
    followUp: "Quer que eu aprofunde isso com você?",
  };
}
