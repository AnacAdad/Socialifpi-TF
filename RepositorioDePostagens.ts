import * as fs from 'fs';
import { Postagem } from './Postagem';
import { Comentario } from './comentario';

const CAMINHO_ARQUIVO = './postagens.json';

export class RepositorioDePostagens {
    private postagens: Postagem[] = [];
    private nextId: number = 1;

    // === ALTERAÇÃO ===
    // Construtor criado para carregar os dados do json
    constructor() {
        this.carregarDoArquivo();
    }

    // === ALTERAÇÃO ===
    // Método para salvar dados no arquivo json
    public salvarNoArquivo() {
        const postagensObj = this.postagens.map(p => ({
            id: p.getId(),
            titulo: p.getTitulo(),
            conteudo: p.getConteudo(),
            data: p.getData().toISOString(),
            curtidas: p.getCurtidas(),
            imagem: p.getImagem(), 
            comentarios: p.getComentarios().map(com => ({
                id: com.getId(),
                postagemId: com.getPostagemId(),
                autor: com.getAutor(),
                texto: com.getTexto(),
                data: com.getData().toISOString()
            }))
        }));
        fs.writeFileSync(CAMINHO_ARQUIVO, JSON.stringify(postagensObj, null, 2));
    }

    // === ALTERAÇÃO ===
    // Método para carregar os dados do arquivo json
    private carregarDoArquivo(): void {
        try {
            if (!fs.existsSync(CAMINHO_ARQUIVO)) {
                this.postagens = [];
                return;
            }

            const dados = fs.readFileSync(CAMINHO_ARQUIVO, 'utf-8').trim();
            if (!dados) {
                this.postagens = [];
                return;
            }

            const json = JSON.parse(dados);

            this.postagens = json.map((obj: any) => {
                const postagem = new Postagem(
                    obj.id,
                    obj.titulo,
                    obj.conteudo,
                    new Date(obj.data),
                    obj.curtidas
                );

                if (obj.comentarios) {
                    obj.comentarios.forEach((c: any) => {
                        const comentario = new Comentario(
                            c.id,
                            c.postagemId,
                            c.autor,
                            c.texto,
                            new Date(c.data)
                        );
                        postagem.adicionarComentario(comentario);
                    });
                }

                return postagem;
            });

            // Atualiza o próximo ID baseado no maior ID existente
            const maioresIds = this.postagens.map(p => p.getId());
            this.nextId = maioresIds.length > 0 ? Math.max(...maioresIds) + 1 : 1;

        } catch (error) {
            console.error('Erro ao carregar postagens do arquivo:', error);
            this.postagens = [];
        }
    }


    // Método para incluir uma nova postagem
    public incluir(postagem: Postagem): Postagem {
        postagem['id'] = this.nextId++;
        this.postagens.push(postagem);
        // === ALTERAÇÃO ===
        // Chama o método para salvar os dados no json
        this.salvarNoArquivo();
        return postagem;
    }

    // Método para alterar uma postagem existente
    public alterar(id: number, titulo: string, conteudo: string) : boolean {
        const postagem = this.consultar(id);
        if (postagem) {
            postagem.setTitulo(titulo);
            postagem.setConteudo(conteudo);
            // === ALTERAÇÃO ===
            // Chama o método para salvar os dados no json
            this.salvarNoArquivo();
            return true;
        }
        return false;
    }

    // Método para consultar uma postagem pelo ID
    public consultar(id: number): Postagem | undefined {
        return this.postagens.find(postagem => postagem.getId() == id);
    }

    // Método para excluir uma postagem pelo ID
    public excluir(id: number): boolean {
        const index = this.postagens.findIndex(postagem => postagem.getId() == id);
        if (index != -1) {
            this.postagens.splice(index, 1);
            // === ALTERAÇÃO ===
            // Para salvar a atualização da exclusão no json
            this.salvarNoArquivo();  
            return true;
        }
        return false;
    }

    // Método para curtir uma postagem pelo ID
    public curtir(id: number): number | null {
        const postagem = this.consultar(id);
        if (postagem) {
            postagem['curtidas'] = postagem.getCurtidas() + 1;
            // === ALTERAÇÃO ===
            // Chama o método para salvar os dados no json
            this.salvarNoArquivo();
            return postagem.getCurtidas();
        }
        return null;
    }
    // === ALTERAÇÃO ===
    /* ====== RETIRANDO POSTAGENS ESTÁTICAS PARA SER POSSÍVEL ADICIONAR DINAMICAMENTE =======
    // Método para gerar uma data aleatória dentro de um intervalo de anos
    private gerarDataAleatoria(anosPassados: number = 5): Date {
        const hoje = new Date();
        const anoInicial = hoje.getFullYear() - anosPassados;
        const anoAleatorio = Math.floor(Math.random() * (hoje.getFullYear() - anoInicial)) + anoInicial;
        const mesAleatorio = Math.floor(Math.random() * 12);
        const diaAleatorio = Math.floor(Math.random() * 28) + 1; // Considerando 28 dias para evitar problemas com fevereiro
        return new Date(anoAleatorio, mesAleatorio, diaAleatorio);
    }

   
    // Método para povoar o array com instâncias de Postagem com datas aleatórias e conteúdos mais longos
    public povoar(): void {
        this.incluir(new Postagem(
            1,
            'A Importância da Educação',
            'A educação é a base para uma sociedade mais justa e equitativa. ' +
            'Ela promove o desenvolvimento individual e coletivo, ' +
            'permitindo que pessoas realizem seu potencial. ' +
            'Investir em educação é investir no futuro de todos nós.',
            this.gerarDataAleatoria(),
            10
        ));
        this.incluir(new Postagem(
            2,
            'Tecnologia e Inovação',
            'Vivemos em uma era onde a tecnologia avança a passos largos. ' +
            'Inovações constantes estão mudando a forma como vivemos, trabalhamos e nos comunicamos. ' +
            'É essencial acompanhar essas mudanças para não ficarmos para trás. ' +
            'A tecnologia tem o poder de transformar o mundo em que vivemos.',
            this.gerarDataAleatoria(),
            15
        ));
        this.incluir(new Postagem(
            3,
            'Sustentabilidade Ambiental',
            'Preservar o meio ambiente é crucial para o futuro das próximas gerações. ' +
            'Cada ação nossa tem um impacto, e precisamos ser conscientes das nossas escolhas. ' +
            'A sustentabilidade não é uma opção, mas uma necessidade urgente. ' +
            'Devemos agir agora para garantir um planeta habitável no futuro.',
            this.gerarDataAleatoria(),
            20
        ));
        this.incluir(new Postagem(
            4,
            'Saúde e Bem-Estar',
            'Manter o bem-estar físico e mental é essencial para uma vida equilibrada. ' +
            'O cuidado com a saúde deve ser uma prioridade diária. ' +
            'Pequenos hábitos saudáveis podem fazer uma grande diferença a longo prazo. ' +
            'Não negligencie seu bem-estar, ele é a chave para uma vida plena.',
            this.gerarDataAleatoria(),
            8
        ));
        this.incluir(new Postagem(
            5,
            'Economia Digital',
            'A transformação digital está mudando a maneira como fazemos negócios. ' +
            'Empresas que não se adaptam a essa nova realidade correm o risco de ficar obsoletas. ' +
            'A digitalização não é apenas uma tendência, mas uma necessidade para a sobrevivência no mercado. ' +
            'O futuro é digital, e devemos nos preparar para ele.',
            this.gerarDataAleatoria(),
            12
        ));
        this.incluir(new Postagem(
            6,
            'Impacto das Redes Sociais',
            'As redes sociais têm um papel central na comunicação moderna. ' +
            'Elas conectam pessoas em todo o mundo, criando novas formas de interação. ' +
            'No entanto, também trazem desafios, como a disseminação de informações falsas. ' +
            'É crucial usar essas ferramentas de forma responsável e consciente.',
            this.gerarDataAleatoria(),
            7
        ));
        this.incluir(new Postagem(
            7,
            'Mobilidade Urbana',
            'Soluções de mobilidade inteligente são o futuro das grandes cidades. ' +
            'O crescimento populacional exige novas abordagens para o transporte urbano. ' +
            'A integração de tecnologia no transporte pode melhorar a qualidade de vida nas cidades. ' +
            'Investir em mobilidade sustentável é essencial para um futuro melhor.',
            this.gerarDataAleatoria(),
            9
        ));
        this.incluir(new Postagem(
            8,
            'Educação Financeira',
            'Gerir as finanças pessoais é fundamental para a estabilidade econômica. ' +
            'A educação financeira deve começar desde cedo, para evitar problemas no futuro. ' +
            'Entender como o dinheiro funciona é o primeiro passo para uma vida financeira saudável. ' +
            'Planejamento e controle são as chaves para o sucesso financeiro.',
            this.gerarDataAleatoria(),
            5
        ));
        this.incluir(new Postagem(
            9,
            'Alimentação Saudável',
            'Uma dieta equilibrada é essencial para manter corpo e mente saudáveis. ' +
            'Os alimentos que consumimos impactam diretamente nossa saúde e bem-estar. ' +
            'Fazer escolhas alimentares conscientes pode prevenir doenças e melhorar a qualidade de vida. ' +
            'Invista em uma alimentação rica em nutrientes e pobre em alimentos processados.',
            this.gerarDataAleatoria(),
            11
        )); 
        this.incluir(new Postagem(
            10,
            'Inovações na Saúde',
            'A tecnologia está revolucionando o setor de saúde com novos tratamentos. ' +
            'Inovações como a telemedicina estão tornando o atendimento mais acessível. ' +
            'A pesquisa e o desenvolvimento em saúde estão em um ritmo acelerado, trazendo esperança para muitas doenças. ' +
            'O futuro da saúde está cada vez mais integrado com a tecnologia.',
            this.gerarDataAleatoria(),
            13
        ));
    }
    */

    // Método para listar todas as postagens
    public listar(): Postagem[] {
        return this.postagens.sort((a, b) => new Date(b.getData()).getTime() - new Date(a.getData()).getTime());
    }
}



