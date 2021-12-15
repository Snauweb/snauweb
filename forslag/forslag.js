'use strict';

import { apiFetch } from '../modules/apiFetch.js';

let forslagsliste = undefined;

let innspillsskjema = undefined; 
let innspillsskjemafelter = undefined;

function settOppInnspillsskjema() {

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
  
  let erFelteneGyldige = validerFelter(innspillsskjemafelter);
  if(erFelteneGyldige == true) {
    let last = lagLast(innspillsskjemafelter);
    fjernInnhold(innspillsskjemafelter);
    apiFetch('/forslag', {
      credentials: 'include',
      method: 'POST',
      headers: {
	'Content-Type': 'application/json',
      },
      body: JSON.stringify(last)
    }).then((response) => {
      response.json()
    }).then((data) => {
      forslagsliste.update(); // not implemented, will make the page bug out
    }).catch((error) => {
      console.error('apiFetch error:', error);
    });
  }

  // Last inn siden på nytt for å vise at innlegget blei sendt inn
  //window.location.reload(false);
}

function init(){
  forslagsliste = document.querySelector(".forslagsliste");
  
  settOppInnspillsskjema();
}
window.addEventListener('load', init);
