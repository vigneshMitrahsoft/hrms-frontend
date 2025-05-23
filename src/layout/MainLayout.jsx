import { useState, useRef } from 'react';
import { Menubar } from 'primereact/menubar';
import { Sidebar } from 'primereact/sidebar';
import { PanelMenu } from 'primereact/panelmenu';
import { Button } from 'primereact/button';
import { Menu } from "primereact/menu";
import { Avatar } from "primereact/avatar";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = ({ children }) => {
	const [visible, setVisible] = useState(false);
	const { logout, currentEmployee } = useAuth();
	const navigate = useNavigate();
	const menu = useRef(null);

	const profileItems = [
		{
			template: () => (
				<div className="px-3 py-2 text-sm text-color-secondary font-medium">
					<span className="font-bold text-color">{currentEmployee?.first_name} {currentEmployee?.last_name}</span>
				</div>
			),
			disabled: true
		},
		{ separator: true },
		{
			label: 'Profile',
			icon: 'pi pi-user'
		},
		{
			label: 'Settings',
			icon: 'pi pi-cog'
		},
		{ separator: true },
		{
			label: 'Logout',
			icon: 'pi pi-sign-out',
			command: () => {
				logout();
				setVisible(false);
			}
		}
	];

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
		}
	];

	const start = (
		<Button icon="pi pi-bars" className="p-button-text text-color-secondary" onClick={() => setVisible(true)} />
	);

	const end = (
		<div className="flex align-items-center gap-2">
			<Menu model={profileItems} popup ref={menu} />
			<div className="flex align-items-center gap-2 p-1 px-2 border-round cursor-pointer hover:surface-hover" onClick={(e) => menu.current.toggle(e)}>
				<Avatar
					image="../public/male.png"
					size="large"
					shape="circle"
				/>
				<i className="pi pi-chevron-down text-sm"></i>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen">
			<Menubar start={start} end={end} style={{ backgroundColor: 'var(--purple-500)', color: 'var(--primary-text-color)'}}/>

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