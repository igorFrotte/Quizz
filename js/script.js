//1.Tela Principal - Listagem dos Quizzes
let telaPrincipal = document.querySelector(".tela");
let url = "https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes";
let meusQuizzes = [];

function recarregar() {
    window.location.reload();
}

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

//2.Tela de Exibição de um Quizz
let quizzExibido;
let respostaClicada;
let contAcertos = 0;

    //Buscar o elemento pai do ID (o objeto do Quizz a ser exibido)
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
    
function renderizarQuizz() { //Inserir o HTML do quizz
    telaPrincipal.innerHTML = `
    <div class="tela2">
        <div class="capa">
            <img src="${quizzExibido.image}" class="imagem-capa" />
            <div class="escurecido"></div>
            <div class="titulo">${quizzExibido.title}</div>
        </div>
        <div class="conteudo-quizz"></div>
        <div class="reiniciar-quizz" onclick="reiniciar()">Reiniciar quizz</div>
        <div class="voltar-home" onclick="carregarTela1()">Voltar para a home</div>
    </div>
    `;
    renderizarPerguntas();
    document.querySelector('.capa').scrollIntoView({block: "center", inline: "nearest"});
}

function renderizarPerguntas() { //Renderizar as perguntas de acordo com o tamanho do array de quizzExibido.questions
    let divConteudo = document.querySelector('.conteudo-quizz');
    for (let i=0; i<quizzExibido.questions.length; i++) {
        divConteudo.innerHTML += `
        <div class="pergunta" id="perg${i}">
            <div class="texto-pergunta">
                <p>${quizzExibido.questions[i].title}</p>
            </div>
            <div class="respostas"></div>
        </div>
        `;
        document.querySelector(`#perg${i} .texto-pergunta`).style.backgroundColor = quizzExibido.questions[i].color;
        renderizarRespostas(i);
    }
}

function aleatorizar() { //Embaralhar o array de respostas de cada pergunta
    return Math.random() - 0.5;
}

function renderizarRespostas(i) { //Renderizar as respostas de acordo com o tamanho do array de quizzExibido.questions[i].answers, sendo 'i' o índice da pergunta
    let divRespostas = document.querySelector(`#perg${i} .respostas`);
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
    
function respostaAoClick(elemento,i) { //Efeito selecionado e troca de cor, de acordo com resposta
    let divRespostas = elemento.parentNode;
    let divPergunta = divRespostas.parentNode;
    let todasAsRespostas = divRespostas.querySelectorAll('.resposta');
    let textoResposta = divRespostas.querySelectorAll('.texto-resposta');

    //Caso já exista uma resposta com a classe 'selecionada', o script para a execução
    let jaFoiSelecionado = divRespostas.querySelector('.selecionada');
    if (jaFoiSelecionado !== null) {
        return;
    }
    //Caso não exista, a classe 'nao-selecionada' será adicionada a todas as respostas e retirada do elemento clicado, 
    //que também recebe a classe 'selecionada'
    for (let i=0; i<todasAsRespostas.length; i++) {
        todasAsRespostas[i].classList.add('nao-selecionada');
    }
    elemento.classList.remove('nao-selecionada');
    elemento.classList.add('selecionada');

    let respostaCorreta = quizzExibido.questions[i].answers.filter((e) => e.isCorrectAnswer === true); //É realizado um filtro apenas do elemento do array de respostas que possui a propriedade 'isCorrectAnswer' como true

    for (let j=0; j<textoResposta.length; j++) { //São verificadas todas as respostas e, caso o seu texto seja igual à resposta correta, adiciona-se a classe 'correta'
        if (textoResposta[j].innerHTML === respostaCorreta[0].text) {
            textoResposta[j].classList.add('correta');
        } else { //Caso contrário, adiciona-se a classe 'errada'
            textoResposta[j].classList.add('errada');
        }
    }

    if (respostaCorreta[0].text === elemento.querySelector('.texto-resposta').innerHTML) { //Se o texto da resposta selecionada for igual à resposta correta, soma-se um acerto
        contAcertos += 1;
    }

    if (document.querySelectorAll('.selecionada').length === quizzExibido.questions.length) { //Se o número de respostas selecionadas for igual ao número de perguntas, renderizar o resultado
        renderizarResultado();
    }

    setTimeout(function(){ //Após dois segundos do clique na resposta, faça aparecer o próximo elemento
        if (divPergunta.nextElementSibling === null) {
            document.querySelector('.resultado').scrollIntoView({block: "start", inline: "nearest"});
        } else {
            divPergunta.nextElementSibling.scrollIntoView({block: "center", inline: "nearest"});
        }
    },2000);
}

function renderizarResultado() { //Inserir o HTML do resultado do quizz
    const porcentAcerto = Math.round((contAcertos/Number(quizzExibido.questions.length))*100); //A porcentagem de acerto é o arredondamento da divisão da quantidade de acertos pela quantidade de questões (x100)

    //Se a porcentagem de acerto for maior do que o valor mínimo do nível e menor do que o valor mínimo do nível seguinte,
    //deve-se adicionar o título, imagem e descrição daquele nível.
    //Caso seja o último nível, deve-se verificar apenas se a porcentagem de acerto é maior do que o valor mínimo do nível
    let tituloNivel = "";
    let imagemNivel = "";
    let descricaoNivel = "";
    
    const niveis = quizzExibido.levels;
    niveis.sort((a,b) => a.minValue - b.minValue);
    console.log(niveis);
    for (let i=0; i<niveis.length; i++) {
        if (porcentAcerto >= niveis[i].minValue && niveis[i+1] === undefined) {
            tituloNivel = niveis[i].title;
            imagemNivel = niveis[i].image;
            descricaoNivel = niveis[i].text;
        } else if (porcentAcerto >= niveis[i].minValue && porcentAcerto < niveis[i+1].minValue) {
            tituloNivel = niveis[i].title;
            imagemNivel = niveis[i].image;
            descricaoNivel = niveis[i].text;
        }
    }

    //Renderizar o resultado na div com classe 'conteudo-quizz'
    let divConteudo = document.querySelector('.conteudo-quizz');
    divConteudo.innerHTML += `
    <div class="resultado">
        <div class="nivel">
            <p>${porcentAcerto}% de acerto: ${tituloNivel}</p>
        </div>
        <div class="descricao-nivel">
            <img src="${imagemNivel}" class="imagem-nivel" />
            <div class="texto-nivel">${descricaoNivel}</div>
        </div>
    </div>
    `
}

function reiniciar() { //Reiniciar quizz
    document.querySelector('.capa').scrollIntoView({block: "center", inline: "nearest"});
    contAcertos = 0;

    let indice=0;
    while (document.querySelectorAll('.selecionada').length !== 0) {
        document.querySelectorAll('.selecionada')[indice].classList.remove('selecionada');
    }
    while (document.querySelectorAll('.nao-selecionada').length !== 0) {
        document.querySelectorAll('.nao-selecionada')[indice].classList.remove('nao-selecionada');
    }
    while (document.querySelectorAll('.correta').length !== 0) {
        document.querySelectorAll('.correta')[indice].classList.remove('correta');
    }
    while (document.querySelectorAll('.errada').length !== 0) {
        document.querySelectorAll('.errada')[indice].classList.remove('errada');
    }

    document.querySelector('.resultado').parentNode.removeChild(document.querySelector('.resultado'));
}


//3.Tela de Criação de um Quizz
let quizzCriado = {
    title: "",
    image: "",
    questions: [],
    levels: []
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
            <input type="url" id="urlCorretaPerg${i+1}" placeholder="URL da imagem">
            <div class="erro"></div>
            </br>
            <div class="criacaoMiniTitulo">Respostas incorretas</div>
            <input type="text" id="errada1Perg${i+1}" placeholder="Resposta incorreta 1">
            <div class="erro"></div>
            <input type="url" id="erradaUrl1Perg${i+1}" placeholder="URL da imagem 1">
            <div class="erro"></div>
            </br>
            <input type="text" id="errada2Perg${i+1}" placeholder="Resposta incorreta 2">
            <div class="erro"></div>
            <input type="url" id="erradaUrl2Perg${i+1}" placeholder="URL da imagem 2">
            <div class="erro"></div>
            </br>
            <input type="text" id="errada3Perg${i+1}" placeholder="Resposta incorreta 3">
            <div class="erro"></div>
            <input type="url" id="erradaUrl3Perg${i+1}" placeholder="URL da imagem 3">
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

function verificarParte2(){
    let ok = 0;
    let nPerg = quizzCriado.questions[0];
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
        quizzCriado.questions = [];
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
            objPerg.answers.push(objResp);
            for(let h=0;h<nsResp[i];h++){
                let objResp2 ={
                    text: "",
                    image: "",
                    isCorrectAnswer: false
                };
                objResp2.text = document.getElementById("errada"+ (h+1) +"Perg"+(i+1)).value;
                objResp2.image = document.getElementById("erradaUrl"+ (h+1) +"Perg"+(i+1)).value;
                objPerg.answers.push(objResp2);    
            }    
            quizzCriado.questions.push(objPerg);
        }
        carregarParte3(quizzCriado.levels[0]);
    }
}

function carregarParte3(numNiveis){
    telaPrincipal.innerHTML = `
    <div class="tela3">
        <div class="criacaoTitulo">Agora, decida os níveis</div>
        <div class="niveis"></div>
        <div class="criacaoBt" onclick='verificarParte3()'>Finalizar Quizz</div>      
    </div>
    `;
    for(let i=0;i<numNiveis;i++){
        document.querySelector(".niveis").innerHTML += `
        <div class="criacaoForm">
            <div onclick="abrirFechar(this,'nivelSec${i+1}')" class="criacaoMiniTitulo">Nível ${i+1}</div>
            <input type="text" id="tituloNivel${i+1}" placeholder="Título do nível">
            <div class="erro"></div>
            <input type="text" class="cadaNivel" id="porcNivel${i+1}" placeholder="% de acerto mínima">
            <div class="erro"></div>
            <input type="url" id="urlNivel${i+1}" placeholder="URL da imagem do nível">
            <div class="erro"></div>
            <input type="text" id="descNivel${i+1}" placeholder="Descrição do nível">
            <div class="erro"></div>
        </div>
        <div class="surdina criacaoForm exp">
            <div id="nivelSec${i+1}" class="criacaoMiniTitulo">Nível ${i+1}</div>
            <img onclick="abrirFechar(this,'tituloNivel${i+1}')" src="./images/edit.png" > 
        </div>
        `; 
        if(i>0){
            abrirFechar(document.getElementById("tituloNivel" + (i+1)), "nivelSec"+(i+1));
        }
    }
}

function verificarParte3(){
    let ok = 0;
    let nNiveis =2;//quizzCriado.levels[0];
    let semPorc0 = 0;
    for(let i=0;i<nNiveis;i++){
        ok += verificarTexto(document.getElementById("tituloNivel"+(i+1)),10);
        ok += verificarQtd(document.getElementById("porcNivel"+(i+1)),0,100);
        ok += verificarUrl(document.getElementById("urlNivel"+(i+1)));
        ok += verificarTexto(document.getElementById("descNivel"+(i+1)),30);      
        if(document.getElementById("porcNivel"+(i+1)).value == 0){
            semPorc0 += 1;
        }
    }
    if(semPorc0 === 0){
        ok += erroNoNivel(-1);
    }
    ok += niveisIguais(); //verifica niveis iguais
    if (ok === 0){
        quizzCriado.levels = [];
        alert("oi");

        for(let i=0;i<nNiveis;i++){
            let objNivel ={
                title: "",
				image: "",
				text: "",
				minValue: 0
            };
            objNivel.title = document.getElementById("tituloNivel"+(i+1)).value;
            objNivel.minValue = Number(document.getElementById("porcNivel"+(i+1)).value);
            objNivel.image = document.getElementById("urlNivel"+(i+1)).value;
            objNivel.text = document.getElementById("descNivel"+(i+1)).value;  
            quizzCriado.levels.push(objNivel);
        }
        finalizarCriacao();
    }
}

function finalizarCriacao(){
    const requisicao = axios.post(url, quizzCriado);
    requisicao.then(criadoComSucesso);
    requisicao.catch(erroNaCriacao);
}

function criadoComSucesso(id){
    alert("sucesso!!");
    console.log(id);
    let meus = JSON.parse(localStorage.getItem("idQuizz"));
    let meusId = meus.push(id);
    localStorage.setItem("idQuizz", JSON.stringify([meusId]));
    carregarTela3ponto4(id);
}

function erroNaCriacao(erro){
    alert("deu ruim :/");
}

function abrirFechar(elemento, idDoPar){
    elemento.parentNode.classList.toggle("surdina");
    document.getElementById(idDoPar).parentNode.classList.toggle("surdina");
}

function erroNoNivel(n){
    let niveis = document.querySelectorAll(".cadaNivel");
    for(let i=0;i<niveis.length;i++){
        verificacaoExtra(niveis[i],n);
    }
    return 1;
}
function niveisIguais(){
    let niDOM = document.querySelectorAll(".cadaNivel");
    let niveis = [];
    for(let i=0;i<niDOM.length;i++){
        niveis.push(niDOM[i].value);
    }
    for(let i=0;i<niveis.length;i++){
        let filtro = niveis.filter((e) => e === niveis[i]);
        if(filtro.length > 1){
            erroNoNivel(-2);
            return 1;
        }
    }return 0;
}

function verificacaoExtra(elemento,num){
    if(num === -1){
        elemento.nextElementSibling.innerHTML = "Deve ter pelo menos um nível com mínimo de 0%";
        elemento.style.backgroundColor = "#FFE9E9";
    }else if(num === -2){
        elemento.nextElementSibling.innerHTML = "Níveis mínimos devem ser diferentes";
        elemento.style.backgroundColor = "#FFE9E9";
    }
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
    }else if(elemento.value.length === 0){
        elemento.nextElementSibling.innerHTML = "Digite um número";
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

 function carregarTela3ponto4(idQuizz) {
    const promessa = axios.get(url);
    promessa.then(function (elemento) {
        for (let i=0; i<elemento.data.length; i++) {
            if (elemento.data[i].id === idQuizz) {
                quizzExibido = elemento.data[i];
            }
        }
        renderizarTela3ponto4(idQuizz);
    });
 }
 function renderizarTela3ponto4(idQuizz) {
    telaPrincipal.innerHTML = `
    <div class="tela3ponto4">
        <div class="conteudo-sucesso">
            <p>Seu quiz está pronto!</p>
            <div class="capa-sucesso" onclick="carregarTela2(${idQuizz})">
                <img src="${quizzExibido.image}" />
                <p>${quizzExibido.title}</p>
                <div></div>
            </div>
            <div class="acessar-quizz" onclick="carregarTela2(${idQuizz})">Acessar quizz</div>
            <div class="voltar-home" onclick="carregarTela1()">Voltar para a home</div>
        </div>
    </div>
    `;
 }
