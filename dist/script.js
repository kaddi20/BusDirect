const TOTAL_SEATS = 20;
const PRIX_TICKET =80;

let reservations = JSON.parse(localStorage.getItem(""));

const formulaire = document.getElementById("reservation-Form");
const nomentrer = document.getElementById("nom");
const siegeSelect = document.getElementById("siege");
const places = document.querySelectorAll("#liste-sieges > div");
const messageConf = document.getElementById("messageConf");

// validation de formulaire
function validation() {
  let nom = nomentrer.value.trim();
  let siege = siegeSelect.value;
  if (nom === "") {
    afficherMessage("messageConf","Le nom est obligatoire.", "erreur");
    return;
  }
// vérifier si il ya un résirvation avec meme nom
 for (let i = 0; i < reservations.length; i++) {
  if (reservations[i].nom.toLowerCase() === nom.toLowerCase()) {
    afficherMessage("messageConf","Ce passager est déja réservé !", "erreur");
    return;
  }
}
// si le passager pas choisir un siège automatiquemement choisir le premier siège libre
  if (siege === "") {
    for (let i = 0; i <TOTAL_SEATS; i++) {
      let numero = String(i + 1).padStart(2, "0");
      let occupe = false;
      for (let j = 0; j < reservations.length; j++) {
        if (reservations[j].siege === numero) {
          occupe = true;
          break;
        }
      }
      if (occupe === false) {
        siege = numero;
        break;
      }
    }
    //vérifier si tout les sièges sont occupés
    if (siege === "") {
      afficherMessage("messageConf","Toutes les places sont occupées","erreur");
      return;
    }
  }
  // vérifier si le siege est déja réservé
  for (let i = 0; i < reservations.length; i++) {
    if (reservations[i].siege === siege) {
      afficherMessage("messageConf","Ce siège est déjà occupé","erreur");
      return;
    }
  }


  //ajouter la réservation dans le tableau
  reservations.push({nom: nom,siege: siege});
  afficherPassagers();
  affichePassagerSupprim();
  compteur();



  let place = places[Number(siege) - 1];
  if (place) {
    place.classList.remove("border-slate-400", "bg-white");
    place.classList.add("border-red-500", "bg-red-50");
    let numero = place.querySelector("span");
    if (numero) {
      numero.classList.remove("text-green-500");
      numero.classList.add("text-red-500");
    }
    //status de siége
    let statut = document.createElement("span");
    statut.className = "rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600";
    statut.textContent = "Occupé";
    //creer le badge contenant le nom du passager
    let badge = document.createElement("div");
    badge.className = "flex items-center gap-1 text-xs font-medium text-gray-700";
    let profil = document.createElement("ion-icon");
    profil.setAttribute("name", "person-outline");
    let nomAffiche = document.createElement("span");
    nomAffiche.textContent = nom;
    badge.append(profil, nomAffiche);
    place.append(statut, badge);
  }
  //remove les siéges reservé
  for (let i = 0; i < siegeSelect.options.length; i++) {
    if (siegeSelect.options[i].value === siege) {
      siegeSelect.options[i].disabled = true;
    }
  }
  //afficher le message de confirmation
  afficherMessage("messageConf","Réservation confirmée " ,"succes");
  formulaire.reset();
}
formulaire.addEventListener("submit", function (e){
  e.preventDefault();
  validation();
});
nomentrer.addEventListener("input", function (){
  nomentrer.classList.remove("border-red-500");
});

//Modification de formulaire
const modificationForm = document.getElementById("modification-Form");
const passagerExistant = document.getElementById("passager-exist");
const nouvNom = document.getElementById("nv-nom");
const nvSiege = document.getElementById("nv-siege");
const messageModif = document.getElementById("messageModif");

// affichage des passagers existants
function afficherPassagers() {
  passagerExistant.innerHTML = '<option value="">Choisir un passager</option>';
  for (let i = 0; i < reservations.length; i++){
    let option = document.createElement("option");
    option.value = reservations[i].nom;
    option.textContent = reservations[i].nom;
    passagerExistant.appendChild(option);
  }
}

// afficher les siéges disponible
function afficherSiegesDisponibles(){
  nvSiege.innerHTML ='<option value="">Choisir un siège</option>';
  let ancienNom = passagerExistant.value;
  let siegeActuel = "";
    for (let i = 0; i < reservations.length; i++) {
      if (reservations[i].nom === ancienNom) {
        siegeActuel = reservations[i].siege;
        break;
      }
    }
  for (let i = 1; i <= TOTAL_SEATS; i++) {
    let numero = String(i).padStart(2, "0");
    let occupe = false;
    for (let j = 0; j < reservations.length; j++) {
      if (reservations[j].siege === numero && reservations[j].nom !== ancienNom) {
        occupe = true;
        break;
      }
    }
    if (!occupe) {
      let option = document.createElement("option");
      option.value = numero;
      option.textContent =numero === siegeActuel? "Siège " + numero + " (actuel)": "Siège " + numero;
      nvSiege.appendChild(option);
    }
  }
}

passagerExistant.addEventListener("change",function(){
  afficherSiegesDisponibles();
})
//function d'affichage les places
function afficherPlaces() {
  for (let i = 0; i < places.length; i++) {
    let numero = String(i + 1).padStart(2, "0");
    let place = places[i];
    let reservation = null;

    for (let j = 0; j < reservations.length; j++) {
      if (reservations[j].siege === numero) {
        reservation = reservations[j];
        break;
      }
    }

    // modifier la carte
    place.classList.remove("border-red-500", "bg-red-50");
    place.classList.add("border-slate-400", "bg-white");

    let numeroSiege = place.querySelector("span");
    if (numeroSiege) {
      numeroSiege.classList.remove("text-red-500");
      numeroSiege.classList.add("text-green-500");
    }

    // supprimer les anciens badges
    let badges = place.querySelectorAll("span.rounded-full, div.flex.items-center.gap-1");
    badges.forEach(function (badge) {
      badge.remove();
    });

    // si le siège est occupé
    if (reservation !== null) {
      place.classList.remove("border-slate-400", "bg-white");
      place.classList.add("border-red-500", "bg-red-50");

      if (numeroSiege) {
        numeroSiege.classList.remove("text-green-500");
        numeroSiege.classList.add("text-red-500");
      }

      let statut = document.createElement("span");
      statut.className =
        "rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600";
      statut.textContent = "Occupé";

      let badge = document.createElement("div");
      badge.className =
        "flex items-center gap-1 text-xs font-medium text-gray-700";

      let profil = document.createElement("ion-icon");
      profil.setAttribute("name", "person-outline");

      let nom = document.createElement("span");
      nom.textContent = reservation.nom;

      badge.append(profil, nom);
      place.append(statut, badge);
    }
  }
} 




//modifier la réservation
modificationForm.addEventListener("submit", function (e){
  e.preventDefault();
  let ancienNom = passagerExistant.value;
  let nomModif = nouvNom.value.trim();
  let siegeModif = nvSiege.value;

  if (ancienNom === "") {
    afficherMessage("messageModif","Choisissez un passager.", "erreur");
    return;
  }
  if (nomModif=== "") {
    afficherMessage("messageModif","Le nom est obligatoire.", "erreur");
    return;
  }
  // chercher passager
  let index = -1;
  for (let i = 0; i < reservations.length; i++){
    if (reservations[i].nom === ancienNom){
      index=i;
      break;
    }
  }
 // vérifier si le nouveau nom déja existe
 for (let j = 0; j < reservations.length; j++){
  if(reservations[j].nom.toLowerCase() === nomModif.toLowerCase() && j !== index){
    afficherMessage("messageModif","Ce nom existe déjà.", "erreur");
    return;
  }
 }
 // verifier le nouveau siège est 
  if (siegeModif !== "") {
    for (let j = 0; j < reservations.length; j++){
      if(reservations[j].siege === siegeModif && j !== index){
        afficherMessage("messageModif","Ce siège est déjà occupé.", "erreur");
        return
      }
    }
  }
 //modifier aprés la verification 
 reservations[index].nom = nomModif;
 if(siegeModif !== ""){
  reservations[index].siege = siegeModif;
 }
 afficherPlaces()
 afficherPassagers();
 afficherSiegesDisponibles();
 affichePassagerSupprim();

 afficherMessage("messageModif","Réservation modifiée avec succès.", "succes");
 modificationForm.reset();
 });




// fonction supprimmer 
const suppremForm = document.getElementById("suppremForm");
const passagerSupprem = document.getElementById("passagersupprim");
const messageSupp = document.getElementById("messageSupp");
//afficher la liste des passagers dans la formulaire supprimer un reservation
function affichePassagerSupprim(){
  console.log("Liste des réservations :", reservations);
  passagerSupprem.innerHTML = '<option value="">Choisir un passager</option>';
  for (let i = 0; i < reservations.length; i++){
    let option = document.createElement("option");
    option.value = reservations[i].nom;
    option.textContent = reservations[i].nom;
    passagerSupprem.appendChild(option);
  }
  console.log(reservations);
}

//supprimer une reservation
function supprimeReser(){
  let nom= passagerSupprem.value;
  if(nom === ""){
    afficherMessage("messageSupp","Entrer un passager","erreur");
    return;
  }
  let index =-1;
  for(let i=0;i<reservations.length;i++){
    if(reservations[i].nom ===nom){
      index =i;
      break
    }
  }
  reservations.splice(index,1);
  afficherPlaces();
  afficherPassagers();
  afficherSiegesDisponibles();
  affichePassagerSupprim();
  compteur();

  suppremForm.reset();
  afficherMessage("messageSupp","réservation supprimé avec succés","succes");
}
suppremForm.addEventListener("submit",function(e){
  e.preventDefault();
  supprimeReser();
});
affichePassagerSupprim();




// affichage message d'erreur ou de succes
function afficherMessage(id,texte,type){
  const element = document.getElementById(id);
  element.textContent=texte;
  element.classList.remove("hidden","text-red-700","text-green-700");
  if (type ==="erreur"){
    element.classList.add("text-red-700");
  }else{
    element.classList.add("text-green-700")
  }
  setTimeout(function(){
    element.classList.add("hidden")
  },2000);
}


// adapter compteur de tickits disponibles et le prix de tickit pour chancher automatiquement aprés chaque réservation ou supprission
function compteur(){

  let placesDispo =TOTAL_SEATS-reservations.length;
  let prixTotal= reservations.length * PRIX_TICKET;
  document.getElementById("places-disponibles").textContent=placesDispo;
  document.getElementById("prix-ticket").textContent=prixTotal +"DH";

}
compteur();
