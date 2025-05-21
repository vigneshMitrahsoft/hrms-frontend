import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { useToast } from '../context/ToastContext';
import MainLayout from '../layout/MainLayout';
import EmployeeBasicForm from './EmployeeBasicForm';
import EmployeeSalaryForm from './EmployeeSalaryForm';
import EmployeeLeaveForm from './EmployeeLeaveForm';

const EmployeeForms = () => {
	const { showToast } = useToast();
	const { id } = useParams();
	const navigate = useNavigate();

	const goToEmployeeList = () => {
		navigate('/employees');
	}

	return (
		<MainLayout>
			<div className="flex justify-content-between align-items-center mb-4">
				<h2 className="m-0">{id ? 'Update' : 'Add'} Employee</h2>
				<Button
					label="Employees"
					icon="pi pi-users"
					onClick={goToEmployeeList}
					className="p-button-sm"
				/>
			</div>
			<div className="surface-card p-4 shadow-2 border-round">
				<div className="max-w-xl mx-auto">
					<TabView>
						<TabPanel header="Basic">
							<EmployeeBasicForm toast={showToast} employee_id={id}/>
						</TabPanel>
						<TabPanel header="Salary" disabled={!id}>
							<EmployeeSalaryForm toast={showToast} employee_id={id}/>
						</TabPanel>
						<TabPanel header="Leave" disabled={!id}>
							<EmployeeLeaveForm toast={showToast} employee_id={id}/>
						</TabPanel>
					</TabView>
				</div>
			</div>
		</MainLayout>
	);
}

export default EmployeeForms;