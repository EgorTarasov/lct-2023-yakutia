/* eslint-disable */
// @ts-nocheck

import React, { useState, useEffect } from "react";
import { useGetAgeStatsQuery, useGetProfessionsStatsQuery, useGetSexStatsQuery } from "../services/api";
import { WordCloud, Line, Pie } from "@ant-design/charts";

export const Graphs = () => {

  const { data } = useGetSexStatsQuery();

  return (
    <div className="w-full min-h-screen">
      <div className="w-full">
        <h1 className="text-mobile-h2 sm:text-h2 text-left pt-4 pl-4">Статистика по возрасту</h1>
        <DemoLine />
      </div>
      <div>
        <h1 className="text-mobile-h2 sm:text-h2 text-left pt-4 pl-4">Статистика по популярным профессиям: </h1>
        <DemoPie />
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
    width: 500,
    height: 500,
    tooltip: {
      title: (d) => (d.cnt > 100 ? d.name : d.text), // transform
    }
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

export const DemoPie = () => {

  const { data } = useGetProfessionsStatsQuery();

  console.log(data);
  const formattedData = [];

  for (const dataItem of data) {
    const formattedItem = {
      type: dataItem.text,
      value: dataItem.value,
    };

    formattedData.push(formattedItem);
  }
  const config = {
    appendPadding: 10,
    data: formattedData,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
  };
  return <Pie {...config} />;
};