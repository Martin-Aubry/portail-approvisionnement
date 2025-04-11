import { useEffect, useRef } from "react";

const GanttChart = () => {
  const chartRef = useRef(null); // pour cibler le conteneur

  const toMilliseconds = (minutes) => minutes * 60 * 1000;

  const drawChart = () => {
    const container = chartRef.current;

    if (!container || container.offsetParent === null) {
      console.warn("⛔️ Le conteneur du Gantt n'est pas encore visible.");
      return;
    }

    const data = new window.google.visualization.DataTable();
    data.addColumn("string", "Task ID");
    data.addColumn("string", "Task Name");
    data.addColumn("string", "Resource");
    data.addColumn("date", "Start");
    data.addColumn("date", "End");
    data.addColumn("number", "Duration");
    data.addColumn("number", "Percent Complete");
    data.addColumn("string", "Dependencies");

    data.addRows([
      [
        "toTrain",
        "Préparation",
        "walk",
        null,
        null,
        toMilliseconds(5),
        100,
        null,
      ],
      [
        "music",
        "Projet d'appel d'offres",
        "music",
        null,
        null,
        toMilliseconds(70),
        50,
        null,
      ],
      [
        "wait",
        "Sur le marché",
        "wait",
        null,
        null,
        toMilliseconds(40),
        70,
        "toTrain",
      ],
      [
        "train",
        "Analyse adm./ tech",
        "train",
        null,
        null,
        toMilliseconds(10),
        0,
        "wait",
      ],
      [
        "toWork",
        "GDD en préparation",
        "walk",
        null,
        null,
        toMilliseconds(10),
        0,
        "train",
      ],
      ["work", "Octroi", null, null, null, toMilliseconds(2), 0, "toWork"],
    ]);

    const options = {
      height: 300,
      width: "100%",
      gantt: {
        defaultStartDate: new Date(2015, 3, 28),
      },
    };

    const chart = new window.google.visualization.Gantt(container);
    chart.draw(data, options);
  };

  useEffect(() => {
    const loadCharts = () => {
      return new Promise((resolve) => {
        if (window.google && window.google.charts) {
          resolve();
        } else {
          const script = document.createElement("script");
          script.src = "https://www.gstatic.com/charts/loader.js";
          script.onload = () => {
            window.google.charts.load("current", { packages: ["gantt"] });
            window.google.charts.setOnLoadCallback(resolve);
          };
          document.body.appendChild(script);
        }
      });
    };

    const observer = new MutationObserver(() => {
      if (chartRef.current?.offsetParent !== null) {
        drawChart();
      }
    });

    loadCharts().then(() => {
      // Observe si le conteneur devient visible
      if (chartRef.current?.parentNode) {
        observer.observe(chartRef.current.parentNode, {
          attributes: true,
          attributeFilter: ["style", "class"],
          subtree: true,
        });
      }

      // Première tentative (au cas où visible immédiatement)
      drawChart();
    });

    return () => observer.disconnect(); // Nettoyage
  }, []);

  return (
    <div>
      <h5 className="mt-4">Diagramme de Gantt</h5>
      <div
        ref={chartRef}
        id="chart_div"
        style={{ width: "100%", height: "300px" }}
      ></div>
    </div>
  );
};

export default GanttChart;
