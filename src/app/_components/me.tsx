"use client";

import React from "react";
import { api } from "~/trpc/react";

const Me = () => {
  const { data: user } = api.auth.me.useQuery();

  return <span>{user?.name.slice(0, 2).toUpperCase()}</span>;
};

export default Me;
