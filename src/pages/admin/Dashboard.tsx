import { AdminHeader } from '../../components/admin/AdminHeader/AdminHeader';
import { AdminSidebar } from '../../components/admin/AdminSidebar/AdminSidebar';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      
      <div className="admin-layout__content">
        <AdminHeader title="Dashboard" />
        
        <main className="admin-main">
          {/* Stats Grid */}
          <div className="admin-stats">
            <StatCard
              title="Total Revenue"
              value="$94,730"
              change="+12.5%"
              trend="up"
              color="#10b981"
            />
            <StatCard
              title="Active Orders"
              value="184"
              change="+4.2%"
              trend="up"
              color="#3b82f6"
            />
            <StatCard
              title="Low Stock Alert"
              value="12"
              change="-2%"
              trend="down"
              color="#ef4444"
            />
            <StatCard
              title="Total Products"
              value="1,284"
              change="+8.1%"
              trend="up"
              color="#8b5cf6"
            />
          </div>

          {/* Recent Orders Table */}
          <div className="admin-card">
            <h2>Recent Orders</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="order-id">#12345</td>
                  <td>John Doe</td>
                  <td className="amount">$125.00</td>
                  <td><span className="status status--completed">Completed</span></td>
                </tr>
                <tr>
                  <td className="order-id">#12346</td>
                  <td>Jane Smith</td>
                  <td className="amount">$89.50</td>
                  <td><span className="status status--processing">Processing</span></td>
                </tr>
                <tr>
                  <td className="order-id">#12347</td>
                  <td>Bob Johnson</td>
                  <td className="amount">$234.00</td>
                  <td><span className="status status--pending">Pending</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;