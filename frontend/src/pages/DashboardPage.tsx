import { Link } from "react-router-dom";

const DashboardPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Total Leads</p>
          <h2 className="text-2xl font-semibold">120</h2>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Pending Quotes</p>
          <h2 className="text-2xl font-semibold">34</h2>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Active Shipments</p>
          <h2 className="text-2xl font-semibold">18</h2>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Customers</p>
          <h2 className="text-2xl font-semibold">56</h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

        <div className="flex flex-wrap gap-4">
          <Link to="/leads" className="bg-blue-600 text-white px-4 py-2 rounded">
            View Leads
          </Link>

          <Link to="/shipments" className="bg-green-600 text-white px-4 py-2 rounded">
            View Shipments
          </Link>

          <Link to="/users" className="bg-purple-600 text-white px-4 py-2 rounded">
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
