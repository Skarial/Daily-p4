// document.addEventListener("DOMContentLoaded", function () {
//   const muteButton = document.querySelector(".btn_mute");
//   let initialCount = 0;
//   let count = 0;
//   let timerTimeout;
//   let isTimerRunning = false;
//   let isGoButtonClicked = false;
//   let isNextButtonEnabled = false;
//   let bangSound = new Audio("./src/assets/bang.wav");
//   let ticTacSound = new Audio("./src/assets/tictac2.wav");
//   const display = document.querySelector("#time");
//   const imgBombe = document.querySelector(".img_bombe");
//   const suivantButton = document.querySelector(".btn_suivant");
//   const goButton = document.querySelector(".btn_go");
//   const plusButton = document.querySelector(".btn_plus");
//   const moinsButton = document.querySelector(".btn_moins");
//   const participantForm = document.getElementById("participantsForm");
//   const participantsList = document.getElementById("participantsList");

//   let siteOpened = false;
//   let participants = [];
//   let currentParticipantIndex = 0;

//   function updateTimerDisplay() {
//     const minutes = String(Math.floor(count / 60)).padStart(2, "0");
//     const seconds = String(count % 60).padStart(2, "0");
//     display.textContent = `${minutes}:${seconds}`;
//   }

//   function handleTimerExpiration() {
//     imgBombe.src = "./P4/assets/boum.png";
//     startAudio(bangSound).then(() => {
//       bangSound.addEventListener("ended", resetTimer);
//     });

//     ticTacSound.pause();
//     ticTacSound.currentTime = 0;

//     isTimerRunning = false;

//     // Afficher le prénom du prochain participant à parler
//     currentParticipantIndex =
//       (currentParticipantIndex + 1) % participants.length;
//     displayParticipantName();
//   }

//   function resetTimer() {
//     count = initialCount;
//     isTimerRunning = false;
//     updateTimerDisplay();
//     imgBombe.src = "./src/assets/bombe.png";
//     clearTimeout(timerTimeout);
//     timerTimeout = null;

//     ticTacSound.pause();
//     ticTacSound.currentTime = 0;

//     // Réactiver les boutons "Plus 30 secondes" et "Moins 30 secondes"
//     plusButton.disabled = false;
//     moinsButton.disabled = false;
//   }

//   function startTimer(duration) {
//     function update() {
//       if (duration === 0) {
//         handleTimerExpiration();
//       } else {
//         timerTimeout = setTimeout(update, 1000);
//       }

//       const minutes = String(Math.floor(duration / 60)).padStart(2, "0");
//       const seconds = String(duration % 60).padStart(2, "0");
//       display.textContent = `${minutes}:${seconds}`;
//       duration--;
//     }

//     update();
//     startAudio(ticTacSound);

//     // Désactiver les boutons "Plus 30 secondes" et "Moins 30 secondes" lorsque le minuteur démarre
//     plusButton.disabled = true;
//     moinsButton.disabled = true;
//   }

//   plusButton.addEventListener("click", function () {
//     if (!isTimerRunning) {
//       count += 30;
//       initialCount = count;
//       updateTimerDisplay();

//       if (!siteOpened) {
//         siteOpened = true;
//         goButton.disabled = false;
//         suivantButton.disabled = true; // Bloquer le bouton "Suivant" à l'ouverture du site
//         isNextButtonEnabled = true;
//       }
//     }
//   });

//   moinsButton.addEventListener("click", function () {
//     if (!isTimerRunning && count >= 30) {
//       count -= 30;
//       initialCount = count;
//       updateTimerDisplay();

//       if (!siteOpened) {
//         siteOpened = true;
//         goButton.disabled = false;
//         suivantButton.disabled = true; // Bloquer le bouton "Suivant" à l'ouverture du site
//         isNextButtonEnabled = true;
//       }
//     }
//   });

//   function disablePlusMinusButtons() {
//     plusButton.disabled = true;
//     moinsButton.disabled = true;
//   }

//   //   function enablePlusMinusButtons() {
//   //     plusButton.disabled = false;
//   //     moinsButton.disabled = false;
//   //   }

//   goButton.addEventListener("click", function () {
//     if (!isTimerRunning && !isGoButtonClicked) {
//       startTimer(count);
//       isTimerRunning = true;
//       isGoButtonClicked = true;

//       goButton.disabled = true;
//       disablePlusMinusButtons();

//       isNextButtonEnabled = true;
//       suivantButton.disabled = !isNextButtonEnabled; // Débloquer le bouton "Suivant" après avoir cliqué sur le bouton "GO"
//     }
//   });

//   suivantButton.addEventListener("click", function () {
//     resetTimer();
//     bangSound.pause();
//     startTimer(count);

//     // Supprimer le premier élément de la liste des participants
//     participants.shift();
//     updateParticipantsList();
//   });

//   suivantButton.disabled = true;
//   goButton.disabled = true;

//   muteButton.addEventListener("click", function () {
//     if (bangSound.volume > 0 || ticTacSound.volume > 0) {
//       bangSound.volume = 0;
//       ticTacSound.volume = 0;
//     } else {
//       bangSound.volume = 1;
//       ticTacSound.volume = 0.1;
//     }
//   });

//   // Fonction pour afficher le prénom du participant actuel
//   function displayParticipantName() {
//     display.textContent = participants[currentParticipantIndex];
//   }

//   // Fonction pour démarrer la lecture audio
//   function startAudio(audio) {
//     return new Promise((resolve, reject) => {
//       audio.play().then(resolve).catch(reject);
//     });
//   }

//   // Envoi des données du formulaire au backend et mise à jour de la liste des participants
//   function sendDataToBackend(formData) {
//     fetch("http://localhost:3000/participants", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ firstName: formData.participantName }),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("La réponse du réseau n'est pas correcte");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log("Participant ajouté avec succès:", data);
//         // Ajouter le participant à la liste des participants sur le frontend
//         participants.push(formData.participantName);
//         updateParticipantsList();
//       })
//       .catch((error) => {
//         console.error("Erreur lors de l'ajout du participant:", error.message);
//       });
//   }

//   // Mettre à jour la liste des participants sur le frontend
//   function updateParticipantsList() {
//     participantsList.innerHTML = "";
//     participants.forEach((participant) => {
//       const li = document.createElement("li");
//       li.textContent = participant; // Utilisez directement le prénom du participant
//       participantsList.appendChild(li);
//     });
//   }

//   // Appelez la fonction pour afficher le formulaire lorsque le site est ouvert
//   participantForm.style.display = "block";

//   // Événement de soumission du formulaire
//   participantForm.addEventListener("submit", function (event) {
//     event.preventDefault();
//     const formData = new FormData(participantForm);
//     const participantName = formData.get("participantName");
//     if (participantName.trim() !== "") {
//       sendDataToBackend({ participantName });
//       participantForm.reset(); // Réinitialiser le formulaire après soumission
//     } else {
//       participantForm.style.display = "none"; // Cacher le formulaire si le champ est vide
//     }
//   });
// });
