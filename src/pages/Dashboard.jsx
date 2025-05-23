import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layout/MainLayout';
import { useToast } from '../context/ToastContext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import api from '../api/axios';

import '../index.css';

const Dashboard = () => {
	const { currentEmployee } = useAuth();
	const { showToast } = useToast();
	const [ employeedashboardData, setEmployeeDashboardData ] = useState({});

	const totalLeaves = employeedashboardData?.leave_balance?.total ?? 0;
    const usedLeaves = employeedashboardData?.leave_balance?.used ?? 0;
    const remainingLeaves = totalLeaves - usedLeaves;

	useEffect(() => {
		try {
			api.get('dashboard/employee').then((res) => {
				setEmployeeDashboardData(res.data.data);
			});
		} catch {
			showToast({ severity: 'error', summary: 'Error', detail: 'Issue on fetching dashboard information.' });
		}
	}, []);

	// const tiles = [
	// 	{ label: 'Leave Balances', count: employeedashboardData.employees_data?.count_of_employees?.active_employee_count ?? 0, icon: 'pi pi-users', bg_color: 'teal-300' },
	// 	{ label: 'Loan', count: employeedashboardData?.loan_data?.loan_count ?? 0, icon: 'pi pi-money-bill', bg_color: 'cyan-200' },
	// 	{ label: 'Revenue', count: '$12,340', icon: 'pi pi-dollar', bg_color: 'orange-200' },
	// 	{ label: 'Staff', count: 45, icon: 'pi pi-envelope', bg_color: 'primary-200' },
	// ];

	const checkIn = () => {
		api.post('attendance/checkin').then((response) => {
			showToast({ severity: 'success', summary: 'Check-In', detail: response.data.message });
		}).catch((error) => {
			showToast({ severity: 'error', summary: 'Error', detail: error.message });
		});
	};

	const checkOut = () => {
		api.post('attendance/checkout').then((response) => {
			showToast({ severity: 'success', summary: 'Check-Out', detail: response.data.message });
		}).catch((error) => {
			showToast({ severity: 'error', summary: 'Error', detail: error.message });
		});
	};

	return (
		<MainLayout>
			<div className="p-fluid grid">
				{/* <h1 className="text-2xl font-bold m-0">HR Dashboard</h1>
				<h1 className="m-0">Welcome, {currentEmployee?.first_name} {currentEmployee?.last_name}</h1> */}
				{/* {tiles.map((tile, idx) => (
					<div key={idx} className='col-6 md:col-6 lg:col-3'>
						<Card className={`shadow-lg rounded-lg p-0`}>
							<div className="flex justify-between items-center">
								<p className="text-lg font-medium">{tile.label}</p>
								<p className="text-2xl font-bold mt-1">{tile.count}</p>
							</div>
						</Card>
					</div>
				))} */}
				<div className="col-6 md:col-6 lg:col-3">
					<Card title="Today" className="shadow-2 w-full dashboard">
						<div className="flex flex-between">
							<div className="col-6">
								<span className="text-xs">Effective Hours</span>
								<h4 className="text-primary m-0">{employeedashboardData?.employee_leave_balance?.sick_leave ?? 0}</h4>
							</div>
							<Divider layout="vertical"/>
							<div className="col-6">
								<Button label="Check In" onClick={checkIn}/>
								<Button label="Check Out" onClick={checkOut}/>
							</div>
						</div>
						{/* <Divider />
						<a className="pull-right" href="#">Apply Leave</a> */}
					</Card>
				</div>
				<div className="col-6 md:col-6 lg:col-3">
					<Card title="Leave Balance" className="shadow-2 w-full dashboard">
						<div className="flex flex-between">
							<div className="col-4">
								<h4 className="text-primary m-0">{employeedashboardData?.employee_leave_balance?.sick_leave ?? 0}</h4>
								<span className="text-xs">Sick Leaves</span>
							</div>
							<Divider layout="vertical"/>
							<div className="col-4">
								<h4 className="text-primary m-0">{employeedashboardData?.employee_leave_balance?.casual_leave ?? 0}</h4>
								<span className="text-xs">Casual Leaves</span>
							</div>
							<Divider layout="vertical"/>
							<div className="col-4">
								<h4 className="text-primary m-0">{employeedashboardData?.employee_leave_balance?.permission_hours ?? 0}</h4>
								<span className="text-xs">Permission Hours</span>
							</div>
						</div>
						<Divider />
						<a className="pull-right" href="#">Apply Leave</a>
					</Card>
				</div>
			</div>
		</MainLayout>
	);
};

export default Dashboard;