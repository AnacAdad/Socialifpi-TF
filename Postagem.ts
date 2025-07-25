import { Comentario } from "./comentario";

export class Postagem {
    private id: number;
    private titulo: string;
    private conteudo: string;
    private data: Date;
    private curtidas: number;
    private comentarios: Comentario[] = [];
    // ===== ALTERAÇÃO =====
    // Para adicionar uma imagem no post
    private imagem?: string;
    private tags?: string[];
;

    constructor(id: number, titulo: string, conteudo: string, data: Date, curtidas: number, imagem?: string, tags: string[] = []) {
        this.id = id;
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.data = data;
        this.curtidas = curtidas;
        this.imagem = imagem;
        this.tags = tags;
    }

    public getId(): number {
        return this.id;
    }

    public getTitulo(): string {
        return this.titulo;
    }

    public setTitulo(novoTitulo: string): void {
        this.titulo = novoTitulo;
    }

    public getConteudo(): string {
        return this.conteudo;
    }

    public setConteudo(novoConteudo: string): void {
        this.conteudo = novoConteudo;
    }

    public getData(): Date {
        return this.data;
    }

    public getCurtidas(): number {
        return this.curtidas;
    }
    public getComentarios(): Comentario[] {
        return this.comentarios;
    }

    public getImagem(): string | undefined {
        return this.imagem;
    }

    public setImagem(novaImagem: string | undefined): void {
        this.imagem = novaImagem;
    }

    public getTags(): string[] {
        return this.tags || [];
    }

    public setTags(tags: string[]): void {
        this.tags = tags;
    }


    public adicionarComentario(comentario: Comentario): void {
        this.comentarios.push(comentario);
    }

    public removerComentario(idComentario: number): void {
        this.comentarios = this.comentarios.filter(c => c.getId() !== idComentario);
    }
}