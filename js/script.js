let telaPrincipal = document.querySelector(".tela");
let url = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
let meusQuizzes = JSON.parse(localStorage.getItem("idQuizz"));

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

function carregarTela2(idQuizz){ // id do quizz a ser exibido
    telaPrincipal.innerHTML = `
    Deixei no jeito pra vc fazer o HTML aqui :) 
    `; 
}

function carregarTela3(){
    telaPrincipal.innerHTML = ``; 
}