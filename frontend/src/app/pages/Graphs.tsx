/* eslint-disable */
// @ts-nocheck

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { useGetAgeStatsQuery, useGetSexStatsQuery } from "../services/api";

export const Graphs = () => {
  const [genderData, setGenderData] = useState([
    {
      name: "Женщины",
      value: Math.floor(Math.random() * 100),
    },
    {
      name: "Мужчины",
      value: Math.floor(Math.random() * 100),
    },
  ]);

  const { data } = useGetSexStatsQuery();
  const { data: ageData } = useGetAgeStatsQuery();
  console.log(data);
  console.log(ageData);

  return (
    <div className="w-full mx-auto flex flex-col justify-center items-center mt-10">
      <h1>Статистика по возрасту</h1>
      <LineChart width={900} height={300} data={ageData}>
        <XAxis dataKey="age" />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="cnt" stroke="#0d00ff" />
        <Tooltip />
        <Legend />
      </LineChart>
    </div>
  );
};
