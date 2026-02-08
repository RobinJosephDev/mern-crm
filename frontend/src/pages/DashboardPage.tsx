import { useEffect, useState } from "react";
import axios from "../api/axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#dc2626"];

const DashboardPage = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      let url = "/dashboard/stats";

      if (user.role === "admin") url = "/dashboard/admin";
      if (user.role === "employee") url = "/dashboard/employee";
      if (user.role === "carrier") url = "/dashboard/carrier";
      if (user.role === "customer") url = "/dashboard/customer";

      const res = await axios.get(url);
      setData(res.data);
    };

    fetchDashboardData();
  }, [user.role]);

  if (!data) return <p>Loading dashboard...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* ADMIN / EMPLOYEE STATS */}
      {(user.role === "admin" || user.role === "employee") && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {data.totalLeads !== undefined && <Stat title="Total Leads" value={data.totalLeads} />}
            {data.pendingQuotes !== undefined && <Stat title="Pending Quotes" value={data.pendingQuotes} />}
            {data.activeShipments !== undefined && <Stat title="Active Shipments" value={data.activeShipments} />}
            {data.totalCustomers !== undefined && <Stat title="Customers" value={data.totalCustomers} />}
          </div>

          {/* Leads per Month */}
          {data.leadsPerMonth && (
            <ChartCard title="Leads per Month">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.leadsPerMonth}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </>
      )}

      {/* CARRIER / ADMIN SHIPMENT CHART */}
      {(user.role === "admin" || user.role === "carrier") && data.shipmentStatus && (
        <ChartCard title="Shipment Status">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.shipmentStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100}>
                {data.shipmentStatus.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* CUSTOMER VIEW */}
      {user.role === "customer" && (
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold mb-4">My Shipments</h2>
          <p>You can track your shipment status here.</p>
        </div>
      )}
    </div>
  );
};

const Stat = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-white shadow rounded p-4">
    <p className="text-gray-500">{title}</p>
    <h2 className="text-2xl font-semibold">{value}</h2>
  </div>
);

const ChartCard = ({ title, children }: any) => (
  <div className="bg-white shadow rounded p-6 mb-10">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

export default DashboardPage;
