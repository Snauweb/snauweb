# snauweb
Front-end for Snaustrindas internside. Henter data fra API-server, som igjen henter fra samfundets databaser

## Arkitektur
Front-enden fungerer basert på en tredeling av data, visning og kontroll. Visninga er i hovedsak definert i standard html og css, kontroll er styrt av js og custom components, mens data er håndtert gjennom en API-server som kontrollerer tilgang på data i en database gjennom et web-api (RESTisj). I utgangspunktet gjøres henting av data med GET-forespørsler og URL-parameter, mens innsetting av data gjøres med POST-forespørsler med data som skal inn i POST-lasten ("payload")

## Custom components
Javascriptobjekter som kan kontrollere DOM-trær, og som kan settes inn i et HTML-dokument med tilhørende tags. Disse trærne kan være del av det vanlige dokumentet, eller private per custom element ("shadow DOM"). Hovedbruken så langt er å spesifisere utseende og innhold i css og html som et undertre innenfor hvert komponent. Javascriptkoden forbundet med custom-componentet tar deretter over kontrollen, og håndterer data og tilstand for komponentet. Komponenter kommuniserer med hverandre vha events, metoder og attributter. For å skjule visningen fram til komponentet er klart kan den oppgis i et \<template\>-element.
Mer dokumentasjon her: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements

### HTML-attributter
Et designmål er å aktivt bruke HTML-attributter og tilhørende oppdaterings-callback for å endre og kommunisere elementtilstand. Dette gjør det lettere å sette opp komponententene i HTML, og gir et oversiktelig grensesnitt for å lese og sette tilstand både fra HTML og JS.

### Events for å kommunisere mellom komponenter
Ofte vil det være logisk å sette sammen et komplisert komponent av flere underkomponenter. For eksempel vil en liste som filtreres av et søkefelt kunne bestå av et søkefelt som skaper et filter, et datahentingskomponent som gjør api-forespørsler og et listekomponent som lister opp den filtrerte dataen. I HTML kan det se slik ut:
```
<soke-liste>
  <soke-filter>
    [HTML og CSS som beskriver visning]
  </soke-filter>
  <data-liste>
    [HTML og CSS som beskriver visning]
  </data-liste>
</soke-liste>
```
Her antar vi at:
* \<soke-liste\> håndterer API-forespørsler og inneholder data
* \<soke-filter\> styrer et søkefelt definert i HTML, og rapporterer når det endres
* \<data-liste\> kan ta i mot en liste med data på JSON-format og presentere det basert på HTMLen definert inne i elementet

For å kommunisere disse i mellom kan man bruke custom events. For eksempel kan man tenke seg at å oppdatere filteret utløser en event som \<soke-liste\> lytter etter. \<soke-liste\> kan deretter konstruere en oppdatert API-forespørsel, sende den, motta data, og sende den til /<data-liste/> gjennom en attributt-endring, noe som utløser en omtegning av listevisningen slik at den nå viser den nye dataen

### Generelle komponentklasser og spesialiserte subklasser
En del bruksområder på en nettside som Snauweb vil være variasjoner over det samme. Listevisninger er et eksempel. Her kan man konstruere en generell listevisningsklasse som tar utgangspunkt i en HTML og CSS-definert visningsmal, og skaper en liste over inputdata på det ønskede formatet. Om man ønsker en mer forseggjort visningslogikk kan man lage et nytt komponent som arver fra det generelle komponentet, og overskriver f.eks render for sin egen visningslogikk, uten at man må skrive all den andre logikken på nytt. \<data-list\> og \<forslag-list\> er et eksempel på et slikt par av generelt og spesialisert komponent som brukes på sia.
