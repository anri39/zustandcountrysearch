import "./App.css";
import { Flag, Globe, Users, MessageCircle } from "lucide-react";
import { useCountryStore } from "./store/CountryStore";
import { useEffect, useState } from "react";

function App() {
  const { loading, fetchAllCountries, search, setSearch, filteredCountries } =
    useCountryStore();

  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    fetchAllCountries();
  }, [fetchAllCountries]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch); // added localsearch because bad performance when deleting
    }, 200);
    return () => clearTimeout(timer); // clean up function
  }, [localSearch, setSearch]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="wrapper">
      <div className="search">
        <input
          type="text"
          placeholder="Search for countries..."
          value={localSearch}
          onChange={(e) => {
            setLocalSearch(e.target.value);
          }}
        />
      </div>

      <div className="showcountries">
        {filteredCountries.map((country) => (
          <div
            className="country"
            key={country.cca3}
            style={{ cursor: "pointer" }}
          >
            <img src={country.flags.png} alt={`${country.name.common} flag`} />

            <div>
              <p>
                <Flag size={18} /> {country.name.common}
              </p>
              <p>
                <Globe size={16} /> {country.region}
              </p>
              <p>
                <Users size={16} /> {country.population.toLocaleString()}
              </p>
              <p>
                <MessageCircle size={16} />{" "}
                {Object.values(country.languages || {}).join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
