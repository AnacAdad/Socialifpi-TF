"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioDePostagens = void 0;
const fs = __importStar(require("fs"));
const Postagem_1 = require("./Postagem");
const comentario_1 = require("./comentario");
const CAMINHO_ARQUIVO = './postagens.json';
class RepositorioDePostagens {
    // === ALTERAÇÃO ===
    // Construtor criado para carregar os dados do json
    constructor() {
        this.postagens = [];
        this.nextId = 1;
        this.carregarDoArquivo();
    }
    // === ALTERAÇÃO ===
    // Método para salvar dados no arquivo json
    salvarNoArquivo() {
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
    carregarDoArquivo() {
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
            this.postagens = json.map((obj) => {
                const postagem = new Postagem_1.Postagem(obj.id, obj.titulo, obj.conteudo, new Date(obj.data), obj.curtidas, obj.imagem || '', // Carrega a imagem
                obj.tags || [] // Carrega as tags
                );
                if (obj.comentarios) {
                    obj.comentarios.forEach((c) => {
                        const comentario = new comentario_1.Comentario(c.id, c.postagemId, c.autor, c.texto, new Date(c.data));
                        postagem.adicionarComentario(comentario);
                    });
                }
                return postagem;
            });
            // Atualiza o próximo ID baseado no maior ID existente
            const maioresIds = this.postagens.map(p => p.getId());
            this.nextId = maioresIds.length > 0 ? Math.max(...maioresIds) + 1 : 1;
        }
        catch (error) {
            console.error('Erro ao carregar postagens do arquivo:', error);
            this.postagens = [];
        }
    }
    // Método para incluir uma nova postagem
    incluir(postagem) {
        postagem['id'] = this.nextId++;
        this.postagens.push(postagem);
        // === ALTERAÇÃO ===
        // Chama o método para salvar os dados no json
        this.salvarNoArquivo();
        return postagem;
    }
    // Método para alterar uma postagem existente
    alterar(id, titulo, conteudo) {
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
    consultar(id) {
        return this.postagens.find(postagem => postagem.getId() == id);
    }
    // Método para excluir uma postagem pelo ID
    excluir(id) {
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
    curtir(id) {
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
    listar() {
        return this.postagens.sort((a, b) => new Date(b.getData()).getTime() - new Date(a.getData()).getTime());
    }
}
exports.RepositorioDePostagens = RepositorioDePostagens;
//# sourceMappingURL=RepositorioDePostagens.js.map