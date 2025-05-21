import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import api from '../api/axios';

// const regimeOptions = [
// 	{ label: 'Old Regime', value: 1 },
// 	{ label: 'New Regime', value: 2 }
// ];

const EmployeeLeaveForm = ({ toast, employee_id }) => {
	const [loading, setLoading] = useState(false);
	const [leaveBalanceID, setLeaveBalanceID] = useState({});

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({});

	useEffect(() => {
		if (employee_id) {
			setLoading(true);
			api.get(`/leave/${employee_id}`).then((res) => {
				const data = res.data.data;

				setLeaveBalanceID(data.leave_balance_id);
				setValue('sick_leave', parseFloat(data.sick_leave));
				setValue('casual_leave', parseFloat(data.casual_leave));
				setValue('permission_hours', parseFloat(data.permission_hours));
			}).catch(() => {
				// handle error or show toast
			}).finally(() => {
				setLoading(false);
			});
		}
	}, [employee_id]);

	const onSubmit = async (data) => {
		setLoading(true);

		// Create FormData
		const formData = new FormData();
		// Append text fields
		formData.append('employee_id', employee_id);
		formData.append('sick_leave', data.sick_leave);
		formData.append('casual_leave', data.casual_leave);
		formData.append('permission_hours', data.permission_hours);

		try {
			// NOTE: When create a new employee, leaves will be added to the employee based on the company settings. So, we don't need to integrate API for creating new leave balance.
			await api.patch(
				`/leave/update/${leaveBalanceID}`,
				formData
			);
			toast({ severity: 'success', summary: 'Updated', detail: 'Leave updated successfully!' });
		} catch (err) {
			toast({ severity: 'error', summary: 'Error', detail: 'Failed to update leave' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="p-fluid grid">
			<div className="field mb-1 col-12 md:col-6">
				<label htmlFor="sick_leave">Sick Leave</label>
				<Controller
					name="sick_leave"
					control={control}
					rules={{ required: 'Sick Leave is required' }}
					render={({ field, fieldState }) => (
						<InputNumber
							id="sick_leave"
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
				{errors.sick_leave && <small className="p-error">{errors.sick_leave.message}</small>}
			</div>
		
			<div className="field mb-1 col-12 md:col-6">
				<label htmlFor="casual_leave">Casual Leave</label>
				<Controller
					name="casual_leave"
					control={control}
					rules={{ required: 'Casual Leave is required' }}
					render={({ field, fieldState }) => (
						<InputNumber
							id="casual_leave"
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
				{errors.casual_leave && <small className="p-error">{errors.casual_leave.message}</small>}
			</div>

			<div className="field mb-1 col-12 md:col-6">
				<label htmlFor="permission_hours">Permission Hours</label>
				<Controller
					name="permission_hours"
					control={control}
					rules={{ required: 'Permission Hours is required' }}
					render={({ field, fieldState }) => (
						<InputNumber
							id="permission_hours"
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
				{errors.permission_hours && <small className="p-error">{errors.permission_hours.message}</small>}
			</div>

			<div className="field mb-1 col-12">
				<div className="col-1">
					<Button type="submit" label="Save" className="w-full" size="small" disabled={!employee_id} />
				</div>
			</div>
		</form>
	);
}

export default EmployeeLeaveForm;