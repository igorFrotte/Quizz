// Tela Principal - Listagem dos Quizzes
let telaPrincipal = document.querySelector(".tela");
let url = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
let meusQuizzes = [];
let quizzExibido;

carregarTela1();

function carregarTela1(){
    telaPrincipal.innerHTML = `
    <div class="tela1">
        <div class="seuMenu">
            <div class="miniTitulo"></div>
            <div class="seuQuizz"></div>
        </div>
        <div>
            <div class="miniTitulo">Todos os Quizzes</div>
            <div class="galeriaQuizz"></div>
        </div>
    </div>
    `;
    const promessa = axios.get(url);
    promessa.then(listarQuizzes); 
}

function listarQuizzes(elemento){
    meusQuizzes = JSON.parse(localStorage.getItem("idQuizz"));
    let galeria = document.querySelector(".galeriaQuizz");
    let quizz = document.querySelector(".seuQuizz");
    listarSeusQuizzes(); 
    for(let i=0;i<elemento.data.length;i++){
        if(meusQuizzes.includes(elemento.data[i].id)){
            quizz.innerHTML += `
            <div onclick="carregarTela2(${elemento.data[i].id})">
                <img src="${elemento.data[i].image}">
                <p>${elemento.data[i].title}</p>
                <div></div>
            </div>
            `;
        }else{
            galeria.innerHTML += `
            <div onclick="carregarTela2(${elemento.data[i].id})">
                <img src="${elemento.data[i].image}">
                <p>${elemento.data[i].title}</p>
                <div></div>
            </div>
            `;
        }
    }
    if(meusQuizzes.length%3 === 1){
        quizz.innerHTML += "<div></div><div></div>";
    }
    if(meusQuizzes.length%3 === 2){
        quizz.innerHTML += "<div></div>";
    }
}

function listarSeusQuizzes(){
    let quizz = document.querySelector(".seuQuizz");
    if(meusQuizzes !== null){
        if(meusQuizzes.length === 0){
            quizz.innerHTML = `
            <div class="semQuizz">Você não criou nenhum quizz ainda :(</div>
            <div onclick="carregarTela3()" class="btCriar" >Criar Quizz</div>
            `;
        }
        else{
            document.querySelector(".miniTitulo").innerHTML = "<p>Seus Quizzes</p> <ion-icon name='add-circle' onclick='carregarTela3()'></ion-icon>";
            quizz.classList.add("galeriaQuizz");
            quizz.style.flexDirection = "row";
            quizz.style.border = "initial";
        }
    }else { 
        meusQuizzes = []; 
        quizz.innerHTML = `
            <div class="semQuizz">Você não criou nenhum quizz ainda :(</div>
            <div onclick="carregarTela3()" class="btCriar" >Criar Quizz</div>
            `;
    }
}

//Tela de Exibição de um Quizz
function carregarTela2(idQuizz){ // id do quizz a ser exibido
    const promessa = axios.get(url);
    promessa.then(function (elemento) {
        for (let i=0; i<elemento.data.length; i++) {
            if (elemento.data[i].id === idQuizz) {
                quizzExibido = elemento.data[i];
            }
        }
        renderizarQuizz();
    });
}

function renderizarQuizz() {
    telaPrincipal.innerHTML = `
    <div class="tela2">
        <div class="capa">
            <img src="${quizzExibido.image}" class="imagem-capa" />
            <div class="escurecido"></div>
            <div class="titulo">${quizzExibido.title}</div>
        </div>
        <div class="conteudo-quizz"></div>
        <div class="reiniciar-quizz">Reiniciar quizz</div>
        <div class="voltar-home">Voltar para a home</div>
    </div>
    `;
    renderizarPerguntas();
    renderizarResultado();
}
function renderizarPerguntas() {
    let divConteudo = document.querySelector('.conteudo-quizz');
    for (let i=0; i<quizzExibido.questions.length; i++) {
        divConteudo.innerHTML += `
        <div class="pergunta" id="perg${i}">
            <div class="texto-pergunta">${quizzExibido.questions[i].title}</div>
            <div class="respostas"></div>
        </div>
        `;
        document.querySelector(`#perg${i} .texto-pergunta`).style.backgroundColor = quizzExibido.questions[i].color;
        renderizarRespostas(i);
    }
}
function aleatorizar() {
    return Math.random() - 0.5;
}
function renderizarRespostas(i) {
    let divRespostas = document.querySelector(`#perg${i} .respostas`);
    quizzExibido.questions[i].answers.sort(aleatorizar);

    for (let j=0; j<quizzExibido.questions[i].answers.length; j++) {
        divRespostas.innerHTML += `
        <div class="resposta">
            <img src="${quizzExibido.questions[i].answers[j].image}" class="imagem-resposta"/>
            <div class="texto-resposta">${quizzExibido.questions[i].answers[j].text}</div>
        </div>
        `
    }
}
function respostaAposClick(elemento) {
    let divRespostas = elemento.parent();
    let todasAsRespostas = divRespostas.querySelectorAll('.resposta');

    for (let i=0; i<todasAsRespostas.length; i++) {
        todasAsRespostas[i].classList.add('nao-selecionada');
    }

    elemento.classList.remove('nao-selecionada');

}
function renderizarResultado() {
    let divConteudo = document.querySelector('.conteudo-quizz');
    divConteudo.innerHTML += `
    <div class="resultado">
        <div class="nivel">88% de acerto: Você é praticamente um aluno de Hogwarts!</div>
        <div class="descricao-nivel">
            <img src="./images/image 10.png" class="imagem-nivel" />
            <div class="texto-nivel">Parabéns Potterhead! Bem-vindx a Hogwarts, aproveite o loop infinito de comida e clique no botão abaixo para usar o vira-tempo e reiniciar este teste.</div>
        </div>
    </div>
    `
}

function carregarTela3(){
    telaPrincipal.innerHTML = ``; 
}