"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Postagem = void 0;
class Postagem {
    ;
    constructor(id, titulo, conteudo, data, curtidas, imagem, tags = []) {
        this.comentarios = [];
        this.id = id;
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.data = data;
        this.curtidas = curtidas;
        this.imagem = imagem;
        this.tags = tags;
    }
    getId() {
        return this.id;
    }
    getTitulo() {
        return this.titulo;
    }
    setTitulo(novoTitulo) {
        this.titulo = novoTitulo;
    }
    getConteudo() {
        return this.conteudo;
    }
    setConteudo(novoConteudo) {
        this.conteudo = novoConteudo;
    }
    getData() {
        return this.data;
    }
    getCurtidas() {
        return this.curtidas;
    }
    getComentarios() {
        return this.comentarios;
    }
    getImagem() {
        return this.imagem;
    }
    setImagem(novaImagem) {
        this.imagem = novaImagem;
    }
    getTags() {
        return this.tags || [];
    }
    setTags(tags) {
        this.tags = tags;
    }
    adicionarComentario(comentario) {
        this.comentarios.push(comentario);
    }
    removerComentario(idComentario) {
        this.comentarios = this.comentarios.filter(c => c.getId() !== idComentario);
    }
}
exports.Postagem = Postagem;
//# sourceMappingURL=Postagem.js.map