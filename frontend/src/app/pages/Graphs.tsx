/* eslint-disable */
// @ts-nocheck

import React, { useState, useEffect } from "react";
import { useGetAgeStatsQuery, useGetProfessionsStatsQuery, useGetSexStatsQuery } from "../services/api";
import { WordCloud, Line } from "@ant-design/charts";

export const Graphs = () => {

  const { data } = useGetSexStatsQuery();

  return (
    <div className="w-full min-h-screen">
      <div className="w-full">
        <h1 className="text-mobile-h2 sm:text-h2 text-left pt-4 pl-4">Статистика по возрасту</h1>
        <DemoLine />
      </div>
      <div>
        <h1 className="text-mobile-h2 sm:text-h2 text-left pt-4 pl-4">Облако слов по популярности среди пользователей: </h1>
        <DemoWordCloud />
      </div>
    </div>
  );
};

export const DemoWordCloud = () => {

  const { data } = useGetProfessionsStatsQuery();

  const config = {
    data: {
      value: data,
    },
    layout: { spiral: 'rectangular' },
    colorField: 'text',
    backgroundColor: '#f30000',
    tooltip: { visible: true, offset: 10 },
  };
  return <WordCloud {...config} />;
};

export const DemoLine = () => {

  const { data } = useGetAgeStatsQuery();

  const config = {
    data: data,
    xField: 'age',
    yField: 'cnt',
    point: {
      shapeField: 'square',
    },
    interaction: {
      tooltip: {
        marker: false,
      },
    },
    style: {
      lineWidth: 2,
    },
  };
  return <Line {...config} />;
};