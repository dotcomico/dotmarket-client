import './RecentOrdersTable.css';

interface Order {
  id: number;
  customer: string;
  amount: number;
  status: 'completed' | 'processing' | 'pending' | 'cancelled';
  date: string;
}

export const RecentOrdersTable = () => {
  // Mock data - replace with actual API call
  const recentOrders: Order[] = [
    { id: 12345, customer: 'John Doe', amount: 125.00, status: 'completed', date: '2026-01-23' },
    { id: 12346, customer: 'Jane Smith', amount: 89.50, status: 'processing', date: '2026-01-23' },
    { id: 12347, customer: 'Bob Johnson', amount: 234.00, status: 'pending', date: '2026-01-22' },
    { id: 12348, customer: 'Alice Williams', amount: 156.75, status: 'completed', date: '2026-01-22' },
    { id: 12349, customer: 'Charlie Brown', amount: 98.20, status: 'processing', date: '2026-01-21' },
  ];

  const getStatusClass = (status: Order['status']) => {
    const classes = {
      completed: 'status--completed',
      processing: 'status--processing',
      pending: 'status--pending',
      cancelled: 'status--cancelled'
    };
    return classes[status];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="admin-card admin-card--large">
      <div className="admin-card__header">
        <h2>Recent Orders</h2>
        <button className="btn-link">View All</button>
      </div>
      
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(order => (
              <tr key={order.id}>
                <td className="order-id">#{order.id}</td>
                <td>{order.customer}</td>
                <td className="text-secondary">{formatDate(order.date)}</td>
                <td className="amount">${order.amount.toFixed(2)}</td>
                <td>
                  <span className={`status ${getStatusClass(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};