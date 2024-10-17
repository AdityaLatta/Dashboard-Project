import Cookie from "js-cookie";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFilters } from "../context/filters";
import DateRangePicker from "./dateRangePicker";

type QueryData = {
  startDate: Date;
  endDate: Date;
  age: number;
  gender: string;
};

const AgeGender = () => {
  const { filters, setFilters } = useFilters();
  const [queryData, setqueryData] = useState<QueryData>(filters);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    setqueryData({
      ...filters,
      age: e.target.name === "age" ? parseInt(e.target.value) : queryData.age,
      gender: e.target.name === "gender" ? e.target.value : queryData.gender,
    });
  };

  const handleSubmit = () => {
    Cookie.set("filters", JSON.stringify(queryData));
    setFilters(queryData);
  };

  useEffect(() => {
    const cookieData = Cookie.get("filters");
    if (!cookieData) return;

    const parsed = JSON.parse(cookieData);
    if (parsed) {
      const params = new URLSearchParams(searchParams);

      params.set("startDate", parsed.startDate);
      params.set("endDate", parsed.endDate);
      params.set("age", parsed.age.toString());
      params.set("gender", parsed.gender);

      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [handleSubmit]);

  return (
    <>
      <div className="col-span-12 row-span-12 h-full space-y-6 rounded-lg bg-white p-4 shadow-lg md:col-span-6">
        <div className="text-center text-lg font-bold text-gray-500">
          Filters
        </div>

        <div className="flex items-center justify-between">
          <div>Age - </div>

          <div className="flex gap-4">
            <div className="flex gap-2">
              <input
                type="radio"
                id="age-1"
                name="age"
                value="20"
                checked={queryData.age === 20}
                onChange={handleOption}
              />
              <label htmlFor="age-1">15-25</label>
            </div>

            <div className="flex gap-2">
              <input
                type="radio"
                id="age-2"
                name="age"
                value="27"
                checked={queryData.age === 27}
                onChange={handleOption}
              />
              <label htmlFor="age-2">&gt;25</label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>Gender - </div>

          <div className="flex gap-4">
            <div className="flex gap-2">
              <input
                type="radio"
                id="gender-1"
                name="gender"
                value="male"
                checked={queryData.gender === "male"}
                onChange={handleOption}
              />
              <label htmlFor="gender-1">Male</label>
            </div>

            <div className="flex gap-2">
              <input
                type="radio"
                id="gender-2"
                name="gender"
                value="female"
                checked={queryData.gender === "female"}
                onChange={handleOption}
              />
              <label htmlFor="gender-2">Female</label>
            </div>
          </div>
        </div>

        <DateRangePicker queryData={queryData} setqueryData={setqueryData} />

        <div className="flex justify-center">
          <button
            className="w-[60%] rounded-lg bg-blue-500 px-4 py-2 text-white"
            onClick={() => handleSubmit()}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default AgeGender;
