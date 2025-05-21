import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import api from '../api/axios';

// const regimeOptions = [
// 	{ label: 'Old Regime', value: 1 },
// 	{ label: 'New Regime', value: 2 }
// ];

const EmployeeSalaryForm = ({ toast, employee_id }) => {
	const {id} = useParams();
	const [loading, setLoading] = useState(false);
	const [salary, setSalary] = useState({});
	const [salaryID, setSalaryID] = useState(null);

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({});

	useEffect(() => {
		if (employee_id) {
			setLoading(true);
			api.get(`/employees/salary/${employee_id}`).then((res) => {
				const data = res.data.data;
				setSalary(data);

				setValue('gross_salary', data.gross_salary);
				setValue('variable_pay', data.variable_pay);
				setSalaryID(data.salary_id);
				// setValue("regime", data?.regime || '')
			}).catch(() => {
				// handle error or show toast
			}).finally(() => {
				setLoading(false);
			});
		}
	}, [employee_id]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setSalary({ ...employee, [name]: value });
	};

	const onSubmit = async (data) => {
		setLoading(true);

		// Create FormData
		const formData = new FormData();
		// Append text fields
		formData.append('employee_id', employee_id);
		formData.append('gross_salary', data.gross_salary);
		formData.append('variable_pay', data.variable_pay);
		// formData.append('regime', data.regime);

		try {
			if (salaryID) {
				await api.patch(
					`/employees/salary/update/${salaryID}`,
					formData
				);
			} else {
				await api.post('/employees/salary/create', formData).then((res) => {
					const salary_id = res.data.data.salary_id;
					setSalaryID(salary_id);
				});
			}
			toast({ severity: 'success', summary: 'Updated', detail: 'Salary updated successfully!' });
		} catch (err) {
			toast({ severity: 'error', summary: 'Error', detail: 'Failed to update salary information' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="p-fluid grid">
			<div className="field mb-1 col-12 md:col-6">
				<label htmlFor="gross_salary">Gross Salary</label>
				<Controller
					name="gross_salary"
					control={control}
					rules={{ required: 'Permission Hours is required' }}
					render={({ field, fieldState }) => (
						<InputNumber
							id="gross_salary"
							mode="decimal"
							useGrouping={false}
							step={0.1}
							locale="en-US"
							inputMode='decimal'
							value={field.value}
							onValueChange={(e) => field.onChange(e.value)}
							className={classNames('p-inputtext-sm', { 'p-invalid': fieldState.invalid })}
						/>
					)}
				/>
				{errors.gross_salary && <small className="p-error">{errors.gross_salary.message}</small>}
			</div>
		
			<div className="field mb-1 col-12 md:col-6">
				<label htmlFor="variable_pay">Variable Pay</label>
				<Controller
					name="variable_pay"
					control={control}
					rules={{ required: 'Permission Hours is required' }}
					render={({ field, fieldState }) => (
						<InputNumber
							id="variable_pay"
							mode="decimal"
							useGrouping={false}
							step={0.1}
							locale="en-US"
							inputMode='decimal'
							value={field.value}
							onValueChange={(e) => field.onChange(e.value)}
							className={classNames('p-inputtext-sm', { 'p-invalid': fieldState.invalid })}
						/>
					)}
				/>
				{errors.variable_pay && <small className="p-error">{errors.variable_pay.message}</small>}
			</div>

			{/* <div className="field mb-1 col-12 md:col-6">
				<label htmlFor="gender">Regime</label>
				<Controller
					name="regime"
					control={control}
					rules={{ required: 'Regime is required' }}
					render={({ field }) => (
						<Dropdown
							id={field.name}
							{...field}
							options={regimeOptions}
							optionLabel="label"
							placeholder="Select a regime"
							className={classNames('p-inputtext-sm', { 'p-invalid': errors.regime })}
							// onChange={handleChange}
						/>
					)}
				/>
				{errors.regime && <small className="p-error">{errors.regime.message}</small>}
			</div> */}

			<div className="field mb-1 col-12">
				<div className="col-1">
					<Button type="submit" label="Save" className="w-full" size="small" disabled={!employee_id} />
				</div>
			</div>
		</form>
	);
}

export default EmployeeSalaryForm;