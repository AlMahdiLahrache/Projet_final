let nav_statue = "Open";
function elements_nav(){

    let elementList = document.querySelectorAll("#navigation_options li");
    for(let n=0;n<elementList.length;n++){
        	elementList[n].addEventListener("click",function(){
    		let cls = this.getAttribute("class");
    		cls = cls.split(" ");
    		if(cls.length == 1){
    			this.setAttribute("class",cls+" active");
    			for(let m=0;m<elementList.length;m++){
    				let cls2 = elementList[m].getAttribute("class").split(" ");
    				if(elementList[m] != this ){
    					elementList[m].setAttribute("class", cls2[0]);
    			}
    			n=elementList.length+3;
    		}
    		}
    	});
}
console.log(elementList);
}


/*
La fonction sélectionne tous les éléments de la liste ayant l'ID "nav_options" en utilisant la méthode querySelectorAll et les stocke dans un tableau appelé elementList.

La fonction parcourt ensuite elementList à l'aide d'une boucle for et ajoute un EventListener clic à chaque élément de la liste.

Lorsqu'un élément est cliqué, la fonction obtient sa classe actuelle à l'aide de la méthode getAttribute et la stocke dans une variable appelée cls.

La fonction vérifie si la variable cls contient plus d'une classe en la divisant en utilisant la méthode splite en vérifiant sa longueur. Si elle ne
contient qu'une classe, la fonction ajoute la classe "active" à l'élémentcliqué en utilisant la méthode setAttribute.

La fonction parcourt ensuite de nouveau elementList et supprime la classe "active" de tout élément qui n'est pas l'élément cliqué en utilisant la méthode
setAttribute et la variable cls2.

Enfin, la fonction affecte à n une valeur supérieure à la longueur de elementList, ce qui fait sortir la boucle for.

*/

function bar_show(){
	let musique = document.getElementById("music_player1");
	let navbar = document.getElementById("main_navigation");
	let elements_span = document.querySelectorAll("#navigation_options span");
	let search_box = document.getElementById("search");
	let ss_icon = document.querySelector("#navigation_options > li.search_field > i");


	if(nav_statue=="Open"){
		navbar.style.width = "108px";
		musique.style.marginLeft = "168px";
		music_player1.style.width = "86%";
		nav_statue = "Closed";
		for(let i=0;i<elements_span.length;i++){
		elements_span[i].style.display="none";
		

	}
		search_box.style.display="none";
		ss_icon.setAttribute("style","display:block;");
	}else{
		musique.style.marginLeft = "440px";
		navbar.style.width = "380px";
		music_player1.style.width = "70%";
		for(let i=0;i<elements_span.length;i++){
		elements_span[i].style.display="block";
	}
		nav_statue = "Open";
		search_box.style.display="";
		ss_icon.setAttribute("style","display:none;");
	}
}

elements_nav();
/*
La fonction bar_show permet d'afficher ou de masquer une barre de navigation sur une page web en fonction de l'état actuel de cette barre.
La fonction commence par récupérer l'élément ayant l'ID "main_music" en utilisant la méthode getElementById et le stocke dans une variable appelée musique.
Pareil pour les ID "nav_bar", "nav_options" et "search".

La fonction sélectionne l'élément i de l'élément li ayant la classe c_search et le stocke dans une variable appelée ss_icon.

La condition if-else est utlisée pour vérifier l'état actuel de la barre de navigation. Elle utilise une variable appelée nav_statue pour stocker cet état. 

Si nav_statue est "Open", cela signifie que la barre de navigation est actuellement ouverte, et la fonction la ferme en réduisant sa largeur à 108px et en masquant les éléments "span"
contenus dans l'élément ayant l'ID "nav_options", ainsi que la boîte de recherche. Elle rétablit également la marge gauche de l'élément ayant l'ID "main_music" et masque l'icône de 
recherche. Si nav_statue est "Closed", cela signifie que la barre de navigation est actuellement fermée, et la fonction l'ouvre en agrandissant sa largeur à 380px, en affichant les
éléments "span" contenus dans l'élément ayant l'ID "nav_options", ainsi que la boîte de recherche. Elle rétablit également la marge gauche de l'élément ayant l'ID "main_music" et 
affiche l'icône de recherche.

La boucle for pour modifier l'affichage de chaque élément "span" contenu dans l'élément ayant l'ID "nav_options". Si nav_statue est "Open", elle 
affiche les éléments "span". Si nav_statue est "Closed", elle masque les éléments "span".

La fonction utilise les méthodes setAttribute et setAttribute pour modifier les propriétés CSS de l'élément i de l'élément li ayant la classe c_search. Si nav_statue est 
"Open", elle masque l'icône de recherche en définissant son style d'affichage sur "none". Si nav_statue est "Closed", elle affiche l'icône de recherche en définissant son style 
d'affichage sur "block".

*/