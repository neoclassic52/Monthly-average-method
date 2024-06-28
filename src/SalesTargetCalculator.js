import React, { useState, useEffect } from "react";

const SalesTargetCalculator = () => {
  const [salesData, setSalesData] = useState(Array(36).fill(0));
  const [annualTarget, setAnnualTarget] = useState(0);
  const [monthlyTargets, setMonthlyTargets] = useState([]);
  const [monthlyAverages, setMonthlyAverages] = useState([]);
  const [fiscalYearStart, setFiscalYearStart] = useState(1);
  const [totalYearlySales, setTotalYearlySales] = useState(0);
  const [yearlyTotals, setYearlyTotals] = useState([0, 0, 0]);
  const [error, setError] = useState(null);

  const handleSalesInput = (index, value) => {
    try {
      const newData = [...salesData];
      newData[index] = Number(value) || 0;
      setSalesData(newData);
    } catch (err) {
      setError("Sales data input error");
    }
  };

  const handleAnnualTargetInput = (value) => {
    try {
      setAnnualTarget(Number(value) || 0);
    } catch (err) {
      setError("Annual target input error");
    }
  };

  const handleFiscalYearStartChange = (value) => {
    try {
      const start = Number(value) || 1;
      setFiscalYearStart(start < 1 || start > 12 ? 1 : start);
    } catch (err) {
      setError("Fiscal year start input error");
    }
  };

  useEffect(() => {
    try {
      let totalSales = 0;
      const newMonthlyAverages = [];
      const newYearlyTotals = [0, 0, 0];
      for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
        let total = 0;
        for (let yearIndex = 0; yearIndex < 3; yearIndex++) {
          const value = Number(salesData[monthIndex + yearIndex * 12] || 0);
          total += value;
          newYearlyTotals[yearIndex] += value;
        }
        newMonthlyAverages.push(total / 3);
        totalSales += total / 3;
      }
      setMonthlyAverages(newMonthlyAverages);
      setTotalYearlySales(totalSales);
      setYearlyTotals(newYearlyTotals);
    } catch (err) {
      setError("Error calculating sales data");
    }
  }, [salesData]);

  const calculateMonthlyTargets = () => {
    try {
      const totalAverage = monthlyAverages.reduce((acc, cur) => acc + cur, 0);
      const seasonalVariationRatios = monthlyAverages.map(
        (avg) => (avg / totalAverage) * 100
      );
      const targetRatios = seasonalVariationRatios.map(
        (ratio) => (ratio / 100) * annualTarget
      );
      setMonthlyTargets(targetRatios);
    } catch (err) {
      setError("Error calculating monthly targets");
    }
  };

  const generateMonths = (start) => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const month = ((start - 1 + i) % 12) + 1;
      months.push(`${month}月`);
    }
    return months;
  };

  const months = generateMonths(fiscalYearStart);
  const years = ["3期前", "2期前", "前年度"];

  const totalSeasonalVariation = 100;
  const totalTargets = monthlyTargets.reduce((acc, val) => acc + val, 0);

  if (error) {
    return <div style={{ color: "red" }}>エラーが発生しました: {error}</div>;
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        今年度の売上計画（月別平均法）
      </h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="number"
          placeholder="決算期開始月"
          value={fiscalYearStart}
          onChange={(e) => handleFiscalYearStartChange(e.target.value)}
          min="1"
          max="12"
          style={{ width: "120px", padding: "5px" }}
        />
        <input
          type="number"
          placeholder="今年度の売上計画"
          value={annualTarget}
          onChange={(e) => handleAnnualTargetInput(e.target.value)}
          style={{ flex: 1, padding: "5px" }}
        />
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  backgroundColor: "#f2f2f2",
                }}
              >
                月
              </th>
              {years.map((year) => (
                <th
                  key={year}
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    backgroundColor: "#f2f2f2",
                  }}
                >{`${year}の売上`}</th>
              ))}
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  backgroundColor: "#f2f2f2",
                }}
              >
                3カ年平均の売上
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  backgroundColor: "#f2f2f2",
                }}
              >
                季節変動比
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  backgroundColor: "#f2f2f2",
                }}
              >
                今年度の売上目標
              </th>
            </tr>
          </thead>
          <tbody>
            {months.map((month, monthIndex) => (
              <tr key={monthIndex}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {month}
                </td>
                {years.map((_, yearIndex) => (
                  <td
                    key={yearIndex}
                    style={{ border: "1px solid #ddd", padding: "8px" }}
                  >
                    <input
                      type="number"
                      value={salesData[monthIndex + yearIndex * 12]}
                      onChange={(e) =>
                        handleSalesInput(
                          monthIndex + yearIndex * 12,
                          e.target.value
                        )
                      }
                      style={{ width: "100%", padding: "5px" }}
                    />
                  </td>
                ))}
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {monthlyAverages[monthIndex]?.toFixed(2) || "0.00"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {monthlyTargets[monthIndex]
                    ? (
                        (monthlyTargets[monthIndex] / annualTarget) *
                        100
                      ).toFixed(2) + "%"
                    : "0.00%"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {monthlyTargets[monthIndex]?.toFixed(2) || "0.00"}
                </td>
              </tr>
            ))}
            <tr style={{ backgroundColor: "#f2f2f2", fontWeight: "bold" }}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>合計</td>
              {yearlyTotals.map((total, index) => (
                <td
                  key={index}
                  style={{ border: "1px solid #ddd", padding: "8px" }}
                >
                  {total.toFixed(2)}
                </td>
              ))}
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {totalYearlySales.toFixed(2)}
              </td>
              <td
                style={{ border: "1px solid #ddd", padding: "8px" }}
              >{`${totalSeasonalVariation.toFixed(2)}%`}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {totalTargets.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <button
          onClick={calculateMonthlyTargets}
          style={{
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          目標売上を算出
        </button>
        <button
          onClick={() =>
            alert(
              "CSV download functionality is not implemented in this preview."
            )
          }
          style={{
            padding: "10px",
            backgroundColor: "#008CBA",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          結果をダウンロード
        </button>
      </div>
    </div>
  );
};

export default SalesTargetCalculator;
