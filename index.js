const baseUrl = 'https://snau.herokuapp.com/'

let loadPage = (event, word) => {
    let tablinks = document.getElementsByClassName('tablink');
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    event.currentTarget.className += ' active';

    let tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; ++i) {
        tabcontent[i].className = tabcontent[i].className.replace(' active', '');
    }

    let content;
    if (word == 'heim') content = document.getElementById('heim');
    else {
        content = document.getElementById('liste');
        getData(word)
            .then(data => {
                let table = content.getElementsByClassName('list')[0];
                table.innerHTML = "";
                let headerRow = document.createElement('TR');
                let keys = Object.keys(data[0]);
                keys.map(key => {
                    let header = document.createElement('TH');
                    header.innerHTML = key;
                    headerRow.appendChild(header);
                });
                table.appendChild(headerRow);
                data.map(obj => {
                    let row = document.createElement('TR');
                    keys.map(key => {
                        let cell = document.createElement('TD');
                        cell.innerHTML = obj[key];
                        row.appendChild(cell);
                    });
                    table.appendChild(row);
                });
            });
    }
    content.className += ' active';
}

let getData = (extension) => {
    let url = `${baseUrl}${extension}`;
    return fetch(url)
        .then(data => data.json());
}