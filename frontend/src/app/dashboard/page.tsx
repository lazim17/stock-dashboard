import Navbar from '../../components/Navbar';
import PortfolioTable from '../../containers/dashboard/PortfolioTable';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PortfolioTable />
    </div>
  );
}