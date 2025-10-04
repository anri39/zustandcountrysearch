import { create } from "zustand";

type Country = {
  name: { common: string; official: string };
  flags: { png: string; svg: string };
  region: string;
  population: number;
  languages?: { [key: string]: string };
  cca3: string;
};

type UseCountryStore = {
  countries: Country[];
  filteredCountries: Country[];
  loading: boolean;
  fetchAllCountries: () => Promise<void>;
  search: string;
  setSearch: (searchWord: string) => void;
};

export const useCountryStore = create<UseCountryStore>((set, get) => ({
  countries: [],
  filteredCountries: [],
  loading: false,
  search: "",
  setSearch: (searchWord) => {
    const { countries } = get();
    set({
      search: searchWord,
      filteredCountries: countries.filter((country) => {
        return country.name.official
          .toLocaleLowerCase()
          .includes(searchWord.toLocaleLowerCase());
      }),
    });
  },
  fetchAllCountries: async () => {
    set({ loading: true });
    try {
      const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,flags,region,population,languages,cca3"
      );
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();

      set({ countries: data, filteredCountries: data, loading: false });
    } catch (err) {
      console.log("error fetching", err);
      set({ loading: false, countries: [] });
    }
  },
}));
