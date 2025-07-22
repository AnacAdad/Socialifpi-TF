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
            imagem: p.getImagem() || '', 
            tags: p.getTags() || [],
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
                    obj.curtidas,
                    obj.imagem || '',        // Carrega a imagem
                    obj.tags || []           // Carrega as tags
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
    /* ====== RETIRANDO POSTAGENS ESTÁTICAS PARA SER POSSÍVEL ADICIONAR DINAMICAMENTE =======*/


    // Método para listar todas as postagens
    public listar(): Postagem[] {
        return this.postagens.sort((a, b) => new Date(b.getData()).getTime() - new Date(a.getData()).getTime());
    }
}



