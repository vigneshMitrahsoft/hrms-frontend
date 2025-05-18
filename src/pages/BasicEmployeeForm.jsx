import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Controller, set, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Avatar } from 'primereact/avatar';
import { Calendar } from 'primereact/calendar';
import { Image } from 'primereact/image';
import { classNames } from 'primereact/utils';
import api from '../api/axios';

const roles = [
	{ label: 'Admin', value: 1 },
	{ label: 'HR', value: 2 },
	{ label: 'HR Admin', value: 3 },
	{ label: 'Staff', value: 4 }
];

const genderOptions = [
	{ label: 'Male', value: 1 },
	{ label: 'Female', value: 2 }
];

const BasicEmployeeForm = () => {
	const {id} = useParams();
	const [loading, setLoading] = useState(false);
	const [allRoles, setAllRoles] = useState(roles);
	const [employee, setEmployee] = useState({});
	const [selectedRoles, setSelectedRoles] = useState([]);
	const [dob, setDob] = useState(null);
	
	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		reset,
		watch,
	} = useForm({
		defaultValues: {
			gender: '',
			roles: [],
			date_of_birth: ''
		}
	});

	useEffect(() => {
		if (id) {
			setLoading(true);
			api.get(`/employees/${id}`).then((res) => {
				const data = res.data.data;
				setEmployee(data);
				
				if(data?.roles.length > 0) {
					const roleIds = data.roles.map((role) => {
						return role.role_id;
					});
					setSelectedRoles(roleIds);
					setValue('roles', roleIds);
				}

				if(data?.gender) {
					setValue("gender", data.gender)
				}

				setValue('date_of_birth', data.date_of_birth);
				setValue('first_name', data.first_name);
				setValue('last_name', data.last_name);
				setValue('email', data.email);
				setValue('phone', data.phone);
				setValue('aadhar_number', data.aadhar_number);
				setValue('pan_number', data.pan_number);
				// setValue('avatar', data.avatar);
			}).catch(() => {
				// handle error or show toast
			}).finally(() => {
				setLoading(false);
			});
		}
	}, [id]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setEmployee({ ...employee, [name]: value });
		print('Employee:', employee);
	};

	const onSubmit = async (data) => {
		data.role_ids = data.roles;
		console.log('Form submitted:', data);
		setLoading(true);
		if(id) {
			try {
				await api.patch(`/employees/update/${id}`, data);
			} catch (err) {
				console.error('Error creating employee:', err);
			} finally {
				setLoading(false);
			}
		} else {
			try {
				await api.post('/employees/create', data);
			} catch (err) {
				console.error('Error creating employee:', err);
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="p-fluid grid">
			<div className="field mb-1 col-12 md:col-6">
				<label htmlFor="first_name">First Name</label>
				<InputText
					id="first_name"
					name="first_name"
					defaultValue={employee?.first_name}
					onChange={handleChange}
					{...register('first_name', { required: 'First Name is required' })}
					className={classNames('p-inputtext-sm', { 'p-invalid': errors.first_name })}
				/>
				{errors.first_name && <small className="p-error">{errors.first_name.message}</small>}
			</div>
		
			<div className="field mb-1 col-12 md:col-6">
				<label htmlFor="last_name">Last Name</label>
				<InputText
					id="last_name"
					name="last_name"
					defaultValue={employee?.last_name}
					onChange={handleChange}
					{...register('last_name', { required: 'Last Name is required' })}
					className={classNames('p-inputtext-sm', { 'p-invalid': errors.last_name })}
				/>
				{errors.last_name && <small className="p-error">{errors.last_name.message}</small>}
			</div>

			<div className="field mb-1 col-12 md:col-6">
				<label htmlFor="email">Email</label>
				<InputText
					id="email"
					name="email"
					defaultValue={employee?.email}
					onChange={handleChange}
					{...register('email', {
						required: 'Email is required',
						pattern: {
						value: /^\S+@\S+$/i,
						message: 'Invalid email format',
						},
					})}
					className={classNames('p-inputtext-sm', { 'p-invalid': errors.email })}
				/>
				{errors.email && <small className="p-error">{errors.email.message}</small>}
			</div>

			<div className="field mb-1 col-12 md:col-6">
				<label htmlFor="phone">Phone Number</label>
				<InputText
					id="phone"
					name="phone"
					defaultValue={employee?.phone}
					onChange={handleChange}
					{...register('phone', {
						required: 'Phone Number is required',
						pattern: {
							value: /^\d{10}$/,
							message: 'Invalid Phone Number',
						},
					})}
					className={classNames('p-inputtext-sm', { 'p-invalid': errors.phone })}
				/>
				{errors.phone && <small className="p-error">{errors.phone.message}</small>}
			</div>

			<div className="field mb-1 col-12 md:col-6">
				<label htmlFor="gender">Gender</label>
				<Controller
					name="gender"
					control={control}
					rules={{ required: 'Gender is required' }}
					render={({ field }) => (
						<Dropdown
							id={field.name}
							{...field}
							options={genderOptions}
							optionLabel="label"
							placeholder="Select a gender"
							className={classNames('p-inputtext-sm', { 'p-invalid': errors.gender })}
							// onChange={handleChange}
						/>
					)}
				/>
				{errors.gender && <small className="p-error">{errors.gender.message}</small>}
			</div>

			<div className="field mb-1 col-12 md:col-6">
				<label htmlFor="date_of_birth">Date of Birth</label>
				<Controller
					name="date_of_birth"
					control={control}
					rules={{ required: 'Date of Birth is required' }}
					defaultValue={employee?.date_of_birth}
					render={({ field }) => (
						<Calendar
							{...field}
							value={field.value ? new Date(field.value) : employee?.date_of_birth}
							onChange={(e) => field.onChange(e.value)}
							dateFormat="yy-mm-dd"
							placeholder="Date of Birth"
							className={classNames('p-inputtext-sm', { 'p-invalid': errors.date_of_birth })}
							showIcon
							showButtonBar
						/>
					)}
				/>
				{errors.date_of_birth && <small className="p-error">{errors.date_of_birth.message}</small>}
			</div>

			<div className="field mb-1 col-12 md:col-6">
				<label htmlFor="aadhar_number">Aadhar Number</label>
				<InputText
					id="aadhar_number"
					name="aadhar_number"
					defaultValue={employee?.aadhar_number}
					onChange={handleChange}
					{...register('aadhar_number', {
						// required: 'Aadhar Number is required',
						pattern: {
							value: /^\d{12}$/,
							message: 'Invalid Aadhar Number',
						},
					})}
					className={classNames('p-inputtext-sm', { 'p-invalid': errors.aadhar_number })}
				/>
				{errors.aadhar_number && <small className="p-error">{errors.aadhar_number.message}</small>}
			</div>

			<div className="field mb-1 col-12 md:col-6">
				<label htmlFor="email">PAN Number</label>
				<InputText
					id="pan_number"
					name="pan_number"
					defaultValue={employee?.pan_number}
					onChange={handleChange}
					{...register('pan_number', {
						// required: 'PAN Number is required',
						pattern: {
							value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
							message: 'Invalid PAN Number',
						},
					})}
					className={classNames('p-inputtext-sm', { 'p-invalid': errors.pan_number })}
				/>
				{errors.pan_number && <small className="p-error">{errors.pan_number.message}</small>}
			</div>

			<div className="field mb-1 col-12 md:col-6">
				<label htmlFor="roles">Roles</label>
				<Controller
					name="roles"
					control={control}
					rules={{ required: 'At least one role is required' }}
					render={({ field }) => (
						<MultiSelect
							id={field.name}
							{...field}
							options={allRoles}
							optionLabel="label"
							display="chip"
							placeholder="Select roles"
							className={classNames('p-inputtext-sm', { 'p-invalid': errors.roles })}
						/>
					)}
				/>
				{errors.roles && <small className="p-error">{errors.roles.message}</small>}
				{/* <MultiSelect
					id="roles"
					name="roles"
					value={selectedRoles}
					onChange={(e) => {
						setSelectedRoles(e.value)
					}}
					options={allRoles}
					optionLabel="label"
					display="chip"
					placeholder="Select Roles"
					// maxSelectedLabels={3}
					className={classNames('w-full md:w-20rem p-inputtext-sm', { 'p-invalid': errors.roles })}
					{...register('roles', { required: 'Roles is required' })}
				/>
				{errors.roles && <small className="p-error">{errors.roles.message}</small>} */}
			</div>

			<div className="col-12">
				<Image
					image={employee.profile_picture_path || '../public/male.png'}
					alt="Profile"
					className="w-10rem h-10rem border-circle shadow-2"
					style={{ objectFit: 'cover' }}
				/>
				{/* <Avatar className="p-overlay-badge" image="../public/male.png" size="xlarge">
					<Image image="../public/male.png" preview />
				</Avatar> */}
				<FileUpload
					name="profile_picture_path"
					mode="basic"
					accept="image/*"
					maxFileSize={1000000}
					chooseLabel="Upload"
					customUpload
					uploadHandler={(e) => {
						// const file = e.files[0];
						// setValue('profile_picture_path', file);
						// const reader = new FileReader();
						// reader.onloadend = () => {
						// 	setValue('profile_picture_path', reader.result);
						// };
						// reader.readAsDataURL(file);
					}}
					onSelect={(e) => {
						const file = e.files[0];
						setValue('profile_picture_path', file);
					}}
					className="p-inputtext-sm"
				/>
			</div>

			<div className="text-right">
				<Button type="submit" label={id ? 'Update' : 'Create'} className="w-full" size="small" />
			</div>
		</form>
	);
}

export default BasicEmployeeForm;