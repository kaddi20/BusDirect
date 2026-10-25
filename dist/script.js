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
formulaire.addEventListener("submit", function (e) {
  e.preventDefault();
  validation();
});
nomInput.addEventListener("input", function () {
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
  setTimeout(function () {
    message.classList.add("hidden");
    }, 3000);
  }
