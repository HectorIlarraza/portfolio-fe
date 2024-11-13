import { useEffect, useState } from "react";
import Loader from "react-loaders";
import AnimatedLetters from "../AnimatedLetters/animatedLetters";
import { getDocs, collection } from "firebase/firestore/lite";
import { db } from "../../firebase";
import { useColor } from "../../context/ColorContext";
import "./portfolio.scss";

//TODO: change the cards to have gif animation of the projects you created
//TODO: look into interactive animation for the cards as well

export const Portfolio = () => {
  const [letterClass, setLetterClass] = useState("text-animate");
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colorFilter, changeColor } = useColor();

  useEffect(() => {
    const loadData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "portfolio"));
        const portfolioData = querySnapshot.docs.map((doc) => doc.data());

        await new Promise((resolve) => setTimeout(resolve, 1500));

        setPortfolio(portfolioData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading portfolio:", error);
        setLoading(false);
      }
    };

    const letterTimer = setTimeout(() => {
      setLetterClass("text-animate-hover");
    }, 3000);

    loadData();

    return () => {
      clearTimeout(letterTimer);
    };
  }, []);

  const renderPortfolio = (portfolio) => {
    return (
      <div className="images-container">
        {portfolio.map((port, idx) => {
          return (
            <div className="image-box" key={idx}>
              <img
                className="portfolio-image"
                src={port.image}
                alt="portfolio"
              />
              <div className="content">
                <p className="title">{port.name}</p>
                <h4 className="description">{port.description}</h4>
                <button className="btn" onClick={() => window.open(port.url)}>
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="container portfolio-page">
        <h1 className="page-title" style={{ filter: colorFilter }}>
          <AnimatedLetters
            letterClass={letterClass}
            strArr={"Portfolio".split("")}
            idx={15}
          />
        </h1>
        {!loading && <div>{renderPortfolio(portfolio)}</div>}
      </div>
      <Loader type="pacman" style={{ filter: colorFilter }} />
    </>
  );
};
