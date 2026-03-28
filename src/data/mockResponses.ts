export interface BibleResponse {
  contexto: string;
  explicacao: string;
  aplicacao: string;
  versiculos: string[];
  oracao: string;
}

export const helpTopics = [
  {
    id: "ansiedade",
    emoji: "😰",
    label: "Ansiedade",
    response: {
      contexto: "A ansiedade é mencionada diversas vezes na Bíblia. Deus sabe que somos frágeis e nos convida a depositar nossas preocupações nEle.",
      explicacao: "Quando sentimos ansiedade, é como se carregássemos um peso que não foi feito para nós. Deus nos chama para entregar esse peso a Ele, porque Ele cuida de nós com amor.",
      aplicacao: "Hoje, tente pausar por 5 minutos, respirar fundo e dizer: 'Senhor, eu entrego minha ansiedade nas Tuas mãos.' Escreva 3 coisas pelas quais você é grato.",
      versiculos: [
        "Filipenses 4:6-7 — Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, com ação de graças, apresentem seus pedidos a Deus.",
        "1 Pedro 5:7 — Lancem sobre ele toda a sua ansiedade, porque ele tem cuidado de vocês.",
        "Mateus 6:34 — Portanto, não se preocupem com o amanhã, pois o amanhã trará as suas próprias preocupações."
      ],
      oracao: "Senhor, eu sei que Tu cuidas de mim. Ajuda-me a confiar em Ti mesmo quando meu coração está inquieto. Troca minha ansiedade pela Tua paz. Amém."
    }
  },
  {
    id: "tristeza",
    emoji: "😢",
    label: "Tristeza",
    response: {
      contexto: "A Bíblia reconhece a tristeza como parte da experiência humana. Até Jesus chorou (João 11:35). Deus não ignora sua dor.",
      explicacao: "Estar triste não é pecado. Deus está perto dos que têm o coração quebrantado. Ele promete transformar nosso lamento em dança.",
      aplicacao: "Permita-se sentir, mas não fique sozinho(a). Converse com alguém de confiança, ore com sinceridade, e lembre-se: essa fase vai passar.",
      versiculos: [
        "Salmos 34:18 — Perto está o Senhor dos que têm o coração quebrantado e salva os de espírito abatido.",
        "Salmos 30:5 — O choro pode durar uma noite, mas a alegria vem pela manhã.",
        "Apocalipse 21:4 — Ele enxugará dos seus olhos toda lágrima."
      ],
      oracao: "Pai, Tu vês minha tristeza. Abraça-me com Teu amor e restaura minha alegria. Sei que Tu estás comigo. Amém."
    }
  },
  {
    id: "medo",
    emoji: "😨",
    label: "Medo",
    response: {
      contexto: "\"Não temas\" aparece mais de 365 vezes na Bíblia — uma para cada dia do ano. Deus conhece nossos medos e nos encoraja constantemente.",
      explicacao: "O medo é natural, mas Deus nos dá um espírito de poder, amor e equilíbrio. Quando o medo bater, lembre-se de quem está ao seu lado.",
      aplicacao: "Identifique o que está causando medo. Ore especificamente sobre isso. Memorize um versículo que traga coragem e repita ao longo do dia.",
      versiculos: [
        "2 Timóteo 1:7 — Porque Deus não nos deu espírito de covardia, mas de poder, de amor e de equilíbrio.",
        "Isaías 41:10 — Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.",
        "Salmos 23:4 — Ainda que eu ande pelo vale da sombra da morte, não temerei mal nenhum, porque tu estás comigo."
      ],
      oracao: "Senhor, substitui meu medo pela Tua coragem. Sei que Tu és maior do que qualquer coisa que eu enfrento. Amém."
    }
  },
  {
    id: "tentacao",
    emoji: "🔥",
    label: "Tentação",
    response: {
      contexto: "Jesus também foi tentado no deserto (Mateus 4). A tentação não é pecado — ceder a ela é. E Deus sempre providencia uma saída.",
      explicacao: "Ser tentado faz parte da vida. O importante é como respondemos. Jesus venceu a tentação com a Palavra de Deus, e nós podemos fazer o mesmo.",
      aplicacao: "Quando a tentação vier, afaste-se da situação, ore imediatamente e busque um amigo de confiança. Preencha sua mente com coisas boas.",
      versiculos: [
        "1 Coríntios 10:13 — Não veio sobre vós tentação, senão humana; mas fiel é Deus, que vos não deixará tentar acima do que podeis.",
        "Tiago 4:7 — Sujeitai-vos, pois, a Deus, resisti ao diabo, e ele fugirá de vós.",
        "Hebreus 4:15 — Porque não temos um sumo sacerdote que não possa compadecer-se das nossas fraquezas."
      ],
      oracao: "Deus, me dá forças para resistir. Mostra-me a saída que Tu preparaste. Quero Te honrar com minhas escolhas. Amém."
    }
  }
];

export function generateMockResponse(question: string): BibleResponse {
  const q = question.toLowerCase();
  
  if (q.includes("paulo") || q.includes("apóstolo")) {
    return {
      contexto: "Paulo, antes chamado Saulo, era um perseguidor feroz dos cristãos. Ele teve um encontro transformador com Jesus na estrada de Damasco (Atos 9).",
      explicacao: "Paulo se tornou o maior missionário do cristianismo. Ele escreveu 13 cartas que fazem parte do Novo Testamento e fundou igrejas por todo o mundo romano.",
      aplicacao: "A história de Paulo mostra que ninguém está além do alcance de Deus. Se Ele transformou um perseguidor em apóstolo, imagine o que Ele pode fazer na sua vida!",
      versiculos: [
        "Atos 9:15 — Disse-lhe o Senhor: Vai, porque este é para mim um vaso escolhido.",
        "Gálatas 2:20 — Já estou crucificado com Cristo; e vivo, não mais eu, mas Cristo vive em mim.",
        "Filipenses 4:13 — Tudo posso naquele que me fortalece."
      ],
      oracao: "Senhor, assim como transformaste Paulo, transforma-me também. Usa minha história para Tua glória. Amém."
    };
  }
  
  if (q.includes("perdão") || q.includes("perdoar")) {
    return {
      contexto: "O perdão é um dos temas centrais do Evangelho. Jesus ensinou que devemos perdoar não 7, mas 70 vezes 7 (Mateus 18:22).",
      explicacao: "Perdoar não significa concordar com o que fizeram contra você. Significa liberar o peso da mágoa e confiar a justiça a Deus. O perdão cura quem perdoa.",
      aplicacao: "Pense em alguém que você precisa perdoar. Ore por essa pessoa hoje. Perdoar é um processo — comece dando o primeiro passo.",
      versiculos: [
        "Efésios 4:32 — Sejam bondosos e compassivos uns para com os outros, perdoando-se mutuamente, assim como Deus os perdoou em Cristo.",
        "Mateus 6:14 — Porque, se perdoardes aos homens as suas ofensas, também vosso Pai celestial vos perdoará.",
        "Colossenses 3:13 — Suportem-se uns aos outros e perdoem as queixas que tiverem uns contra os outros. Perdoem como o Senhor lhes perdoou."
      ],
      oracao: "Pai, me ajuda a perdoar como Tu me perdoaste. Tira de mim toda amargura e enche meu coração de amor. Amém."
    };
  }
  
  if (q.includes("fé")) {
    return {
      contexto: "Hebreus 11:1 define fé como 'a certeza daquilo que esperamos e a prova das coisas que não vemos.' A fé é o fundamento da vida cristã.",
      explicacao: "Fé não é ausência de dúvida — é escolher confiar em Deus mesmo quando não entendemos tudo. É como dar um passo no escuro sabendo que Deus segura sua mão.",
      aplicacao: "Exercite sua fé hoje: ore sobre algo que parece impossível. Relembre momentos em que Deus foi fiel. Compartilhe um testemunho com alguém.",
      versiculos: [
        "Hebreus 11:1 — Ora, a fé é a certeza daquilo que esperamos e a prova das coisas que não vemos.",
        "Romanos 10:17 — De sorte que a fé vem pelo ouvir, e o ouvir pela palavra de Deus.",
        "Marcos 11:22-23 — Tende fé em Deus. Em verdade vos digo que qualquer que disser a este monte: Ergue-te e lança-te no mar..."
      ],
      oracao: "Senhor, aumenta minha fé. Ajuda-me a confiar em Ti acima de tudo que vejo. Amém."
    };
  }
  
  // Default response
  return {
    contexto: "A Bíblia é rica em sabedoria sobre esse assunto. Deus se importa com cada detalhe da sua vida e tem respostas para suas perguntas.",
    explicacao: "A Palavra de Deus nos guia em todas as áreas da vida. Quando buscamos com sinceridade, Ele nos responde através das Escrituras e do Espírito Santo.",
    aplicacao: "Reserve um tempo hoje para meditar na Palavra. Abra seu coração em oração e peça direção a Deus. Ele promete sabedoria a quem pedir (Tiago 1:5).",
    versiculos: [
      "Tiago 1:5 — Se algum de vocês tem falta de sabedoria, peça a Deus, que a todos dá livremente.",
      "Salmos 119:105 — Lâmpada para os meus pés é a tua palavra e luz para o meu caminho.",
      "Jeremias 33:3 — Clama a mim e responder-te-ei e anunciar-te-ei coisas grandes e firmes que não sabes."
    ],
    oracao: "Deus, ilumina meu entendimento com Tua Palavra. Guia meus passos e responde ao meu coração. Amém."
  };
}
