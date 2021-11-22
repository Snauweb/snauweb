'use strict';

import { apiFetch } from '../modules/fetchResource.js';

let forslagsmal = undefined;
let forslagsliste = undefined;
let forslagLastes = undefined;

let innspillsskjema = undefined; 
let innspillsskjemafelter = undefined;

function settOppInnspillsskjema() {
  console.log("Setter opp innspillskjema!");

  let innspillsskjema = document.querySelector('.innspill-skjema');
  let inputs = innspillsskjema.querySelectorAll('input');
  let textareas = innspillsskjema.querySelectorAll('textarea');
  let sendInnKnapp = innspillsskjema.querySelector('.send-inn-knapp');

  innspillsskjemafelter = {sendInnKnapp: sendInnKnapp};
  
  // Setup field handle object
  for (let input of inputs) {
    innspillsskjemafelter[input.name] = {
      handle: input,
      type: "input"
    };
  }

  for(let textarea of textareas) {
    innspillsskjemafelter[textarea.name] = {
      handle: textarea,
      type: "input"
    };
  }

  sendInnKnapp.addEventListener('click', sendInnForslag);
}

function validerFelter(felter) {
  let erFelteneGyldige = true;
  for(let felt in felter) {
    let valgtFelt = felter[felt];
    if('type' in valgtFelt && valgtFelt.type === "input") {
      if(valgtFelt.handle.value === "") {
	erFelteneGyldige = false;
	valgtFelt.handle.style.borderColor = "red";
	valgtFelt.handle.style.borderStyle = "solid";
      }
      else {
	valgtFelt.handle.style.borderColor = "black";
	valgtFelt.handle.style.borderStyle = "solid";
      }
    }
  }

  return erFelteneGyldige;
}

function fjernInnhold(felter) {
  for(let felt in felter) {
    let valgtFelt = felter[felt];
    if('type' in valgtFelt && valgtFelt.type === "input") {
      console.log("sletter", valgtFelt)
      valgtFelt.handle.style.borderColor = "black";
      valgtFelt.handle.style.borderStyle = "solid";
      valgtFelt.handle.value = "";
    }
  }
}

function lagLast(felter) {
  let last = {}
  for(let felt in felter) {
    let valgtFelt = felter[felt];
    if('type' in valgtFelt && valgtFelt.type === "input") {
      last[felt] = valgtFelt.handle.value;
    }
  }
  
  return last;
}

function sendInnForslag(event) {
  console.log("sender inn forslag, zoom!");
  
  let erFelteneGyldige = validerFelter(innspillsskjemafelter);
  if(erFelteneGyldige == true) {
    let last = lagLast(innspillsskjemafelter);
    console.log(JSON.stringify(last))
    fjernInnhold(innspillsskjemafelter);
    apiFetch('/forslag', {
      credentials: 'include',
      method: 'POST',
      headers: {
	'Content-Type': 'application/json',
      },
      body: JSON.stringify(last)
    }).then((response) => {
      return response.json()
    }).then((data) => {
      hentOgVisForslag()
    }).catch((error) => {
      console.error('apiFetch error:', error);
    });
  }

  // Last inn siden på nytt for å vise at innlegget blei sendt inn
  //window.location.reload(false);
}

function visForslag(data) {
  // Slett gammelt innhold
  let gamleForslag = forslagsliste.querySelectorAll('li')
  for(let forslag of gamleForslag) {
    forslagsliste.removeChild(forslag);
  }

  // Iterer over alle innspill
  for(let forslag of data) {
    // Klon det faktiske innholdet i forslagsmalen
    let nyttForslagListElem =
      forslagsmal.content.querySelector('.forslag-wrap')
	.cloneNode(true);

    let tittelElem = nyttForslagListElem.querySelector('h3');
    let forslagTekstElem = nyttForslagListElem.querySelector('p');

    // Om forskjellen mellom textContent og innerText
    // https://kellegous.com/j/2013/02/27/innertext-vs-textcontent/ (15.11.2021)
    // IKKE BRUK .innerHTML, må du det så revurder
    tittelElem.textContent       = forslag.tittel;
    forslagTekstElem.textContent = forslag.forslag;

    // Legg det nye listeelementet til i lista
    forslagsliste.appendChild(nyttForslagListElem);
  }
}

function hentOgVisForslag() {
  forslagLastes = true;
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

function settOppForslagsliste() {
  forslagsmal = document.querySelector('.forslagsmal');
  forslagsliste = document.querySelector('.forslagsliste');
  innspillsskjema = document.querySelector('.innspill-skjema');
  forslagLastes = true;
}

function init(){
  settOppForslagsliste();
  settOppInnspillsskjema();
  hentOgVisForslag();
}
window.addEventListener('load', init);
