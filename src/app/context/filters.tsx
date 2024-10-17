"use client";
import Cookies from "js-cookie";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

type Filters = {
  filters: {
    startDate: Date;
    endDate: Date;
    age: number;
    gender: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      startDate: Date;
      endDate: Date;
      age: number;
      gender: string;
    }>
  >;
};

export const FiltersContext = React.createContext<Filters | null>(null);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  let savedFilters = Cookies.get("filters");
  let data = savedFilters
    ? JSON.parse(savedFilters)
    : {
        startDate: moment("2022-10-10").startOf("day").toDate(),
        endDate: moment("2022-10-20").startOf("day").toDate(),
        age: 20,
        gender: "male",
      };

  const start =
    searchParams.size > 0
      ? moment(searchParams.get("startDate")!).startOf("day").toDate()
      : moment(data.startDate).startOf("day").toDate();

  const end =
    searchParams.size > 0
      ? moment(searchParams.get("endDate")!).startOf("day").toDate()
      : moment(data.endDate).startOf("day").toDate();

  const [filters, setFilters] = useState({
    startDate: start,
    endDate: end,
    age: Number(searchParams.get("age")) || Number(data.age),
    gender: searchParams.get("gender") || data.gender,
  });

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters(): {
  filters: Filters["filters"];
  setFilters: Filters["setFilters"];
} {
  let data = React.useContext(FiltersContext);

  if (!data) {
    throw new Error("useFilters must be used within a FiltersProvider");
  }

  return data;
}
