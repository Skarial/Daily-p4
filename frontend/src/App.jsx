import React from "react";
import Formulaire from "./Formulaire";
import "./css/App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      participants: [],
      currentParticipantIndex: 0,
      isTimerRunning: false,
      timerInterval: null,
      ticTacSound: new Audio("./src/assets/tictac2.wav"),
      bangSound: new Audio("./src/assets/bang.wav"),
      initialCount: 0,
      isGoButtonClicked: false, // Nouvel état pour suivre si le bouton "GO" a été cliqué
      isNextButtonClicked: false,
      isFormVisible: true,
    };
  }
  // Vos autres méthodes de classe ici

  componentDidMount() {
    const { ticTacSound } = this.state;
    ticTacSound.loop = true; // Loop tic-tac sound
  }

  updateTimerDisplay = () => {
    const { count } = this.state;
    if (count <= 0) {
      return "00:00";
    }
    const minutes = Math.floor(count / 60);
    const seconds = count % 60;
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
    return formattedTime;
  };

  handleMuteButtonClick = () => {
    const { ticTacSound, bangSound } = this.state;
    ticTacSound.muted = !ticTacSound.muted;
    bangSound.muted = !bangSound.muted;
  };

  handlePlus30SecondsClick = () => {
    this.setState((prevState) => ({
      count: Math.max(prevState.count + 30, 0), // Assure que le compteur ne devient pas négatif
      initialCount: Math.max(prevState.initialCount + 30, 0), // Met à jour initialCount
    }));
  };

  handleGoButtonClick = () => {
    const { isGoButtonClicked, count } = this.state;
    if (!isGoButtonClicked && count !== 0) {
      this.setState(
        { isGoButtonClicked: true, initialCount: count, previousCount: count },
        () => {
          // console.log("Initial count:", this.state.initialCount);
          this.startTimer(this.state.initialCount);
        }
      );
    }
  };

  handleNextButtonClick = () => {
    const {
      previousCount,
      isGoButtonClicked,
      currentParticipantIndex,
      participants,
      isNextButtonClicked,
    } = this.state;

    if (isGoButtonClicked && previousCount !== null) {
      const { ticTacSound } = this.state;

      clearInterval(this.state.timerInterval);
      ticTacSound.pause();
      ticTacSound.currentTime = 0;

      this.setState({
        count: previousCount,
        isTimerRunning: true,
        bangOccurred: false,
      });

      this.startTimer(previousCount);
    }

    // Barrer le prénom du participant actuel
    const updatedParticipants = participants.map((participant, index) =>
      index === currentParticipantIndex ? <s>{participant}</s> : participant
    );
    this.setState({ participants: updatedParticipants });

    // Mettre à jour l'état isNextButtonClicked
    this.setState({ isNextButtonClicked: true });

    // Passer au participant suivant s'il y en a un
    if (currentParticipantIndex < participants.length - 1) {
      this.setState({ currentParticipantIndex: currentParticipantIndex + 1 });
    }
  };

  handleMinus30SecondsClick = () => {
    this.setState((prevState) => ({
      count: Math.max(prevState.count - 30, 0), // Assure que le compteur ne devient pas négatif
      initialCount: Math.max(prevState.initialCount - 30, 0), // Met à jour initialCount
    }));
  };

  startTimer = (duration) => {
    // console.log("Duration:", duration);
    const { ticTacSound } = this.state;
    let count = duration;
    const timerInterval = setInterval(() => {
      count--;
      this.setState({ count });
      if (count <= 0) {
        clearInterval(timerInterval);
        this.handleTimerExpiration();
      }
    }, 1000);

    this.setState({ timerInterval, count, isTimerRunning: true });
    ticTacSound.play(); // Start tic-tac sound
  };

  handleTimerExpiration = () => {
    const { bangSound } = this.state;
    bangSound.play();
    // Mettre à jour l'état pour indiquer que le bang s'est produit
    this.setState({ bangOccurred: true });
    // Arrêter le son tic tac
    this.state.ticTacSound.pause();
    this.state.ticTacSound.currentTime = 0; // Rembobiner le son pour la prochaine lecture
    // Logique pour le participant suivant...
  };

  handleParticipantAddition = (participantName) => {
    // Ajoutez ici la logique pour ajouter le participant à votre liste de participants
    console.log("Ajout de participant :", participantName);
    this.setState((prevState) => ({
      participants: [...prevState.participants, participantName],
    }));
  };

  render() {
    const {
      bangOccurred,
      isGoButtonClicked,
      participants,
      currentParticipantIndex,
      isFormVisible,
    } = this.state;
    return (
      <section className="container_game">
        <header>
          <h1 className="titre">DAILY CROCKET</h1>
          <h2 className="paragraphe">
            Ceci n&apos;est pas un exercice, je répète, ceci n&apos;est pas un
            exercice!!!
          </h2>
        </header>
        <section className="media">
          {bangOccurred ? (
            <img className="img_boum" src="../src/assets/boum.png" alt="Boum" />
          ) : (
            <img
              className="img_bombe"
              src="../src/assets/bombe.webp"
              alt="Bombe"
            />
          )}
          <audio src="../src/assets/bang.wav" id="explosionSound"></audio>
          <audio src="../src/assets/tictac2.wav" id="ticTacSound"></audio>
        </section>
        <section className="time_chrono">
          <div className="timer">{this.updateTimerDisplay()}</div>

          <div>
            <button
              className="btn_mute btn"
              onClick={this.handleMuteButtonClick}
            >
              Mute
            </button>
          </div>
        </section>
        <section className="time_btn">
          <button
            className="btn_moins btn"
            onClick={this.handleMinus30SecondsClick}
            disabled={this.state.isTimerRunning}
          >
            -30s
          </button>
          <button className="btn_go btn" onClick={this.handleGoButtonClick}>
            GO
          </button>
          <button
            className="btn_suivant btn"
            onClick={this.handleNextButtonClick}
            disabled={!isGoButtonClicked} // Désactive le bouton si isGoButtonClicked est false
          >
            {">"}
          </button>
          <button
            className="btn_plus btn"
            onClick={this.handlePlus30SecondsClick}
            disabled={this.state.isTimerRunning}
          >
            +30s
          </button>
        </section>
        <section className="blaze">
          <footer>
            <p>&copy;Skarial</p>
          </footer>
        </section>

        <Formulaire onSubmit={this.handleParticipantAddition} />
        <ol className="name_participant">
          {participants.map((participant, index) => (
            <li
              key={index}
              className={index <= currentParticipantIndex ? "passed" : ""}
            >
              {participant}
            </li>
          ))}
        </ol>
      </section>
    );
  }
}

export default App;
