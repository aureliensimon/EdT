/*  TO COMPILE THIS FILE    
    browserify js/parser.js -o js/bundle.js
*/

/*
    IDEE :
    - REMPLIR UN TABLEAU EN VARIABLE GLOBALE DANS UN AUTRE SCRIPT 
    (cf ligne 37) POUR ENSUITE L'UTILISER DANS LES FONCTIONS
    (POUR PLUS TARD TROP DE TRUCS A CHANGER SINON) 
*/

var ical = require('ical');
var login = 'asimon23';
var url = 'https://cors-anywhere.herokuapp.com/' + 'http://web.isen-bretagne.fr/EDT/' + login + '.ics';
var matiereUniques = [];

function getCours () {
    let tab = [];
    let allMatieres = [];
    ical.fromURL(url, {}, function (err, data) {
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                var ev = data[i];
                if (data[i].type == 'VEVENT') {
                    var cours = splitMaker("" + ev.description, "" + ev.start, "" + ev.end);
                    tab.push(cours);
                    allMatieres.push(cours.matiere);
                }
            }
        }
        matiereUniques = Array.from(new Set(allMatieres));

        let CurrentPage = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        switch(CurrentPage) {
            case 'edt.html':
                fillListeCours(tab);
                loadDayItems(targetDate);
                break;
            case 'settings.html':
                loadColors();
                break;
        }
    });
}
getCours();

function loadColors () {
    let modelsetting = document.getElementById("couleurmatiere");
    let contenu = document.getElementById("liste-matieres");
    let learn = getMatieres();
    
    learn.forEach(function(element){
        let modelsettingclone = modelsetting.cloneNode(true);

        modelsettingclone.childNodes[1].childNodes[1].innerHTML=element;
        modelsettingclone.style.display = 'flex';

        contenu.appendChild(modelsettingclone);
    });
}

/*  Liste de toutes les catégories de matières  */ 
function getMatieres(){
    return matiereUniques;
}

/*  La date du jour    */
function getFullDate(date){
    return date.substr(4,11);
}

/*  L'heure de la matière   */
function getDate(date) {
    return date.substr(16, 5);
}

/*  Créer le JSON en partant du ical    */
function createJson(array) {
    return ({
        date: array[0],
        dateDebut: array[1],
        dateFin: array[2],
        matiere: array[3],
        matiere2: array[4],
        prof: array[5],
        lieu: array[6],
        notes: array[7]
    });
}

/*  Sépare toutes les différentes partie d'un cours */
function splitMaker(activity, start, end) {
    var payload = [];
    
    var array = activity.split('\n');
    payload.push(getFullDate(start));
    payload.push(getDate(start), getDate(end));
    
    for (var i = 0; i < array.length; i++) {
        if (!i || i == array.length)
            continue;
        payload.push(array[i].split('-')[1]);
    }
    
    var payloadJSON = createJson(payload);
    
    return payloadJSON;
}
