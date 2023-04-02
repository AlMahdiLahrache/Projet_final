let data_music;
let data_video;
let title = document.getElementById("title");
let artist = document.getElementById("artist");
let image = document.getElementById("img_track");
let audio = document.getElementById('audio');
let source = document.getElementById('audioSource');
let currentMusicIndex = 0;
let favorite = [];
let last_play = [];

if(getCookie("favorite") != ""){
    favorite = getCookie("favorite");
	favorite = JSON.parse(getCookie("favorite"));
}else{
	favorite=[];
}

if(getCookie("last_play") != ""){
    last_play = getCookie("last_play");
	last_play = JSON.parse(getCookie("last_play"));
}else{
	last_play=[];
}

/*

Le but de ce code est de vérifie s'il existe des cookies définis pour les variables "favorite" et "last_play". S'il y a des cookies définis, il récupère leur valeur et les analyse en tant 
qu'objets JSON. S'il n'y a pas de cookies définis, il initialise les variables en tant que listes vides.

*/





function set_cookie_value(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


/*
La fonction "set_cookie_value(cname, cvalue, exdays)" définit un cookie avec un nom "cname", une valeur "cvalue" et une durée de validité "exdays" en jours. 
La fonction crée une date d'expiration en ajoutant le nombre de jours spécifié à la date actuelle, puis elle encode le nom et la valeur du cookie et les stocke dans le document 
cookie du navigateur.
*/


function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/*
La fonction "getCookie(cname)" est utilisée pour récupérer la valeur du cookie avec le nom "cname". Elle commence par décoder tous les cookies stockés dans le document cookie 
du navigateur, puis elle les sépare en liste avec l'attribut ";". Ensuite, elle parcourt chaque élément de la liste et extrait la valeur du cookie qui correspond au nom donné 
dans l'argument "cname". Si aucun cookie avec ce nom n'est trouvé, la fonction renvoie une chaîne vide.
*/


function fetchJSONFile(path, callback) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                let data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send(); 
}


/*
Cette fonction utilisée pour récupérer un fichier JSON à partir d'une URL et renvoyer son contenu à une fonction de rappel (callback).

La fonction "fetchJSONFile(path, callback)" crée une requête HTTP à l'aide de l'objet XMLHttpRequest et défini une fonction de rappel pour être exécutée chaque 
fois que l'état de la requête change. Lorsque l'état de la requête devient "4" (ce qui signifie que la réponse est prête), la fonction vérifie que le statut de la 
réponse est "200" (ce qui signifie que la réponse est réussie), puis elle analyse le contenu de la réponse JSON à l'aide de la méthode "JSON.parse()". Si la fonction
 de rappel "callback" est définie, elle est appelée avec le contenu JSON comme argument.

Ensuite, la fonction "fetchJSONFile()" ouvre une requête HTTP en utilisant la méthode "open()" avec une méthode "GET" et l'URL fournie dans l'argument "path". Enfin, 
elle envoie la requête en utilisant la méthode "send()".
*/


function sanitizeHtml(str)
{
    let map =
    {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, function(m) {return map[m];});
}



function play_music(index,elem){
    currentMusicIndex = index;
    audio.loop = false;
    music = data_music[index];
    title.innerText = music["title"];
    artist.innerText = music["artist"];
    image.setAttribute("src",music["cover"]);
    

    if(elem){
      let altr = document.getElementsByTagName("tr");
      let ref = document.getElementsByClassName("fa-refresh");
      for (let i = 0; i < ref.length; i++) {
        ref[i].style.color = 'white';
      }
      for (let i = 0; i<altr.length; i++) {
          altr[i].style.background = "none";
          if(altr[i].hasAttribute("class")){
          	altr[i].removeAttribute("class");
          }

      }
      elem.setAttribute("class","active");
      elem.style.background = "none";
    }
    source.src = music["path"];
    audio.load(); 
    audio.play(); 
    let num = index;
    const indexx = last_play.indexOf(num);
    if (indexx > -1) {
        last_play.splice(indexx, 1);
    }else{
    last_play.push(num);
    set_cookie_value("last_play",JSON.stringify(last_play), 3);
	last_play = getCookie("last_play");
	last_play = JSON.parse(getCookie("last_play"));
    }   
}

/*
Le code définit une fonction "play_music" qui prend deux arguments : "index" et "elem". Il est supposé qu'un objet "audio", des objets "title", "artist" et "image" sont déjà définis 
dans le code. La fonction "play_music" utilise le paramètre "index" pour récupérer les données musicales correspondantes à partir d'un tableau appelé "data_music". Elle définit les 
attributs "title", "artist" et "image" aux valeurs récupérées des données musicales. Si le paramètre "elem" est fourni, la fonction parcourt tous les éléments "tr" du document et 
supprime la classe "active" de chacun d'eux. Elle supprime également l'attribut "class" de tout élément qui en a un. Elle définit ensuite la classe "active" et la couleur de fond 
de l'élément "elem" fourni. La fonction définie ensuite la source de l'objet "audio" sur le chemin des données musicales récupérées, charge le fichier audio (préchargement sans lecture)
 et le lit. Elle garde également une trace de la dernière chanson jouée en stockant l'indice de la chanson dans un tableau appelé "last_play", qui est stocké sous forme de cookie en 
 utilisant la fonction "set_cookie_value", puis récupéré et analysé en tant que tableau à l'aide de la fonction "getCookie".

*/


function like_song(ele,i){
	let num = i;
    const index = favorite.indexOf(num);
    if (index > -1) {
        favorite.splice(index, 1); // 2nd parameter means remove one item only
        set_cookie_value("favorite",JSON.stringify(favorite), 3);
        favorite = getCookie("favorite");
	    favorite = JSON.parse(getCookie("favorite"));
	    let el =document.querySelector("#tr"+i+ " td.like");
        el.setAttribute("class","like");
    }else{
    favorite.push(num);
    set_cookie_value("favorite",JSON.stringify(favorite), 3);
	favorite = getCookie("favorite");
	favorite = JSON.parse(getCookie("favorite"));
    }

    if(favorite.length>0){

    	for (let i=0;i<favorite.length;i++) {
    		let el =document.querySelector("#tr"+favorite[i]+ " td.like");
    		el.setAttribute("class","like active");
    	}

    }else{
    	for (let i=0;i<data_music.length;i++) {
    		let el =document.querySelector("#tr"+i+ " td.like");
    		el.setAttribute("class","like");
    	
    }
    }
  	}

/* 
La fonction like_song(ele,i) permet de marquer une chanson comme favorite ou de la retirer des favoris. Elle prend en paramètres un élément HTML ele et un index i correspondant à la 
position de la chanson dans la liste. La fonction commence par vérifier si la chanson est déjà dans la liste des favoris (favorite), et si c'est le cas, elle la supprime de la liste.
 Sinon, elle l'ajoute à la liste des favoris. Ensuite, elle met à jour les classes CSS des éléments de la liste pour refléter les changements de statut de la chanson en tant que 
 favorite. Si la liste des favoris contient des éléments, elle mettra à jour la classe CSS de chaque élément de la liste. Si la liste des favoris est vide, elle réinitialisera toutes
  les classes CSS pour que les chansons ne soient plus marquées comme favorites.
*/



function onrepeat(ele){
  if(!audio.loop){

    audio.loop = true;
    ele.style.color = "rgb(23 118 209)";

  }else if(audio.loop == true){
    ele.style.color = "white";
    audio.loop = false;
  }else{
    audio.loop = true;
    ele.style.color = "rgb(23 118 209)";
  }
}
/*
La fonction "read_music" crée une liste de chansons dans le fichier HTML. Elle parcourt les données de musique et crée des lignes "tr" pour chaque chanson, en utilisant des balises
 HTML pour afficher les détails tels que le titre, l'artiste et la durée de chaque chanson. La fonction utilise également la fonction "sanitizeHtml" pour nettoyer les entrées et éviter
  toute injection de code malveillant. Chaque ligne contient également des boutons pour lire la chanson, ajouter ou supprimer la chanson des favoris, et activer ou désactiver la boucle 
  de lecture. Si des chansons sont marquées comme favoris, elles sont mises en évidence avec un cœur rempli en rouge.
*/


// function creating tr of songs in html
function read_music(){
	let tit = document.getElementsByTagName("h2");
  main_navigation.style.background="#1976d2";
	tit[0].innerHTML = "Musique";
	track_list_body.innerHTML="";
    for (let i=0; i<data_music.length; i++) {
        track_list_body.innerHTML += '<tr onclick="play_music('+i+',this)" id="tr'+i+'"><th scope="row">'+(i+1)+'</th><td class="song_title">'+sanitizeHtml(data_music[i].title)+'</td><td class="like" onclick="like_song(this,'+i+')"><i class="fa-regular fa-heart"></i></td><td><i class="fa fa-refresh" aria-hidden="true" onclick="event.stopPropagation();onrepeat(this);favorites(this,'+i+')"></i></td><td>'+sanitizeHtml(data_music[i].artist)+'</td><td>'+sanitizeHtml(data_music[i].time)+'</td></tr>';
    }
    if(favorite.length>0){
    	for (let i=0;i<favorite.length;i++) {
    		let el =document.querySelector("#tr"+favorite[i]+ " td.like");
    		el.setAttribute("class","like active");
    	}
    }

}

/*
La fonction onrepeat(ele) permet de mettre une chanson en mode répétition, ou de désactiver le mode répétition s'il est déjà activé. Elle prend en paramètre un élément HTML ele. 
La fonction commence par vérifier si l'audio n'est pas déjà en mode répétition. Si ce n'est pas le cas, elle active le mode répétition en changeant la valeur de la propriété loop 
de l'élément audio, et elle change la couleur de l'icône de répétition en bleu. Si l'audio est déjà en mode répétition, elle désactive le mode répétition en changeant à nouveau la 
valeur de la propriété loop de l'élément audio, et elle change la couleur de l'icône de répétition en blanc. Si la propriété loop n'est ni true ni false, cela signifie qu'elle n'a 
pas été initialisée, donc la fonction active le mode répétition.
*/


fetchJSONFile('playlist.json', function(data){
    data_music = data;
    read_music();
    let first_tr = document.getElementById("tr0");
    play_music(0,first_tr);
});

/*
Ce code utilise la fonction fetchJSONFile pour récupérer les données de la playlist à partir d'un fichier JSON. Les données sont ensuite stockées dans la variable data_music et 
la fonction read_music() est appelée pour afficher les informations sur les chansons dans le tableau HTML.
*/
audio.addEventListener('ended',function(){
  if(audio.loop!=true){
    let next_tr = document.getElementById("tr"+(currentMusicIndex+1));
    let first_tr = document.getElementById("tr0");
    if(next_tr){
      play_music(currentMusicIndex+1,next_tr);
    }else{
      play_music(0,first_tr);
    }
  }
});


/*
L'événement ended de l'élément audio pour détecter la fin d'une chanson. Si la boucle audio n'est pas activée, le code sélectionne le prochain élément dans la liste des chansons à 
jouer et appelle la fonction play_music() pour lire cette chanson. Si la fin de la liste est atteinte, la fonction play_music() est appelée avec le premier élément de la liste pour 
recommencer la lecture depuis le début.
*/

function check_file_type(files){
  const allowedExtensions =  ["mp3"],
        sizeLimit = 20000000; 
  for (let i = 0; i < files.length ; i++) {
    const { name:fileName, size:fileSize } = files[i];
    const fileExtension = fileName.split(".").pop();

    if(!allowedExtensions.includes(fileExtension)){
      alert("le type de l'un des fichiers n'est pas autorisé");
      return false;
    }else if(fileSize > sizeLimit){
      alert("la taille de l'un des fichiers dépasse 20MB!")
      return false;
    }
  }
  return true;
}

//
let filesDone = 0;
let filesToDo = 0;
let uploadProgress = [];
let progressBar = document.getElementById("upload_progress");

const dropArea = document.getElementById("file_drop_area");

function disable_default_actions(e){
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e){
  dropArea.classList.add("highlight");
}

function unhighlight(e){
  dropArea.classList.remove("highlight");
}

function handle_file_drop(e){

  const dt = e.dataTransfer;
  const files = dt.files;

  process_selected_files(files);
}

function process_selected_files(files){
  if (check_file_type(files)){
    const filesArray = [...files];
    setup_progress_bar(filesArray.length);
    filesArray.forEach(send_file_to_server);
  }
}


function send_file_to_server(file, i) {
  const url = "../";
  let xhr = new XMLHttpRequest();
  let formData = new FormData();

  xhr.open("POST", url, true);

  xhr.upload.addEventListener("progress", e => {
    let prog = (e.loaded * 100.0 / e.total) || 100;
    update_progress_bar(i, prog);
    if(prog == 100){
        console.log("done");
        location.reload();
    }
  });

  xhr.addEventListener(
    "readystatechange",
    function(resp) {
      if (xhr.status == 200) {
      } else{
        let formError = document.getElementById("formError");
        formError.innerHTML = "Une erreur s'est produite lors de l'importation";
        formError.style.visibility = "visible";
      }
    },
    false
    );

  formData.append("file", file);
  xhr.send(formData);
}

/*


Cette fonction envoie un fichier à un serveur en utilisant XMLHttpRequest. Elle prend deux paramètres : file, qui est le fichier à envoyer, et i, qui est l'index du fichier en cours 
d'envoi (probablement pour des raisons de suivi).La fonction commence par définir l'URL du serveur vers lequel le fichier sera envoyé. Elle crée ensuite un nouvel objet XMLHttpRequest 
et un nouvel objet FormData, auquel elle ajoute le fichier. Elle définit la méthode de requête en POST et ouvre la requête, en passant l'URL et une valeur booléenne indiquant s'il faut
rendre la requête asynchrone.La fonction met ensuite en place un écouteur d'événements pour la progression de l'envoi du fichier, qui met à jour la barre de progression de l'interface 
utilisateur en appelant update_progress_bar() et vérifie si la progression est à 100%. Si c'est le cas, la fonction recharge la page.Ensuite, la fonction met en place un autre écouteur
d'événements pour l'événement readystatechange, qui est déclenché chaque fois que la propriété readyState de l'objet XMLHttpRequest change. Lorsque le statut de la réponse est 200 (OK),
elle ne fait rien. Sinon, elle affiche un message d'erreur sur l'interface utilisateur en définissant la visibilité d'un élément HTML avec l'ID formError sur "visible".Enfin, la 
fonction envoie l'objet FormData au serveur en utilisant la méthode send() de l'objet XMLHttpRequest.

*/

["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
  dropArea.addEventListener(eventName, disable_default_actions, false);
});
["dragenter", "dragover"].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
});
["dragleave", "drop"].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

dropArea.addEventListener("drop", handle_file_drop, false);


function setup_progress_bar(numFiles){
  console.log("entra", numFiles);
  progressBar.style.display = "block";
  progressBar.value = 0;
  uploadProgress = [];

  for (let i = numFiles; i > 0; i--) {
    uploadProgress.push(0);
  }
}

function update_progress_bar(fileNumber, percent){
  console.log('progress', fileNumber, percent)
  let total;
  uploadProgress[fileNumber] = percent;
  total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length;
  progressBar.value = total;
}


function search() {
    let input, filter, table, tr, a, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("track_list_body");
    tr = table.getElementsByTagName("tr");
    let tit = document.getElementsByTagName("h2");
    tit[0].innerHTML = "Search results"
    for (i = 0; i < tr.length; i++) {
        td0 = tr[i].getElementsByTagName("td")[0];
        td1 = tr[i].getElementsByTagName("td")[3];
        
        txtValue1 = td0.textContent.split(" ");
        txtValue2 = td1.textContent.split(" ");
        console.log(txtValue1);
        let c=0;
        for(let x=0;x<txtValue1.length;x++){
          if(txtValue1[x].toUpperCase().includes(filter)){
            c = 1;
          }
        }
        for(let x=0;x<txtValue2.length;x++){
          if(txtValue2[x].toUpperCase().includes(filter)){
            c = 1;
          }
        }
        txtValue = td0.textContent +" "+ td1.textContent;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            c=1;
        }

        if (c==1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}
 
/*
La fonction "search" effectue une recherche dans une table HTML en filtrant les éléments en fonction d'une chaîne de caractères saisie dans un champ de recherche. Elle récupère 
le champ de recherche et la table, puis parcourt chaque ligne de la table en récupérant les valeurs des colonnes 0 et 3 (title et artist). Elle compare ensuite chaque valeur avec 
la chaîne de caractères de recherche en la convertissant en majuscules pour une correspondance insensible à la casse. Si la chaîne de caractères est trouvée dans l'une des valeurs 
de la ligne, cette dernière est affichée, sinon elle est masquée. La fonction modifie également le titre de la page pour afficher les résultats de la recherche.
*/

function favorite_songs(){
	let tit = document.getElementsByTagName("h2");
  main_navigation.style.background="#d32f2f";
	      tit[0].innerHTML = "Liked";
	if (favorite.length == 0){

          track_list_body.innerHTML="";
	}else{
		track_list_body.innerHTML="";
		for (let i=0;i<favorite.length;i++) {
        track_list_body.innerHTML += '<tr onclick="play_music('+favorite[i]+',this)" id="tr'+favorite[i]+'"><th scope="row">'+(favorite[i]+1)+'</th><td class="song_title">'+sanitizeHtml(data_music[favorite[i]].title)+'</td><td class="like" onclick="like_song(this,'+favorite[i]+')"><i class="fa-regular fa-heart"></i></td><td><i class="fa fa-refresh" aria-hidden="true" onclick="event.stopPropagation();onrepeat(this);favorites(this,'+favorite[i]+')"></i></td><td>'+sanitizeHtml(data_music[favorite[i]].artist)+'</td><td>'+sanitizeHtml(data_music[favorite[i]].time)+'</td></tr>';
    }

	}
    
    if(favorite.length>0){
    	for (let i=0;i<favorite.length;i++) {
    		let el =document.querySelector("#tr"+favorite[i]+ " td.like");
    		el.setAttribute("class","like active");
    	}
    }
	
}




function last_songs_plays(){
	let tit = document.getElementsByTagName("h2");
  main_navigation.style.background="#c2185b";
	      tit[0].innerHTML = "Recent plays";

	if (last_play.length == 0){

          track_list_body.innerHTML="";

	}else{

		track_list_body.innerHTML="";
		for (let i=0;i<last_play.length;i++) {
        track_list_body.innerHTML += '<tr onclick="play_music('+last_play[i]+',this)" id="tr'+last_play[i]+'"><th scope="row">'+(last_play[i]+1)+'</th><td class="song_title">'+sanitizeHtml(data_music[last_play[i]].title)+'</td><td class="like" onclick="like_song(this,'+last_play[i]+')"><i class="fa-regular fa-heart"></i></td><td><i class="fa fa-refresh" aria-hidden="true" onclick="event.stopPropagation();onrepeat(this);favorites(this,'+last_play[i]+')"></i></td><td>'+sanitizeHtml(data_music[last_play[i]].artist)+'</td><td>'+sanitizeHtml(data_music[last_play[i]].time)+'</td></tr>';
    }

	}

	if(favorite.length>0){
    	for (let i=0;i<favorite.length;i++) {
    		let el =document.querySelector("#tr"+favorite[i]+ " td.like");
    		el.setAttribute("class","like active");
    	}
    }

	
}

function averageColor(imageElement) {
            let canvas
                = document.createElement('canvas'),
                context
                    = canvas.getContext &&
                    canvas.getContext('2d'),
                imgData, width, height,
                length,
                rgb = { r: 0, g: 0, b: 0 },
                count = 0;
            height = canvas.height =
                imageElement.naturalHeight ||
                imageElement.offsetHeight ||
                imageElement.height;
            width = canvas.width =
                imageElement.naturalWidth ||
                imageElement.offsetWidth ||
                imageElement.width;
            context.drawImage(imageElement, 0, 0);
            imgData = context.getImageData(
                        0, 0, width, height);
            length = imgData.data.length;
            for (let i = 0; i < length; i += 4) {
                rgb.r += imgData.data[i];
                rgb.g += imgData.data[i + 1];
                rgb.b += imgData.data[i + 2];
                count++;
            }
            rgb.r
                = Math.floor(rgb.r / count);
            rgb.g
                = Math.floor(rgb.g / count);
            rgb.b
                = Math.floor(rgb.b / count);
            return rgb;
        }

function change_background_color(){
	let image2 = document.getElementById("img_track");
    let back_color = averageColor(image2);
    let audio_rowo = document.getElementById("audio_row");
    console.log(back_color);
    audio_rowo.style.background = "rgba("+back_color.r+", "+back_color.g+", "+back_color.b+", 0.95)";
}
