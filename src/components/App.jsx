import React from "react";
import "./App.css";
import { Gamepad2, Monitor, Rocket, Heart } from "lucide-react";
import CardBackground from "./card/CardBackground.jsx";
import Content from "./content/Content.jsx";
import Materi1 from "./materi/Materi1.jsx";
import Materi2 from "./materi/Materi2.jsx";
import Game1 from "./game/Game1.jsx";
import Game2 from "./game/Game2.jsx";
import Game3 from "./game/Game3.jsx";
import Image from "../assets/Image.jsx";
import Quiz from "./game/Quiz.jsx";
import { provinces, categories } from "./game/data";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const content = [
  {
    title: "SPIDER-MAN 2",
    image: Image.Poster1,
    platform: "PlayStation 5",
    release_date: "October 20, 2023",
    genre: "Fighting game, Action-adventure game",
  },
  {
    title: "ELDEN RING",
    image: Image.Poster2,
    platform: "PlayStation, Xbox, Microsoft Windows",
    release_date: "February 25, 2022",
    genre: "RPG, Dark Fantasy, Open World",
  },
  {
    title: "It Takes Two",
    image: Image.Poster3,
    platform: "PlayStation, Xbox, Nitendo, Microsoft Windows",
    release_date: "March 26, 2021",
    genre: "Co-op, Multiplayer, Split Screen",
  },
  {
    title: "The Legend of Zelda Breath of The Wild",
    image: Image.Poster4,
    platform: "Nitendo Switch, Wii U",
    release_date: "March 3, 2017",
    genre: " Action-adventure game, Puzzle Video Game",
  },
  {
    title: "Super Mario Bros. Wonder",
    image: Image.Poster5,
    platform: "Nintendo Switch",
    release_date: "October 20, 2023",
    genre: "Platform game",
  },
  {
    title: "Clash of Clans",
    image: Image.Poster6,
    platform: "Android, iOS",
    release_date: "August 2, 2012",
    genre: "Real-time strategy",
  },
];

function App() {
  const handleToast = (isCorrect, message) => {
    if (isCorrect) {
      toast.success(message, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    } else {
      toast.error(message, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    }
  };

  return (
    <>
      <div className="container container-landing">
        <div className="contentLandingPage">
          <h1 className="text-center judul">Nusa Game Center</h1>
          <p className="text">
            Unleash Your Playful Spirit at Nusa Game Center
          </p>
        </div>

        <Gamepad2 className="iconGamePad" size={32} />
        <Monitor className="iconGameConsole" size={32} />
        <Heart className="iconHealthPotion" size={32} />
        <Rocket className="iconRocket" size={32} />
      </div>

      <div className="container container-content">
        <h1 className="judulContent">Game 1</h1>
        <CardBackground>
          <Game1 />
        </CardBackground>
      </div>

      <div className="container container-content">
        <h1 className="judulContent">Game Tic Tac Toe</h1>
        <CardBackground>
          <Game2 />
        </CardBackground>
      </div>

      <div className="container container-content">
        <h1 className="judulContent">Game Tebak Kata Nusantara</h1>
        <CardBackground>
          <Game3 />
        </CardBackground>
      </div>

      <div className="container container-content">
        <h1 className="judulContent">Game Budaya Indonesia</h1>
        <CardBackground>
          <Quiz categories={categories} onToast={handleToast} />
        </CardBackground>
      </div>

      <ToastContainer />
    </>
  );
}

export default App;