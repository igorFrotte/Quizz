let telaPrincipal = document.querySelector(".tela");
let url = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";

carregarTela1();

function carregarTela1(){
    telaPrincipal.innerHTML = `
    <div class="tela1">
        <div class="seuQuizz">
            <div>Você não criou nenhum quizz ainda :(</div>
            <div onclick="carregarTela3()" >Criar Quizz</div>
        </div>
        <div class="todoQuizz">
            <div class="miniTitulo">Todos os Quizzes</div>
            <div class="galeriaQuizz"></div>
        </div>
    </div>
    `;
    const promessa = axios.get(url);
    promessa.then(listarQuizzes);
}

function listarQuizzes(elemento){
    console.log(elemento.data);
    let galeria = document.querySelector(".galeriaQuizz");
    for(let i=0;i<elemento.data.length;i++){
        galeria.innerHTML += `
        <div onclick="carregarTela2(${elemento.data[i].id})">
            <img src="${elemento.data[i].image}">
            <p>${elemento.data[i].title}</p>
            <div></div>
        </div>
        `;
    }
}

function carregarTela2(idQuizz){
    console.log(idQuizz);
}

function carregarTela3(){
    
}