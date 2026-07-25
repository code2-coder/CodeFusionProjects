import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  BookOpen, 
  Users,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import axios from 'axios';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    projects: 0,
    packages: 0,
    resources: 0,
    activeUsers: 24,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetching totals using existing endpoints
        // Note: Ideally, there would be a dedicated /api/stats endpoint, 
        // but we'll fetch list lengths for now as a fallback.
        const [projectsRes, packagesRes, resourcesRes] = await Promise.all([
          axios.get('/api/projects').catch(() => ({ data: [] })),
          axios.get('/api/packages').catch(() => ({ data: [] })),
          axios.get('/api/resources').catch(() => ({ data: [] }))
        ]);

        setStats({
          projects: projectsRes.data.length || 0,
          packages: packagesRes.data.length || 0,
          resources: resourcesRes.data.length || 0,
          activeUsers: Math.floor(Math.random() * 50) + 10, // Mock dynamic data
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [



    { title: 'Active Users', value: stats.activeUsers, icon: Users, color: 'from-emerald-500 to-teal-400', trend: 'Live' },
  ];

  const recentActivity = [
    { id: 1, text: "System updated to v2.4", time: "2 hours ago", icon: Activity, color: "text-blue-400" },
    { id: 2, text: "New package 'eCommerce Pro' created", time: "4 hours ago", icon: Package, color: "text-purple-400" },
    { id: 3, text: "Project 'Acme Corp' deployed", time: "1 day ago", icon: ArrowUpRight, color: "text-emerald-400" },
    { id: 4, text: "Resource 'React Guide' updated", time: "2 days ago", icon: BookOpen, color: "text-orange-400" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Welcome back, Admin!</h2>
          <p className="text-[color:var(--foreground)] opacity-60">Here is what's happening with your platform today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-3xl p-6 border border-[color:var(--border)] relative overflow-hidden group"
            >
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`}></div>
              
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                  <Icon size={24} />
                </div>
                <div className="bg-[color:var(--secondary)] px-2.5 py-1 rounded-full text-xs font-bold text-[color:var(--foreground)] opacity-80 flex items-center gap-1">
                  {stat.trend === 'Live' ? (
                    <><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live</>
                  ) : (
                    <><TrendingUp size={12} /> {stat.trend}</>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-[color:var(--foreground)] opacity-60 font-semibold mb-1">{stat.title}</h3>
                <div className="text-4xl font-black">
                  {loading ? (
                    <div className="h-10 w-16 bg-[color:var(--secondary)] animate-pulse rounded-lg"></div>
                  ) : (
                    stat.value
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Area Placeholder */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8 border border-[color:var(--border)] min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Platform Overview</h3>
            <select className="bg-[color:var(--background)] border border-[color:var(--border)] rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-[color:var(--border)] rounded-2xl bg-[color:var(--secondary)]/30">
            <div className="text-center text-[color:var(--foreground)] opacity-50">
              <Activity size={48} className="mx-auto mb-4 opacity-50" />
              <p className="font-semibold">Analytics integration pending</p>
              <p className="text-sm mt-2 max-w-xs mx-auto">Connect a data source or add a charting library (like Chart.js or Recharts) to visualize platform growth.</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-3xl p-8 border border-[color:var(--border)] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Recent Activity</h3>
            <button className="text-sm font-bold text-blue-500 hover:text-blue-400">View All</button>
          </div>
          
          <div className="flex-1 space-y-6">
            {recentActivity.map((activity, idx) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex gap-4 group">
                  <div className="relative mt-1">
                    <div className="w-8 h-8 rounded-full bg-[color:var(--secondary)] flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                      <Icon size={14} className={activity.color} />
                    </div>
                    {idx !== recentActivity.length - 1 && (
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-[color:var(--border)]"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm group-hover:text-blue-400 transition-colors">{activity.text}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-[color:var(--foreground)] opacity-50 font-medium">
                      <Clock size={12} />
                      {activity.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
