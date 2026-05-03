/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar
} from 'recharts';
import { Order } from '../types';
import { TrendingUp, ShoppingBag, DollarSign, Users } from 'lucide-react';

interface DashboardProps {
  orders: Order[];
}

export default function AdminDashboard({ orders }: DashboardProps) {
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const uniqueCustomers = new Set(orders.map(o => o.email)).size;

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      uniqueCustomers
    };
  }, [orders]);

  const salesData = useMemo(() => {
    // Group orders by day for the last 7 days
    const days: Record<string, number> = {};
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      days[label] = 0;
    }

    orders.forEach(order => {
      const createdAt = order.createdAt?.seconds ? order.createdAt.toDate() : new Date(order.createdAt);
      const label = createdAt.toLocaleDateString('en-US', { weekday: 'short' });
      if (days[label] !== undefined) {
        days[label] += order.total;
      }
    });

    return Object.entries(days).map(([name, total]) => ({ name, total }));
  }, [orders]);

  const monthlyData = useMemo(() => {
    // Group orders by month
    const months: Record<string, number> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    monthNames.forEach(m => months[m] = 0);

    orders.forEach(order => {
      const createdAt = order.createdAt?.seconds ? order.createdAt.toDate() : new Date(order.createdAt);
      const month = monthNames[createdAt.getMonth()];
      months[month] += order.total;
    });

    return Object.entries(months).map(([name, total]) => ({ name, total }));
  }, [orders]);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Sales</p>
              <h3 className="text-2xl font-bold text-gray-900">৳ {stats.totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-green-600">
            <TrendingUp className="h-3 w-3" />
            <span>+12.5% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrders}</h3>
            </div>
          </div>
          <p className="text-xs text-gray-400">Processed through checkout</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Customers</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.uniqueCustomers}</h3>
            </div>
          </div>
          <p className="text-xs text-gray-400">Unique buyer emails</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Avg. Order</p>
              <h3 className="text-2xl font-bold text-gray-900">৳ {Math.round(stats.avgOrderValue).toLocaleString()}</h3>
            </div>
          </div>
          <p className="text-xs text-gray-400">Average basket value</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-serif text-xl text-gray-900 mb-8">Weekly Sales Analysis</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(value) => `৳${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                  }}
                  formatter={(value: number) => [`৳ ${value.toLocaleString()}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-serif text-xl text-gray-900 mb-8">Monthly Sales Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(value) => `৳${value}`}
                />
                <Tooltip 
                  cursor={{ fill: '#F9FAFB' }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                  }}
                  formatter={(value: number) => [`৳ ${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar 
                  dataKey="total" 
                  fill="#E11D48" 
                  radius={[6, 6, 0, 0]}
                  barSize={30} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
