import { apiFetch } from '../modules/fetchResource.js';
export { sendInnForslag }

let forslagsmal = undefined;
let forslagsliste = undefined;
let innspillsskjema = undefined; 


function settOppInnspillsskjema() {
  console.log("Setter opp!")
}

function sendInnForslag(data) {
  console.log("sender inn forslag, zoom!")
}

function visForslag(data) {
  // Iterer over alle innspill
  for(let forslag of data) {
    // Klon det faktiske innholdet i forslagsmalen
    let nyttForslagListElem =
      forslagsmal.content.querySelector('.forslag')
	.cloneNode(true);

    let tittelElem = nyttForslagListElem.querySelector('h3');
    let forslagTekstElem = nyttForslagListElem.querySelector('p');

    // Om forskjellen mellom textContent og innerText
    // https://kellegous.com/j/2013/02/27/innertext-vs-textcontent/ (15.11.2021)
    tittelElem.textContent       = forslag.tittel;
    forslagTekstElem.textContent = forslag.forslag;

    // Legg det nye listeelementet til i lista
    forslagsliste.appendChild(nyttForslagListElem);
  }
}

function hentOgVisForslag() {
   // apiFetch kaller fetch med en api-URL definert i config/apiConfig.json
  apiFetch('/forslag', {
    credentials: 'include',
    method: 'GET'
  })
    .then(response => response.json())
    .then(visForslag)
    .catch((error) => {
      console.error('apiFetch error:', error);
    });
  
}

function init(){
  forslagsmal = document.querySelector('.forslagsmal');
  forslagsliste = document.querySelector('.forslagsliste');
  innspillsskjema = document.querySelector('.innspill-skjema');

  settOppInnspillsskjema();
  hentOgVisForslag();
}
window.addEventListener('load', init);
