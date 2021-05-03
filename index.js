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
    else content = document.getElementById('liste');
    content.className += ' active';
}