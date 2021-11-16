let bilde= undefined;
let alpakkaBoks = undefined;

function init(){
    bilde = document.querySelector('img');
    bilde.addEventListener('click',alpakkaKlikk)
    alpakkaBoks = document.querySelector('.alpakkaBoks')
    console.log(bilde, alpakkaBoks)
}
window.addEventListener('load', init)

function alpakkaKlikk(){
    console.log('klikk')
    if(bilde == undefined || alpakkaBoks == undefined){
        return;
    }

    let newAlpakka = bilde.cloneNode(true);
    newAlpakka.addEventListener('click',alpakkaKlikk)
    alpakkaBoks.appendChild(newAlpakka);

}