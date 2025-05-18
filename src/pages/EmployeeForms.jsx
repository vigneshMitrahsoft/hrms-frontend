import { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import MainLayout from '../layout/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import BasicEmployeeForm from './BasicEmployeeForm';

const EmployeeForms = () => {
	const { id } = useParams();
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	
	const goToEmployeeList = () => {
		navigate('/employees');
	}

	const stepperRef = useRef(null);

	return (
		<MainLayout>
			<div className="flex justify-content-between align-items-center mb-4">
				<h2 className="m-0">Add Employee</h2>
				<Button
					label="Employees"
					icon="pi pi-users"
					onClick={goToEmployeeList}
					className="p-button-sm"
				/>
			</div>
			{/* <p className="text-900 font-bold">Create New Employee</p> */}
			<div className="surface-card p-4 shadow-2 border-round">
				<div className="max-w-xl mx-auto">
					<Stepper ref={stepperRef} style={{ flexBasis: '50rem' }} activeStep={0}>
						<StepperPanel header="Basic">
							<BasicEmployeeForm/>
							{
								id && (
									<div className="flex py-4">
										<Button size="small" label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
									</div>
								)
							}
						</StepperPanel>
						<StepperPanel header="Leaves">
							<div className="flex flex-column h-12rem">
								<div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content II</div>
							</div>
							{
								id && (
									<div className="flex py-4 gap-2">
										<Button size="small" label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
										<Button size="small" label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
									</div>
								)
							}
						</StepperPanel>
						<StepperPanel header="Salary">
							<div className="flex flex-column h-12rem">
								<div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content II</div>
							</div>
							<div className="flex py-4 gap-2">
								<Button size="small" label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
								<Button size="small" label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
							</div>
						</StepperPanel>
					</Stepper>
				</div>
			</div>
		</MainLayout>
	);
}

export default EmployeeForms;