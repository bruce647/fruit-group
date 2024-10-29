import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Fruit } from "../types/Fruit";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface JarProps {
  jar: Fruit[];
  className?: string;
}

/**
 * A visual representation of a fruit jar with caloric distribution.
 *
 * @param {JarProps} props The properties of the Jar component.
 * @param {Fruit[]} props.jar The fruits in the jar.
 * @param {string} props.className Optional className for styling
 * @returns {JSX.Element} The JSX element of the Jar component.
 */
const Jar: React.FC<JarProps> = ({ jar, className = "" }) => {
  // Input validation
  if (!Array.isArray(jar) || jar.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          No fruits available to display. Please add some fruits to the jar.
        </AlertDescription>
      </Alert>
    );
  }

  const totalCalories = jar.reduce((sum, fruit) => {
    const calories = fruit?.nutritions?.calories || 0;
    return sum + calories;
  }, 0);

  const pieData = jar
    .filter((fruit) => fruit?.nutritions?.calories > 0)
    .map((fruit) => ({
      name: fruit.name,
      calories: fruit.nutritions.calories,
      percentage: ((fruit.nutritions.calories / totalCalories) * 100).toFixed(
        1
      ),
    }))
    .sort((a, b) => b.calories - a.calories); // Sort by calories descending

  const colors = [
    "#FF8042", // Orange
    "#00C49F", // Teal
    "#FFBB28", // Yellow
    "#0088FE", // Blue
    "#8884d8", // Purple
    "#9966FF", // Violet
    "#FF6B6B", // Red
    "#6BCB77", // Green
    "#FF6F61", // Coral
    "#90D5EC", // Light Blue
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 rounded shadow-lg border">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">Calories: {data.calories}</p>
          <p className="text-sm">{data.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`w-full h-fit ${className}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Fruit Jar</span>
          <span className="text-lg font-normal">
            Total: {totalCalories.toLocaleString()} calories
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="calories"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={140}
                innerRadius={70} // Added donut style
                labelLine={false}
                label={({
                  cx,
                  cy,
                  midAngle,
                  outerRadius,
                  percentage,
                  name,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius * 1.1;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return percentage > 5 ? ( // Only show label if segment is >5%
                    <text
                      x={x}
                      y={y}
                      fill="gray"
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      className="text-xs"
                    >
                      {name} ({percentage}%)
                    </text>
                  ) : null;
                }}
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </div>
  );
};

export default Jar;
