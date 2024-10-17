"use client";
import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { useFilters } from "./filters";

type Stats = {
  keys: Array<string | null>;
  values: Array<number | null>;
  dates: Array<string | null>;
  A: Array<number | null>;
  B: Array<number | null>;
  C: Array<number | null>;
  D: Array<number | null>;
  E: Array<number | null>;
  F: Array<number | null>;
  isLoading: boolean;
};

const StatsContext = React.createContext<{ stats: Stats } | null>(null);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setstats] = useState<Stats>({
    keys: [],
    values: [],
    dates: [],
    A: [],
    B: [],
    C: [],
    D: [],
    E: [],
    F: [],
    isLoading: true,
  });

  const { filters } = useFilters();

  // console.log(filters);

  const { data, isSuccess, isPending } = api.dashboardData.getData.useQuery({
    startDate: filters.startDate,
    endDate: filters.endDate,
    age: filters.age,
    gender:
      filters.gender === "male" || filters.gender === "female"
        ? filters.gender
        : "male",
  });

  useEffect(() => {
    if (isPending) {
      setstats({
        keys: [],
        values: [],
        dates: [],
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        F: [],
        isLoading: true,
      });
    } else {
      setstats({
        keys: [],
        values: [],
        dates: [],
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        F: [],
        isLoading: false,
      });
    }
  }, [isPending]);

  useEffect(() => {
    if (!data) return;

    const keys = Object.keys(data.data._sum);
    const values = Object.values(data.data._sum);

    setstats({
      keys: keys,
      values: values,
      dates: data.dates,
      A: data.A,
      B: data.B,
      C: data.C,
      D: data.D,
      E: data.E,
      F: data.F,
      isLoading: false,
    });

    return () => {
      setstats({
        keys: [],
        values: [],
        dates: [],
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        F: [],
        isLoading: false,
      });
    };
  }, [isSuccess, data]);

  return (
    <StatsContext.Provider value={{ stats: stats }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats(): { stats: Stats } {
  const data = React.useContext(StatsContext);

  if (!data) {
    throw new Error("useStats must be used within a StatsProvider");
  }

  return data;
}

export default StatsContext;
