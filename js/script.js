// Tela Principal - Listagem dos Quizzes
let telaPrincipal = document.querySelector(".tela");
let url = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
let meusQuizzes = [];
let quizzExibido;
let respostaClicada;

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
    let divPergunta = document.querySelector(`#perg${i}`);
    quizzExibido.questions[i].answers.sort(aleatorizar);

    for (let j=0; j<quizzExibido.questions[i].answers.length; j++) {
        divRespostas.innerHTML += `
        <div class="resposta" onclick="respostaAoClick(this,${i})">
            <img src="${quizzExibido.questions[i].answers[j].image}" class="imagem-resposta"/>
            <div class="texto-resposta">${quizzExibido.questions[i].answers[j].text}</div>
        </div>
        `
    }
}
function respostaAoClick(elemento,i) {
    let divRespostas = elemento.parentNode;
    let divPergunta = divRespostas.parentNode;
    let todasAsRespostas = divRespostas.querySelectorAll('.resposta');
    let textoResposta = divRespostas.querySelectorAll('.texto-resposta');
    let jaFoiSelecionado = divRespostas.querySelector('.selecionada');

    if (jaFoiSelecionado !== null) {
        return;
    }
    for (let i=0; i<todasAsRespostas.length; i++) {
        todasAsRespostas[i].classList.add('nao-selecionada');
    }
    elemento.classList.remove('nao-selecionada');
    elemento.classList.add('selecionada');

    let respostaCorreta = quizzExibido.questions[i].answers.filter((e) => e.isCorrectAnswer === true);

    for (let j=0; j<textoResposta.length; j++) {
        if (textoResposta[j].innerHTML === respostaCorreta[0].text) {
            textoResposta[j].classList.add('correta');
        } else {
            textoResposta[j].classList.add('errada');
        }
    }

    setTimeout(function(){
        divPergunta.nextElementSibling.scrollIntoView({block: "center", inline: "nearest"});
    },2000);
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

// tela 3 - Criar Quizz

let quizzCriado = {
    title: "",
    image: "",
    questions: [3],
    levels: [2]
}; // mudaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaar

function carregarTela3(){
    telaPrincipal.innerHTML = `
    <div class="tela3">
        <div class="criacaoTitulo">Começe pelo começo</div>
        <div class="criacaoForm">
            <input type="text" id="titulo" placeholder="Título do seu quizz">
            <div class="erro"></div>
            <input type="url" id="urlComeco" placeholder="URL da imagem do seu quizz">
            <div class="erro"></div>
            <input type="text" id="qtPergunta" placeholder="Quantidade de perguntas do quizz">
            <div class="erro"></div>
            <input type="text" id="qtNivel" placeholder="Quantidade de níveis do quizz">
            <div class="erro"></div>
        </div>
        <div class="criacaoBt" onclick='verificarComeco()'>Prosseguir pra criar perguntas</div>      
    </div>
    `; 
}

function verificarComeco(){
    let ok = 0;
    ok += verificarTexto(document.getElementById("titulo"),20,65);
    ok += verificarUrl(document.getElementById("urlComeco"));
    ok += verificarQtd(document.getElementById("qtPergunta"),3);
    ok += verificarQtd(document.getElementById("qtNivel"),2);
    if (ok === 0){
        quizzCriado.title = document.getElementById("titulo").value;
        quizzCriado.image = document.getElementById("urlComeco").value;
        quizzCriado.questions.push(document.getElementById("qtPergunta").value);
        quizzCriado.levels.push(document.getElementById("qtNivel").value);
        carregarParte2(document.getElementById("qtPergunta").value); 
    }
}

function carregarParte2(numPerguntas){
    telaPrincipal.innerHTML = `
    <div class="tela3">
        <div class="criacaoTitulo">Crie suas perguntas</div>
        <div class="perguntas"></div>
        <div class="criacaoBt" onclick='verificarParte2()'>Prosseguir pra criar níveis</div>      
    </div>
    `;
    for(let i=0;i<numPerguntas;i++){
        document.querySelector(".perguntas").innerHTML += `
        <div class="criacaoForm">
            <div onclick="abrirFechar(this,'pergSec${i+1}')" class="criacaoMiniTitulo">Pergunta ${i+1}</div>
            <input type="text" id="tituloPerg${i+1}" placeholder="Texto da pergunta">
            <div class="erro"></div>
            <input type="text" id="corPerg${i+1}" placeholder="Cor de fundo da pergunta">
            <div class="erro"></div>
            </br>
            <div class="criacaoMiniTitulo">Resposta Correta</div>
            </br>
            <input type="text" id="corretaPerg${i+1}" placeholder="Resposta correta">
            <div class="erro"></div>
            <input type="text" id="urlCorretaPerg${i+1}" placeholder="URL da imagem">
            <div class="erro"></div>
            </br>
            <div class="criacaoMiniTitulo">Respostas incorretas</div>
            <input type="text" id="errada1Perg${i+1}" placeholder="Resposta incorreta 1">
            <div class="erro"></div>
            <input type="text" id="erradaUrl1Perg${i+1}" placeholder="URL da imagem 1">
            <div class="erro"></div>
            </br>
            <input type="text" id="errada2Perg${i+1}" placeholder="Resposta incorreta 2">
            <div class="erro"></div>
            <input type="text" id="erradaUrl2Perg${i+1}" placeholder="URL da imagem 2">
            <div class="erro"></div>
            </br>
            <input type="text" id="errada3Perg${i+1}" placeholder="Resposta incorreta 3">
            <div class="erro"></div>
            <input type="text" id="erradaUrl3Perg${i+1}" placeholder="URL da imagem 3">
            <div class="erro"></div>
        </div>
        <div class="surdina criacaoForm exp">
            <div id="pergSec${i+1}" class="criacaoMiniTitulo">Pergunta ${i+1}</div>
            <img onclick="abrirFechar(this,'tituloPerg${i+1}')" src="./images/edit.png" > 
        </div>
        `; 
        if(i>0){
            abrirFechar(document.getElementById("tituloPerg" + (i+1)), "pergSec"+(i+1));
        }
    }
}

function abrirFechar(elemento, idDoPar){
    elemento.parentNode.classList.toggle("surdina");
    document.getElementById(idDoPar).parentNode.classList.toggle("surdina");
}

function verificarParte2(){
    let ok = 0;
    let nPerg = quizzCriado.questions[0];
    quizzCriado.questions = [];
    let nsResp = [];
    for(let i=0;i<nPerg;i++){
        ok += verificarTexto(document.getElementById("tituloPerg"+(i+1)),20);
        ok += verificarCor(document.getElementById("corPerg"+(i+1)));
        ok += verificarTexto(document.getElementById("corretaPerg"+(i+1)));
        ok += verificarUrl(document.getElementById("urlCorretaPerg"+(i+1)));
        ok += verificarTexto(document.getElementById("errada1Perg"+(i+1)));
        ok += verificarUrl(document.getElementById("erradaUrl1Perg"+(i+1)));

        let nResp = 1;
        if(document.getElementById("errada2Perg"+(i+1)).value !== "" || document.getElementById("erradaUrl2Perg"+(i+1)).value !== ""){
            ok += verificarTexto(document.getElementById("errada2Perg"+(i+1)));
            ok += verificarUrl(document.getElementById("erradaUrl2Perg"+(i+1)));
            nResp++;
        }
        if(document.getElementById("errada3Perg"+(i+1)).value !== "" || document.getElementById("erradaUrl3Perg"+(i+1)).value !== ""){
            ok += verificarTexto(document.getElementById("errada3Perg"+(i+1)));
            ok += verificarUrl(document.getElementById("erradaUrl3Perg"+(i+1)));
            nResp++;
        }
        nsResp.push(nResp);
    } 
    if (ok === 0){
        for(let i=0;i<nPerg;i++){
            let objPerg ={
                title: "",
                color: "",
                answers: []
            };
            let objResp ={
                text: "",
                image: "",
                isCorrectAnswer: true
            };
            objPerg.title = document.getElementById("tituloPerg"+(i+1)).value;
            objPerg.color = document.getElementById("corPerg"+(i+1)).value;
            
            objResp.text = document.getElementById("corretaPerg"+(i+1)).value;
            objResp.image = document.getElementById("urlCorretaPerg"+(i+1)).value;
            objResp.isCorrectAnswer = true;
            console.log(objResp);
            objPerg.answers.push(objResp);
            for(let h=0;h<nsResp[i];h++){
                let objResp2 ={
                    text: "",
                    image: "",
                    isCorrectAnswer: true
                };
                objResp2.text = document.getElementById("errada"+ (h+1) +"Perg"+(i+1)).value;
                objResp2.image = document.getElementById("erradaUrl"+ (h+1) +"Perg"+(i+1)).value;
                objResp2.isCorrectAnswer = false;
                objPerg.answers.push(objResp2);    
            }    
        quizzCriado.questions.push(objPerg);
        }
        carregarParte3(quizzCriado.levels[0]);
    }
}

function carregarParte3(numNiveis){
    alert("oi");
    console.log(quizzCriado);
    telaPrincipal.innerHTML = `
    
    `;
}

function verificarCor(elemento){
    if(elemento.value[0] !== '#'){
        elemento.nextElementSibling.innerHTML = "Escreva uma cor em hexadecimal iniciada por #";
        elemento.style.backgroundColor = "#FFE9E9";
        return 1;
    }else if(elemento.value.split('#')[1].length !== 6 || naoHexa(elemento.value.split('#')[1].toUpperCase())){
        elemento.nextElementSibling.innerHTML = "Escreve 6 valores em hexadecimal após o #";
        elemento.style.backgroundColor = "#FFE9E9";
        return 1;
    }else{
        elemento.nextElementSibling.innerHTML = "";
        elemento.style.backgroundColor = "#FFFFFF";
        return 0;
    }
}

function verificarTexto(elemento,min=0,max=Number.POSITIVE_INFINITY){
    if(elemento.value.length === 0 && min === 0){
        elemento.nextElementSibling.innerHTML = "Texto não pode estar vazio";
        elemento.style.backgroundColor = "#FFE9E9";
        return 1;
    }else if(elemento.value.length < min){
        elemento.nextElementSibling.innerHTML = "Deve ter no mínimo " + min + " caracteres";
        elemento.style.backgroundColor = "#FFE9E9";
        return 1;
    }else if(elemento.value.length > max){
        elemento.nextElementSibling.innerHTML = "Deve ter no máximo " + max + " caracteres";
        elemento.style.backgroundColor = "#FFE9E9";
        return 1;
    }else { 
        elemento.nextElementSibling.innerHTML = "";
        elemento.style.backgroundColor = "#FFFFFF";
        return 0;
    }
}

function verificarUrl(elemento){
    if(!urlValida(elemento.value)){
        elemento.nextElementSibling.innerHTML = "Url Inválida!";
        elemento.style.backgroundColor = "#FFE9E9";
        return 1;
    }else { 
        elemento.nextElementSibling.innerHTML = "";
        elemento.style.backgroundColor = "#FFFFFF";
        return 0;
    }
}

function verificarQtd(elemento,min=0,max=Number.POSITIVE_INFINITY){
    if(isNaN(elemento.value)){
        elemento.nextElementSibling.innerHTML = "Digite apenas números";
        elemento.style.backgroundColor = "#FFE9E9";
        return 1;
    }else if(elemento.value < min){
        elemento.nextElementSibling.innerHTML = "Número de no mínimo " + min;
        elemento.style.backgroundColor = "#FFE9E9";
        return 1;
    }else if(elemento.value > max){
        elemento.nextElementSibling.innerHTML = "Número de no máximo " + max;
        elemento.style.backgroundColor = "#FFE9E9";
        return 1;
    }else { 
        elemento.nextElementSibling.innerHTML = "";
        elemento.style.backgroundColor = "#FFFFFF";
        return 0;
    }
}

function urlValida(string) {
    try {
        let url = new URL(string);
        return true;
   } catch(err) {
        return false;
   }
 }

 function naoHexa(valor){
    for(let i=0;i<valor.length;i++){
        if(isNaN(valor[i]) && valor[i] !== "A" && valor[i] !== "B" && valor[i] !== "C" && valor[i] !== "D" && valor[i] !== "E" && valor[i] !== "F"){
            return true;
        }
    } return false;
 }

 /* carregarParte2(3); */