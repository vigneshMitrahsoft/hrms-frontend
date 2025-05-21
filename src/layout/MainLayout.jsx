import { useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Sidebar } from 'primereact/sidebar';
import { PanelMenu } from 'primereact/panelmenu';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = ({ children }) => {
	const [visible, setVisible] = useState(false);
	const { logout, currentEmployee } = useAuth();
	const navigate = useNavigate();

	const sidebarItems = [
		{
			label: 'Dashboard',
			icon: 'pi pi-home',
			command: () => {
				navigate('/dashboard');
				setVisible(false);
			},
		},
		{
			label: 'HR Dashboard',
			icon: 'pi pi-warehouse',
			command: () => {
				navigate('/hr-dashboard');
				setVisible(false);
			},
		},
		{
			label: 'Employees',
			icon: 'pi pi-users',
			items: [
				{
				label: 'All Employees',
				icon: 'pi pi-list',
				command: () => {
					navigate('/employees');
					setVisible(false);
				},
				},
				{
				label: 'Departments',
				icon: 'pi pi-sitemap',
				command: () => {
					navigate('/departments');
					setVisible(false);
				},
				},
			],
		},
		{
			label: 'Settings',
			icon: 'pi pi-cog',
			items: [
				{
					label: 'Profile',
					icon: 'pi pi-user',
					command: () => {
						navigate('/profile');
						setVisible(false);
					},
				},
				{
					label: 'Preferences',
					icon: 'pi pi-sliders-h',
					command: () => {
						navigate('/preferences');
						setVisible(false);
					},
				},
			],
		},
		{
			label: 'Logout',
			icon: 'pi pi-sign-out',
			command: () => {
				logout();
				setVisible(false);
			},
		},
	];

	const start = (
		<Button icon="pi pi-bars" className="p-button-text" onClick={() => setVisible(true)} />
	);

	const end = <span className="mr-4 text-sm">Hello, {currentEmployee?.first_name} {currentEmployee?.last_name}</span>;

	return (
		<div className="min-h-screen">
			<Menubar start={start} end={end} />

			<div className="card flex justify-content-center">
				<Sidebar visible={visible} onHide={() => setVisible(false)} modal={false} dismissable>
					<PanelMenu model={sidebarItems} className="w-full" />
				</Sidebar>
			</div>

			<main>
				<div className="container mx-auto p-4">
					{children}
				</div>
			</main>
		</div>
	);
};

export default MainLayout;