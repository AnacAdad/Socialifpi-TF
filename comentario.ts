export  class Comentario {
    constructor(
        private id: number,
        private postagemId: number,
        private autor: string,
        private texto: string,
        private data: Date
    ) {}

    public getId(): number {
        return this.id;
    }

    public getPostagemId(): number {
        return this.postagemId;
    }

    public getAutor(): string {
        return this.autor;
    }

    public getTexto(): string {
        return this.texto;
    }

    public getData(): Date {
        return this.data;
    }
}