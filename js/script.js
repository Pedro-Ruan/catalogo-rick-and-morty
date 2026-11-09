let paginaAtual = 1;
let totalPaginas = 1;
let nomeBusca = '';
let carregando = false;

const campoBusca = document.getElementById("campo-busca");
const btnBuscar = document.getElementById("btn-buscar");

const btnProxima = document.getElementById('btn-proxima');
const btnAnterior = document.getElementById('btn-anterior');

btnProxima.addEventListener('click', () => {

    if (carregando) {
        return;
    }

    if (paginaAtual < totalPaginas) {
        carregarPersonagens(paginaAtual + 1);
    }

});

btnAnterior.addEventListener('click', () => {

    if (carregando) {
        return;
    }

    if (paginaAtual > 1) {
        carregarPersonagens(paginaAtual - 1);
    }

});



btnBuscar.addEventListener('click', () => {

    if (carregando) {
        return;
    }

    nomeBusca = campoBusca.value.trim();
    carregarPersonagens(1);
})

function carregarPersonagens(paginaSolicitada = paginaAtual) {

    carregando = true;
    atualizarBotoes();

    const url = nomeBusca
        ? `https://rickandmortyapi.com/api/character?page=${paginaSolicitada}&name=${encodeURIComponent(nomeBusca)}`
        : `https://rickandmortyapi.com/api/character?page=${paginaSolicitada}`;

    const carregamentoCatalogo = document.getElementById('lista-personagens');

    carregamentoCatalogo.innerHTML = '<p>Carregando personagens...</p>';

    fetch(url)
        .then(response => {

            if (response.status === 404) {
                throw new Error("NOT_FOUND");
            }

            if (!response.ok) {
                throw new Error("SERVER_ERROR");
            }

            return response.json();
        })
        .then(data => {

            const listaPersonagens = document.getElementById('lista-personagens');

            listaPersonagens.innerHTML = '';

            totalPaginas = data.info.pages;

            const paginaTexto = document.getElementById('pagina-atual');

            paginaAtual = paginaSolicitada;

            atualizarBotoes();

            paginaTexto.innerText = `Página ${paginaAtual} de ${totalPaginas}`;

            data.results.forEach(personagem => {
                const card = document.createElement('article');
                const nome = document.createElement('h3');
                const img = document.createElement('img');

                img.loading = 'lazy';
                img.decoding = 'async';

                const status = document.createElement('p');
                const especie = document.createElement('p');
                const origem = document.createElement('p');
                const informacoes = document.createElement('div');
                const areaImagem = document.createElement('div');


                img.alt = `Imagem de ${personagem.name}`;

                areaImagem.classList.add('area-imagem');
                areaImagem.appendChild(img);

                card.classList.add('card-personagem');
                informacoes.classList.add('informacoes-personagem');

                img.onerror = () => {

                    const mensagemImagem = document.createElement('div');
                    const icone = document.createElement('span');
                    const texto = document.createElement('p');

                    mensagemImagem.classList.add('imagem-indisponivel');

                    icone.innerText = '🛸';
                    texto.innerText = 'Imagem indisponível';

                    mensagemImagem.appendChild(icone);
                    mensagemImagem.appendChild(texto);

                    areaImagem.replaceChildren(mensagemImagem);

                };

                img.src = personagem.image;

                informacoes.appendChild(nome);
                informacoes.appendChild(status);
                informacoes.appendChild(especie);
                informacoes.appendChild(origem);
                card.appendChild(areaImagem);
                card.appendChild(informacoes)


                nome.innerText = personagem.name;
                status.innerText = `Status: ${personagem.status}`;
                especie.innerText = `Espécie: ${personagem.species}`;
                origem.innerText = `Origem: ${personagem.origin.name}`;



                listaPersonagens.appendChild(card);


            });
        })
        .catch(error => {
            console.error('Erro ao consultar a API:', error);

            const listaPersonagens = document.getElementById('lista-personagens');
            const paginaTexto = document.getElementById('pagina-atual');

            if (error.message === 'NOT_FOUND') {

                listaPersonagens.innerHTML = '<p>Nenhum personagem encontrado. Tente outro nome.</p>';
                paginaTexto.innerText = 'Nenhum resultado';

            } else {

                listaPersonagens.innerHTML = '<p>Não foi possível carregar os personagens. Tente novamente.</p>';
                paginaTexto.innerText = `Página ${paginaAtual}`;

            }
        })
        .finally(() => {
            carregando = false;
            atualizarBotoes();
        });

}

carregarPersonagens(1);

function atualizarBotoes() {

    btnAnterior.disabled = carregando || paginaAtual === 1;

    btnProxima.disabled = carregando || paginaAtual === totalPaginas;

}