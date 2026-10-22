
const formulaire = document.getElementById("reservation-Form");
const nom = document.getElementById("nom");
const siege = document.getElementById("siege");

formulaire.addEventListener("submit", function(e) {
  e.preventDefault();
  if (nom.value === "") {
    alert("Veuillez saisir le nom du passager");
    return;
  }
  if (siege.value === "") {
    alert("Veuillez sélectionner un siège");
    return;
  }
  alert("Formulaire valide ");
});
