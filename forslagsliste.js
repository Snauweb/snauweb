let forslagsmal = undefined;
let forslagsliste = undefined;

function init(){
    forslagsmal = document.querySelector('.forslagmal');
    forslagsliste = document.querySelector('forslags-liste');
    console.log(forslagsmal);
    const request = new Request('https://snaustrinda.samfundet.no/api/api.py/forslag');
    const credentials = request.credentials;
    console.log(credentials)

    fetch('https://snaustrinda.samfundet.no/api/api.py/forslag', {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://samfundet.no'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });;
}
window.addEventListener('load', init);
