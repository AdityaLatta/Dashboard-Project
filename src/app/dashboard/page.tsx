"use client";

import Cookie from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useStats } from "../context/stats";
import Logout from "../_components/logout";
import BarChart from "../_components/barChart";
import LineChart from "../_components/lineChart";
import AgeGender from "../_components/ageGender";
import Loader from "../_components/loader";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import Me from "../_components/me";

export default function Dashboard() {
  const { stats } = useStats();
  const [lineData, setlineData] = useState<(number | null)[]>(stats.A);
  const router = useRouter();
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement | null>(null);

  const { mutate: logout, isSuccess } = api.auth.logout.useMutation({
    onSuccess: () => {
      toast.success("Logged out successfully");
    },
  });

  const handleClearFilters = () => {
    Cookie.remove("filters");
    router.push(pathname);

    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  const handleShareFilters = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy link to clipboard");
      });
  };

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (isSuccess) {
      router.push("/login");
      dialog.current?.close();
    }
  }, [isSuccess]); // ts-ignore

  useEffect(() => {
    setlineData(stats.A);
  }, [stats]);
  return (
    <>
      <div className="flex h-screen w-full flex-col lg:flex-row">
        <nav className="flex h-16 w-full items-center justify-between border-r-[1px] bg-gray-800 p-4 text-white lg:h-screen lg:w-64 lg:flex-col">
          <article className="text-2xl -tracking-[-9px]">DashBoard</article>
          <button
            onClick={() => dialog.current?.showModal()}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-600 duration-700 hover:translate-x-2 lg:w-[90%] lg:justify-between lg:rounded-s-full lg:pl-1 lg:pr-5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800">
              <Me />
            </div>
            <div className="hidden lg:block">Log-Out</div>
          </button>
          <Logout dialog={dialog}>
            <div className="w-full text-right">
              <button onClick={() => dialog.current?.close()}>Close</button>
              <button className="ml-4" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </Logout>
        </nav>
        <section className="grid h-fit w-full grid-cols-12 grid-rows-12 gap-4 bg-slate-200 p-4 lg:h-full lg:w-[calc(100vw-256px)]">
          <div className="relative col-span-12 row-span-12 h-full md:col-span-6">
            <BarChart setlineData={setlineData} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {stats.isLoading && <Loader />}
            </div>
          </div>
          <div className="relative col-span-12 row-span-12 h-full md:col-span-6">
            <LineChart lineData={lineData} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {stats.isLoading && <Loader />}
            </div>
          </div>
          <AgeGender />
          <div className="col-span-12 row-span-12 h-full rounded-lg bg-white p-4 shadow-lg md:col-span-6">
            <button
              className="flex w-full items-center justify-center rounded-lg bg-gray-600 px-4 py-2 text-white"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
            <button
              className="mt-2 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white"
              onClick={handleShareFilters}
            >
              Share Filters
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
