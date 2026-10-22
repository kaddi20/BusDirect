
const totalSeats = 20;
const ticketPrix = 80;
const stockageKey = "busdirect_seats";
let seats = [];

const formulaire = document.getElementById("reservation-Form");
const nomInput = document.getElementById("nom");
const siegeSelect = document.getElementById("siege");
const places = document.querySelectorAll("main section .grid > div");
const message = document.getElementById("message");

let reservations = [];
function afficherMessage(texte, type) {
  message.textContent = texte;
  message.classList.remove("hidden","bg-red-100","text-red-700","bg-green-100","text-green-700");
  if (type === "erreur") {
    message.classList.add("bg-red-100", "text-red-700");
  } else {
    message.classList.add("bg-green-100", "text-green-700");
  }
}

function validation() {
  let nom = nomInput.value.trim();
  let siege = siegeSelect.value;
  if (nom === "") {
    afficherMessage("Le nom est obligatoire.", "erreur");
    return;
  }
 for (let i = 0; i < reservations.length; i++) {
  if (reservations[i].nom.toLowerCase() === nom.toLowerCase()) {
    afficherMessage("Ce passager a déjà réservé !", "erreur");
    nomInput.classList.add("border-red-500");
    return;
  }
}
  if (siege === "") {
    for (let i = 0; i < places.length; i++) {
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
    if (siege === "") {
      afficherMessage("Toutes les places sont occupées","erreur");
      return;
    }
  }

  for (let i = 0; i < reservations.length; i++) {
    if (reservations[i].siege === siege) {
      afficherMessage("Ce siège est déjà occupé","erreur");
      return;
    }
  }
  reservations.push({nom: nom,siege: siege});
  let place = places[Number(siege) - 1];
  if (place) {
    place.classList.remove("border-gray-200");
    place.classList.add("border-red-500", "bg-red-50");
    let numero = place.querySelector("span");
    if (numero) {
      numero.classList.remove("text-green-500");
      numero.classList.add("text-red-500");
    }
    let icone = place.querySelector("div");
    if (icone) {
      icone.classList.remove("bg-blue-100", "text-blue-600");
      icone.classList.add("bg-red-100", "text-red-600");
    }
    let statut = document.createElement("span");
    statut.className = "rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600";
    statut.textContent = "Occupé";
    let badge = document.createElement("div");
    badge.className = "flex items-center gap-1 text-xs font-medium text-gray-700";
    let profil = document.createElement("ion-icon");
    profil.setAttribute("name", "person-outline");
    let nomAffiche = document.createElement("span");
    nomAffiche.textContent = nom;
    badge.append(profil, nomAffiche);
    place.append(statut, badge);
  }
  for (let i = 0; i < siegeSelect.options.length; i++) {
    if (siegeSelect.options[i].value === siege) {
      siegeSelect.options[i].disabled = true;
    }
  }
  afficherMessage("Réservation confirmée pour " + nom + " - Siège " + siege,"succes");
    setTimeout(function () {
    message.classList.add("hidden");
  }, 2000);
  formulaire.reset();
}
formulaire.addEventListener("submit", function (e) {
  e.preventDefault();
  validation();
});
nomInput.addEventListener("input", function () {
  nomInput.classList.remove("border-red-500");
});

