
function getById(id: string) {
    return document.getElementById(id);
}

const apiUrl = 'http://localhost:3000/socialifpi/postagem';  // Atualize a URL conforme necessário

// === ALTERAÇÃO ===
interface Comentario {
  id: number;
  postagemId: number;
  autor: string;
  texto: string;
  data: string; 
}

interface Postagem {
    id: number;
    titulo: string;
    conteudo: string;
    data: string;
    curtidas: number;
    comentarios: Comentario[];
}

async function listarPostagens() {
    const response = await fetch(apiUrl);
    const postagens: Postagem[] = await response.json();

    const postagensElement = getById('postagens');
    if (postagensElement) {
        postagensElement.innerHTML = '';  // Limpa as postagens anteriores

        postagens.forEach(postagem => {
            const article = document.createElement('article');

            const titulo = document.createElement('h2');
            titulo.textContent = postagem.titulo;

            const conteudo = document.createElement('p');
            conteudo.textContent = postagem.conteudo;

            const data = document.createElement('p');
            data.className = 'data';
            data.textContent = new Date(postagem.data).toLocaleDateString();

            const curtidas = document.createElement('p');
            curtidas.textContent = `Curtidas: ${postagem.curtidas}`;
            curtidas.style.fontWeight = 'bold';

            // Botões principais
            const botoesDiv = document.createElement('div');
            botoesDiv.className = 'botoes-postagem';

            const botaoCurtir = document.createElement('button');
            botaoCurtir.textContent = 'Curtir';
            botaoCurtir.addEventListener('click', () => curtirPostagem(postagem.id, curtidas));

            const botaoExcluir = document.createElement('button');
            botaoExcluir.textContent = 'Excluir';
            botaoExcluir.addEventListener('click', () => excluirPostagem(postagem.id));

            const botaoComentar = document.createElement('button');
            botaoComentar.textContent = 'Comentar';

            botoesDiv.appendChild(botaoCurtir);
            botoesDiv.appendChild(botaoExcluir);
            botoesDiv.appendChild(botaoComentar);

            // Seção de comentários
            const comentariosSection = document.createElement('section');
            comentariosSection.className = 'secao-comentarios';

            const tituloComentarios = document.createElement('h3');
            const qtdComentarios = postagem.comentarios ? postagem.comentarios.length : 0;
            tituloComentarios.textContent = `Comentários (${qtdComentarios})`;
            comentariosSection.appendChild(tituloComentarios);

            const listaComentarios = document.createElement('div');
            listaComentarios.className = 'lista-comentarios';

            (postagem.comentarios || []).forEach(comentario => {
                const comentarioDiv = document.createElement('div');
                comentarioDiv.className = 'comentario-item';

                // Conteúdo do comentário
                const textoDiv = document.createElement('div');
                textoDiv.className = 'comentario-texto';

                const autor = document.createElement('strong');
                autor.textContent = comentario.autor;

                const texto = document.createElement('p');
                texto.textContent = comentario.texto;

                textoDiv.appendChild(autor);
                textoDiv.appendChild(texto);

                // Botões Excluir e Alterar para comentário
                const botoesComentario = document.createElement('div');
                botoesComentario.className = 'botoes-comentario';

                const botaoExcluirComentario = document.createElement('button');
                botaoExcluirComentario.textContent = 'Excluir';
                botaoExcluirComentario.addEventListener('click', () => excluirComentario(postagem.id, comentario.id));

                const botaoAlterarComentario = document.createElement('button');
                botaoAlterarComentario.textContent = 'Alterar';
                botaoAlterarComentario.addEventListener('click', () => mostrarFormularioAlterarComentario(postagem.id, comentario));

                botoesComentario.appendChild(botaoExcluirComentario);
                botoesComentario.appendChild(botaoAlterarComentario);

                comentarioDiv.appendChild(textoDiv);
                comentarioDiv.appendChild(botoesComentario);

                listaComentarios.appendChild(comentarioDiv);
            });

            comentariosSection.appendChild(listaComentarios);

            // Formulário para novo comentário (escondido inicialmente)
            const formComentario = document.createElement('div');
            formComentario.className = 'form-comentario escondido';

            const inputAutor = document.createElement('input');
            inputAutor.type = 'text';
            inputAutor.placeholder = 'Seu nome';
            inputAutor.required = true;
            inputAutor.className = 'campo-comentario';

            const inputTexto = document.createElement('textarea');
            inputTexto.placeholder = 'Comentário';
            inputTexto.required = true;
            inputTexto.className = 'campo-comentario';

            const botaoEnviarComentario = document.createElement('button');
            botaoEnviarComentario.textContent = 'Enviar';
            botaoEnviarComentario.className = 'botao-comentar';

            botaoEnviarComentario.onclick = async () => {
                if (!inputAutor.value.trim() || !inputTexto.value.trim()) {
                    alert('Por favor, preencha nome e comentário.');
                    return;
                }
                await enviarComentario(postagem.id, inputAutor.value, inputTexto.value);
                inputAutor.value = '';
                inputTexto.value = '';
                formComentario.classList.add('escondido');
                listarPostagens(); // Atualiza a lista para mostrar novo comentário
            };

            formComentario.appendChild(inputAutor);
            formComentario.appendChild(inputTexto);
            formComentario.appendChild(botaoEnviarComentario);

            comentariosSection.appendChild(formComentario);

            // Botão comentar mostra/esconde o formulário
            botaoComentar.addEventListener('click', () => {
                formComentario.classList.toggle('escondido');
                if (!formComentario.classList.contains('escondido')) {
                    inputAutor.focus();
                }
            });

            article.appendChild(titulo);
            article.appendChild(conteudo);
            article.appendChild(data);
            article.appendChild(curtidas);
            article.appendChild(botoesDiv);
            article.appendChild(comentariosSection);

            postagensElement.appendChild(article);
        });
    }
}

// === ALTERAÇÃO ===
async function excluirComentario(postagemId: number, comentarioId: number) {
  const confirmar = confirm("Tem certeza que deseja excluir este comentário?");
  if (!confirmar) return;

  const response = await fetch(`${apiUrl}/${postagemId}/comentarios/${comentarioId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    listarPostagens();
  } else {
    alert('Erro ao excluir comentário');
  }
}


// === ALTERAÇÃO ===
async function mostrarFormularioAlterarComentario(postagemId: number, comentario: any) {
    // Cria um prompt simples para editar o texto
    const novoTexto = prompt('Editar comentário:', comentario.texto);
    if (novoTexto === null) return; // Usuário cancelou

    if (!novoTexto.trim()) {
        alert('O comentário não pode ficar vazio.');
        return;
    }

    // Envia a alteração para backend - supondo que exista essa rota:
    // PUT /postagens/:postagemId/comentarios/:comentarioId
    const response = await fetch(`${apiUrl}/${postagemId}/comentarios/${comentario.id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        texto: novoTexto,
        }),
    });

    if (response.ok) {
        listarPostagens(); // Atualiza lista após alteração
    } else {
        alert('Erro ao alterar comentário');
    }
}


// Função para curtir uma postagem
async function curtirPostagem(id: number, curtidasElement: HTMLParagraphElement) {
    const response = await fetch(`${apiUrl}/${id}/curtir`, {
        method: 'POST'
    });
    const result = await response.json();
    curtidasElement.textContent = `Curtidas: ${result.curtidas}`;
}

// Função para incluir uma nova postagem
async function incluirPostagem() {
    const tituloInput = <HTMLInputElement>getById('titulo');
    const conteudoInput = <HTMLInputElement>getById('conteudo');

    if (tituloInput && conteudoInput) {
        const novaPostagem = {
            titulo: tituloInput.value,
            conteudo: conteudoInput.value,
            data: new Date().toISOString(),
            curtidas: 0
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaPostagem)
        });

        const postagemIncluida = await response.json();
        listarPostagens();  // Atualiza a lista de postagens
       
        // Limpa os campos do formulário
        tituloInput.value = '';
        conteudoInput.value = '';

    }
}

// === ALTERAÇÃO ===
async function enviarComentario(postagemId: number, autor: string, texto: string) {
    if (!autor || !texto) {
        alert('Por favor, preencha nome e comentário.');
        return;
    }

    const response = await fetch(`${apiUrl}/${postagemId}/comentario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autor, texto }),
    });

    if (!response.ok) {
        alert('Erro ao enviar comentário.');
        return;
    }
}

// === ALTERAÇÃO ===
// Função adicionada para excluir postagem atualizando a lista 
async function excluirPostagem(id: number) {
    if (!confirm('Tem certeza que deseja excluir esta postagem?')) {
        return; // cancela se usuário não confirmar
    }

    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
            await listarPostagens(); // Aguarda recarregamento da lista
    } else {
        console.error('Erro ao excluir a postagem:', await response.text());
    }
}


// Inicializa a aplicação
listarPostagens();

const botaoNovaPostagem = getById("botaoNovaPostagem");
if (botaoNovaPostagem) {
    botaoNovaPostagem.addEventListener('click', incluirPostagem);
}

