import { useAuth } from '../context/AuthContext';
import MainLayout from '../layout/MainLayout';

const Dashboard = () => {
	const { loading } = useAuth();

	if (loading) return <p>Loading dashboard...</p>;

	return (
		<MainLayout>
			<div className="p-4">
				<h1 className="text-2xl font-bold">Dashboard</h1>
				{/* <h1>Welcome, {user.username}</h1> */}
			</div>
		</MainLayout>
	);
};

export default Dashboard;