import { useEffect, useReducer } from "react";
import styles from "./CityItem.module.css";
import Spinner from "./Spinner";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

// function reducer(state, action) {
//   switch (action.type) {
//     case "flag":
//       return { ...state, flag: action.payload };
//     case "setIsFlagLoading":
//       return { ...state, isFlagLoading: action.payload };
//     default:
//       throw Error("action unknown");
//   }
// }

// const API_KEY = "bhehM6GqnkQXGaFYONWQAA==vnGd2bIvFTOasE5i";
// const COUNTRY_CODE_API_LINK = "https://api.api-ninjas.com/v1/country?";

function CityItem({ city, flag }) {
  // const [{ flag, isFlagLoading }, dispatch] = useReducer(reducer, {
  //   flag: "",
  //   isFlagLoading: false,
  // });

  // useEffect(
  //   function () {
  //     async function getCountryCode() {
  //       try {
  //         dispatch({ type: "setIsFlagLoading", payload: true });
  //         const res = await fetch(
  //           `${COUNTRY_CODE_API_LINK}name=${city.country}`,
  //           {
  //             method: "GET",
  //             headers: { "X-Api-Key": API_KEY },
  //           }
  //         );
  //         const data = await res.json();
  //         console.log(data[0]);
  //         const flag_api = `https://flagsapi.com/${data[0].iso2}/shiny/32.png`;
  //         dispatch({ type: "flag", payload: flag_api });
  //       } catch {
  //         alert("Error loading country flag");
  //       } finally {
  //         dispatch({ type: "setIsFlagLoading", payload: false });
  //       }
  //     }
  //     getCountryCode();
  //   },
  //   [city.country]
  // );
  console.log(city);
  console.log(flag);
  const { cityName, emoji, date } = city;
  return (
    <li className={styles.cityItem}>
      {/* <span className={styles.emoji}>{emoji}</span> */}

      <img src={flag?.flagApi} alt={emoji} />

      <h3 className={styles.name}>{cityName}</h3>
      <time className={styles.date}>({formatDate(date)})</time>
      <button className={styles.deleteBtn}>&times;</button>
    </li>
  );
}

export default CityItem;
