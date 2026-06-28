import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

const data = [
  { name: "Technical Skills", value: 12 },
  { name: "Frameworks", value: 4 },
  { name: "Tools", value: 2 }
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

function SkillsChart() {
  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={100}
        dataKey="value"
        label
      >
        {data.map((entry, index) => (
          <Cell
            key={index}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  );
}

export default SkillsChart;