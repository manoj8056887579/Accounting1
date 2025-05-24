
import React from 'react';
import { Product } from '@/models/pos';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategoryDistributionProps {
  products: Product[];
}

interface CategoryData {
  name: string;
  value: number;
}

const CategoryDistribution: React.FC<CategoryDistributionProps> = ({ products }) => {
  // Get all categories and their product counts
  const categoryCounts: Record<string, number> = {};
  
  products.forEach(product => {
    const category = product.category || "Uncategorized";
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  
  // Convert to array format for recharts
  const data: CategoryData[] = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value
  }));
  
  // Sort by count (highest first)
  data.sort((a, b) => b.value - a.value);
  
  // Colors for the chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Product Categories</CardTitle>
        <CardDescription>Distribution of products by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} products`, 'Count']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryDistribution;
