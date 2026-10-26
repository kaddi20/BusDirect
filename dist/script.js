const TOTAL_SEATS = 20;
let reservations = [];


const formulaire = document.getElementById("reservation-Form");
const nomInput = document.getElementById("nom");
const siegeSelect = document.getElementById("siege");
const places = document.querySelectorAll("#liste-sieges > div");
const message = document.getElementById("message");

// validation de formulaire
function validation() {
  let nom = nomInput.value.trim();
  let siege = siegeSelect.value;
  if (nom === "") {
    afficherMessage("Le nom est obligatoire.", "erreur");
    return;
  }
// vérifier si il ya un résirvation avec meme nom
 for (let i = 0; i < reservations.length; i++) {
  if (reservations[i].nom.toLowerCase() === nom.toLowerCase()) {
    afficherMessage("Ce passager a déjà réservé !", "erreur");
    nomInput.classList.add("border-red-500");
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
      afficherMessage("Toutes les places sont occupées","erreur");
      return;
    }
  }
  // vérifier si le siege est déja réservé
  for (let i = 0; i < reservations.length; i++) {
    if (reservations[i].siege === siege) {
      afficherMessage("Ce siège est déjà occupé","erreur");
      return;
    }
  }
  //ajouter la réservation dans le tableau
  reservations.push({nom: nom,siege: siege});
  afficherPassagers();

  let place = places[Number(siege) - 1];
  if (place) {
    place.classList.remove("border-slate-400", "bg-white");
    place.classList.add("border-red-500", "bg-red-50");
    let numero = place.querySelector("span");
    if (numero) {
      numero.classList.remove("text-green-500");
      numero.classList.add("text-red-500");
    }

   //changer la couleur de l'icone
    let icone = place.querySelector("div");
    if (icone) {
      icone.classList.remove("bg-green-200");
      icone.classList.add("bg-red-100", "text-red-600");
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
  //désactiver les siéges résérvé
  for (let i = 0; i < siegeSelect.options.length; i++) {
    if (siegeSelect.options[i].value === siege) {
      siegeSelect.options[i].disabled = true;
    }
  }
  //afficher le message de confirmation
  afficherMessage("Réservation confirmée pour " + nom + " - Siège " + siege,"succes");

  formulaire.reset();
}
formulaire.addEventListener("submit", function (e){
  e.preventDefault();
  validation();
});
nomInput.addEventListener("input", function (){
  nomInput.classList.remove("border-red-500");
});
// affiche message d'erreur
function afficherMessage(texte, type) {
  message.textContent = texte;
  message.classList.remove("hidden");
  if (type === "erreur") {
    message.classList.add("bg-red-100", "text-red-700");
    message.classList.remove("bg-green-100", "text-green-700");
  }
  else{
    message.classList.add("bg-green-100", "text-green-700");
    message.classList.remove("bg-red-100", "text-red-700");
  }
  setTimeout(function (){
    message.classList.add("hidden");
  }, 3000);
}



//Modification de formulaire
const modificationForm = document.getElementById("modification-Form");
const passagerExistant = document.getElementById("passager-existant");
const nouveauNom = document.getElementById("nv-nom");
const nouveauSiege = document.getElementById("nouveau-siege");

//message d'erreur ou succés
const messageModification = document.getElementById("message-modification");
function afficherMessageModif(texte, type) {
  messageModification.textContent = texte;
  messageModification.classList.remove("hidden","bg-red-100","text-red-700","bg-green-100","text-green-700");
  if (type === "erreur") {
    messageModification.classList.add("bg-red-100", "text-red-700");
  } else {
    messageModification.classList.add("bg-green-100", "text-green-700");
  }
  setTimeout(function () {
    messageModification.classList.add("hidden");
  }, 3000);
}

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
  nouveauSiege.innerHTML ='<option value="">Choisir un siège</option>';
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
      if (
        reservations[j].siege === numero &&
        reservations[j].nom !== ancienNom
      ) {
        occupe = true;
        break;
      }
    }

    if (!occupe) {
      let option = document.createElement("option");
      option.value = numero;
      option.textContent =
        numero === siegeActuel
          ? "Siège " + numero + " (actuel)"
          : "Siège " + numero;

      nouveauSiege.appendChild(option);
    }
  }
}

//

function afficherPlaces() {
  for (let i = 0; i < places.length; i++) {
    let numero = String(i + 1).padStart(2, "0");
    let place = places[i];

    // Chercher une réservation pour ce siège
    let reservation = null;

    for (let j = 0; j < reservations.length; j++) {
      if (reservations[j].siege === numero) {
        reservation = reservations[j];
        break;
      }
    }

    // Réinitialiser la carte
    place.classList.remove("border-red-500", "bg-red-50");
    place.classList.add("border-slate-400", "bg-white");

    let numeroSiege = place.querySelector("span");
    if (numeroSiege) {
      numeroSiege.classList.remove("text-red-500");
      numeroSiege.classList.add("text-green-500");
    }

    // Supprimer les anciens badges
    let badges = place.querySelectorAll("span.rounded-full, div.flex.items-center.gap-1");
    badges.forEach(function (badge) {
      badge.remove();
    });

    // Si le siège est occupé
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
  let nomModifie = nouveauNom.value.trim();
  let siegeModifie = nouveauSiege.value;

  if (ancienNom === "") {
    afficherMessageModif("Choisissez un passager.", "erreur");
    return;
  }
  if (nomModifie === "") {
    afficherMessageModif("Le nom est obligatoire.", "erreur");
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
  if(index=== -1){
    afficherMessageModif("Passager introuvable.", "erreur");
    return;
  }
 // vérifier si le nouveau nom déja existe
 for (let j = 0; j < reservations.length; j++){
  if(reservations[j].nom.toLowerCase() === nomModifie.toLowerCase() && j !== index){
    afficherMessageModif("Ce nom existe déjà.", "erreur");
    return;
  }
 }
 // verifier le nouveau siège est 
  if (siegeModifie !== "") {
    for (let j = 0; j < reservations.length; j++){
      if(reservations[j].siege === siegeModifie && j !== index){
        afficherMessageModif("Ce siège est déjà occupé.", "erreur");
        return
      }
    }
  }
 //modifier aprés la verification 
 reservations[index].nom = nomModifie;
 if(siegeModifie !== ""){
  reservations[index].siege = siegeModifie;
 }
 afficherPlaces()
 afficherPassagers();
 afficherSiegesDisponibles();

 afficherMessageModif("Réservation modifiée avec succès.", "succes");
 modificationForm.reset();
 });
