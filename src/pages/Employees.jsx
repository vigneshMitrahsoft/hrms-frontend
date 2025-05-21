import { useState, useEffect } from 'react';
import { Tag } from 'primereact/tag';
import { Image } from 'primereact/image';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom'
import api from '../api/axios';
import MainLayout from '../layout/MainLayout';

const Employees = () => {
	const navigate = useNavigate()
	const [employees, setEmployees] = useState([]);
	const [lazyItems, setLazyItems] = useState([]);
	const [totalRecords, setTotalRecords] = useState(0);
	const [loading, setLoading] = useState(false);
	const [roles, setRoles] = useState({});

	const goToCreate = () => {
		navigate('/employee/new');
	};

	useEffect(() => {
		setLoading(true);
		api.get('/employees/roles').then((res) => {
			const data = res.data.data;
			const _roles = data.reduce((result, role) => {
				result[role.role_id] = role.role_name;
				return result;
			}, {});
			setRoles(_roles);
		}).catch(() => {
			// handle error or show toast
		}).finally(() => {
			setLoading(false);
		});
	}, []);

	// Simulated page size
	const PAGE_SIZE = 20;

	const loadEmployees = async (startIndex) => {
		setLoading(true);
		try {
			const res = await api.get('/employees/', {
				params: {
					offset: startIndex,
					limit: PAGE_SIZE,
				},
			});

			// Append new data
			const newItems = [...lazyItems, ...res.data.data];
			setLazyItems(newItems);
			setEmployees(newItems);
			// setTotalRecords(res.data.count); // Django pagination format
			setTotalRecords(10);
		} finally {
			setLoading(false);
		}
	};

	const onLazyLoad = (e) => {
		const { first } = e;
		if (first >= lazyItems.length) {
			loadEmployees(first);
		}
	};

	useEffect(() => {
		onLazyLoad({ first: 0 });
	}, []);

	return (
		<MainLayout>
			<div className="flex justify-content-between align-items-center mb-4">
				<h2 className="m-0">Employees</h2>
				<Button className="p-button-sm" label="New Employee" icon="pi pi-plus" onClick={goToCreate} />
			</div>
			<div className="grid">
				{
					employees.map((emp) => (
						<div key={emp.employee_id} className="col-12 sm:col-6 md:col-6 lg:col-4 p-2">
							<div className="shadow-2 surface-card border-round p-4">
								<div className="flex align-items-start">
									<Image src={emp.profile_picture_path || (emp.gender == 1 ? "../public/male.png" : "../public/female.png")} zoomSrc={emp.profile_picture_path || (emp.gender == 1 ? "../public/male.png" : "../public/female.png")} alt="Image" width="90" height="80" preview={emp.profile_picture_path} />
									<div className="ml-3">
										<span className="block text-900 mb-1 text-sm font-medium">{emp.first_name} {emp.last_name}</span>
										<p className="text-600 text-xs mt-0 mb-2">{emp.email}</p>
										{emp.roles.map((roleId, index) => (
											<Tag
												key={index}
												value={roles[roleId]}
												severity={roles[roleId] === 'Admin' ? 'info' : 'success'}
												className="mr-2 mb-2"
											/>
										))}
										{/* <p>Status: 
										<Tag
											value="Active"
											severity="success"
											// severity={emp.status === 'Active' ? 'success' : 'warning'}
											className="ml-2"
										/>
										</p> */}
									</div>
								</div>
							</div>
						</div>
					))
				}
			</div>
		</MainLayout>
	);
};

export default Employees;