import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layout/MainLayout';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import { Card } from 'primereact/card';

const HRDashboard = () => {
	const { currentEmployee } = useAuth();
	const { showToast } = useToast();
	const [ dashboardData, setDashboardData ] = useState({});

	useEffect(() => {
		try {
			api.get('dashboard/hr').then((res) => {
				console.log('Dashboard data:', res.data.data); // ← Add this
			});
		} catch {
			showToast({ severity: 'error', summary: 'Error', detail: 'Issue on fetching dashboard information.' });
		}
	}, []);
	
	const tiles = [
		{ label: 'Employees', count: dashboardData.employees_data?.count_of_employees?.active_employee_count ?? 0, icon: 'pi pi-users', bg_color: 'teal-300' },
		{ label: 'Loan', count: dashboardData.loan_data?.loan_count, icon: 'pi pi-money-bill', bg_color: 'cyan-200' },
		{ label: 'Revenue', count: '$12,340', icon: 'pi pi-dollar', bg_color: 'orange-200' },
		{ label: 'Staff', count: 45, icon: 'pi pi-envelope', bg_color: 'primary-200' },
	];

	return (
		<MainLayout>
			<div className="p-fluid grid">
				{/* <h1 className="text-2xl font-bold m-0">HR Dashboard</h1>
				<h1 className="m-0">Welcome, {currentEmployee?.first_name} {currentEmployee?.last_name}</h1> */}
				{tiles.map((tile, idx) => (
					<div key={idx} className='col-6 md:col-6 lg:col-3'>
						<Card className={`shadow-sm rounded-lg`} style={{ backgroundColor: `var(--${tile.bg_color})`, color: 'var(--primary-color-text)'}}>
							<div className="flex justify-between items-center">
								<div className='col-4'>
									<i className={`${tile.icon} text-8xl text-gray-600`}></i>
								</div>
								<div className='col-8'>
									<p className="text-lg font-medium">{tile.label}</p>
									<p className="text-2xl font-bold mt-1">{tile.count}</p>
								</div>
							</div>
						</Card>
					</div>
				))}
			</div>
		</MainLayout>
	);
};

export default HRDashboard;