
const totalSeats = 20;
const ticketPrix = 80;
const stockageKey = "busdirect_seats";
let seats = [];

const formulaire = document.getElementById("reservation-Form");
const nomInput = document.getElementById("nom");
const siegeSelect = document.getElementById("siege");

const places = document.querySelectorAll("main section .grid > div");

let reservations = [];

function validation() {
  let nom = nomInput.value.trim();
  let siege = siegeSelect.value;

  if (nom === "") {
    alert("Le nom est obligatoire");
    return;
  }

  for (let i = 0; i < reservations.length; i++) {
    if (reservations[i].nom.toLowerCase() === nom.toLowerCase()) {
      alert("Ce passager a déjà réservé !");
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
      alert("Toutes les places sont occupées !");
      return;
    }
  }

  for (let i = 0; i < reservations.length; i++) {
    if (reservations[i].siege === siege) {
      alert("Ce siège est déjà occupé !");
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

  alert("Réservation confirmée pour " + nom + " - Siège " + siege);

  formulaire.reset();
}
formulaire.addEventListener("submit", function (e) {
  e.preventDefault();
  validation();
});