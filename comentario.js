"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comentario = void 0;
class Comentario {
    constructor(id, postagemId, autor, texto, data) {
        this.id = id;
        this.postagemId = postagemId;
        this.autor = autor;
        this.texto = texto;
        this.data = data;
    }
    getId() {
        return this.id;
    }
    getPostagemId() {
        return this.postagemId;
    }
    getAutor() {
        return this.autor;
    }
    getTexto() {
        return this.texto;
    }
    getData() {
        return this.data;
    }
    setTexto(novoTexto) {
        this.texto = novoTexto;
    }
}
exports.Comentario = Comentario;
//# sourceMappingURL=comentario.js.map