# snauweb
Front-end for Snaustrindas internside. Henter data fra API-server, som igjen henter fra samfundets databaser

## Arkitektur
Front-enden fungerer basert på en tredeling av data, visning og kontroll. Visninga er i hovedsak definert i standard html og css, kontroll er styrt av js og custom components, mens data er håndtert gjennom en API-server som kontrollerer tilgang på data i en database gjennom et REST-api.

## Custom components
Javascriptobjekter som kan kontrollere DOM-trær. Disse trærne kan være del av det vanlige dokumentet, eller private per custom element ("shadow DOM"). Hovedbruken så langt er å spesifisere utseende og innhold i css og html som et undertre innenfor hvert komponent. Javascriptkoden forbundet med custom-componentet tar deretter over kontrollen, og håndterer data og tilstand for komponentet. Komponenter kommuniserer med hverandre vha events, metoder og attributter
