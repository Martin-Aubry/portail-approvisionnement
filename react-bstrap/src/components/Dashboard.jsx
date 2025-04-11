import React from "react";
import ReactECharts from "echarts-for-react";
import GanttChart from "./GanttChart";

const Dashboard = () => {
  const barOptions = {
    title: {
      text: "Demandes par statut",
    },
    tooltip: {},
    xAxis: {
      data: ["En planification", "Soumis", "Approuvé"],
    },
    yAxis: {},
    series: [
      {
        name: "Nombre",
        type: "bar",
        data: [5, 3, 8], // données bidons
      },
    ],
  };

  const pieOptions = {
    title: {
      text: "Répartition des demandes",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "0%",
      left: "center",
    },
    series: [
      {
        name: "Statuts",
        type: "pie",
        radius: "50%",
        data: [
          { value: 5, name: "En planification" },
          { value: 3, name: "Soumis" },
          { value: 8, name: "Approuvé" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  var option;

  // There should not be negative values in rawData
  const rawData = [
    [100, 302, 301, 334, 390, 330, 320],
    [320, 132, 101, 134, 90, 230, 210],
    [220, 182, 191, 234, 290, 330, 310],
    [150, 212, 201, 154, 190, 330, 410],
    [820, 832, 901, 934, 1290, 1330, 1320],
  ];
  const totalData = [];
  for (let i = 0; i < rawData[0].length; ++i) {
    let sum = 0;
    for (let j = 0; j < rawData.length; ++j) {
      sum += rawData[j][i];
    }
    totalData.push(sum);
  }
  const grid = {
    left: 100,
    right: 100,
    top: 50,
    bottom: 50,
  };
  const series = [
    "Direct",
    "Mail Ad",
    "Affiliate Ad",
    "Video Ad",
    "Search Engine",
  ].map((name, sid) => {
    return {
      name,
      type: "bar",
      stack: "total",
      barWidth: "60%",
      label: {
        show: true,
        formatter: (params) => Math.round(params.value * 1000) / 10 + "%",
      },
      data: rawData[sid].map((d, did) =>
        totalData[did] <= 0 ? 0 : d / totalData[did]
      ),
    };
  });
  option = {
    legend: {
      selectedMode: false,
    },
    grid,
    yAxis: {
      type: "value",
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    series,
  };

  return (
    <div className="container-fluid mt-4">
      <h3>Tableau de bord</h3>
      <div className="row">
        <div className="col-md-3">
          <ReactECharts option={barOptions} />
        </div>
        <div className="col-md-3">
          <ReactECharts option={pieOptions} />
        </div>
        <div className="col-md-6">
          <ReactECharts option={option} />
        </div>
      </div>
      <div className="container-fluid mt-4">
        <h2>Tableau de bord</h2>
        <GanttChart />
      </div>
    </div>
  );
};

export default Dashboard;
