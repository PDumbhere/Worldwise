import Spinner from "./Spinner";
import Message from "./message";
import styles from "./CityList.module.css";
import CityItem from "./CityItem";

function CityList({ cities, flags, isLoading }) {
  if (isLoading) return <Spinner />;
  else if (!cities?.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );
  else
    return (
      <ul className={styles.cityList}>
        {cities.map((city) => (
          <CityItem
            city={city}
            flag={flags.find((flag) => flag.country === city.country)}
            key={city.id}
          />
        ))}
      </ul>
    );
}

export default CityList;
