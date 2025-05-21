import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Image } from 'primereact/image';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const genderOptions = [
	{ label: 'Male', value: 1 },
	{ label: 'Female', value: 2 }
];

const EmployeeBasicForm = ({ toast, employee_id }) => {
	const [ loading, setLoading ] = useState(false);
	const [ employee, setEmployee ] = useState({});
	const { currentEmployee } = useAuth();
	const [ selectedFile, setSelectedFile ] = useState(null);
	const [ roles, setRoles ] = useState([]);
	const navigate = useNavigate()

	const handleFileSelect = (e) => {
		if (e.files && e.files.length > 0) {
			const file = e.files[0];
			const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

			if (!allowedTypes.includes(file.type)) {
				toast({ severity: 'error', summary: 'Invalid File', detail: 'Only PNG, JPG, and JPEG images are allowed' });
				return;
			}

			setSelectedFile(file);
		}
	};

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({});

	useEffect(() => {
		if (employee_id) {
			setLoading(true);
			api.get(`/employees/${employee_id}`).then((res) => {
				const data = res.data.data;
				setEmployee(data);

				setValue('first_name', data.first_name);
				setValue('last_name', data.last_name);
				setValue("gender", data?.gender || '')
				setValue('email', data.email);
				setValue('phone', data.phone);
				setValue('date_of_birth', data.date_of_birth);
				setValue('date_of_joining', data.date_of_joining);
				setValue('aadhar_number', data.aadhar_number);
				setValue('pan_number', data.pan_number);
				setValue('roles', data?.roles || []);
				setValue('profile_picture_path', data.profile_picture_path);
			}).catch(() => {
				// handle error or show toast
			}).finally(() => {
				setLoading(false);
			});
		}
	}, [employee_id]);

	useEffect(() => {
		setLoading(true);
		api.get('/employees/roles').then((res) => {
			const data = res.data.data;
			setRoles(data);
		}).catch(() => {
			// handle error or show toast
		}).finally(() => {
			setLoading(false);
		});
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setEmployee({ ...employee, [name]: value });
	};

	const formatDate = (date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0'); // month is 0-based
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	const onSubmit = async (data) => {
		setLoading(true);

		// Format the date
		const formattedDOB = formatDate(new Date(data.date_of_birth));
		const formattedDJ = formatDate(new Date(data.date_of_joining))

		// Create FormData
		const formData = new FormData();
		formData.append('company_id', currentEmployee.company_id);
		formData.append('type_id', 1);
		formData.append('first_name', data.first_name);
		formData.append('last_name', data.last_name);
		formData.append('gender', data.gender);
		formData.append('email', data.email);
		formData.append('phone', data.phone);
		formData.append('date_of_birth', formattedDOB);
		formData.append('date_of_joining', formattedDJ);
		formData.append('aadhar_number', data.aadhar_number);
		formData.append('pan_number', data.pan_number);

		data.roles.forEach(roleId => {
			formData.append('roles', roleId);
		});

		if (selectedFile instanceof File) {
			formData.append('profile_picture_path', selectedFile);
		} else {
			toast({ severity: 'error', summary: 'Error', detail: 'No valid file selected' });
		}

		try {
			if (employee_id) {
				await api.patch(
					`/employees/update/${employee_id}`,
					formData
				);
				toast({ severity: 'success', summary: 'Updated', detail: 'Updated employee information successfully!' });
			} else {
				await api.post('/employees/create', formData).then((res) => {
					const createdId = res.data.data.employee_id;
					// setEmployee({ ...employee, employee_id: createdId });
					toast({ severity: 'success', summary: 'Created', detail: 'Created new employee successfully!' });
					navigate(`/employee/${createdId}/update`);
				});
			}
		} catch (err) {
			toast({ severity: 'error', summary: 'Error', detail: 'Failed to update employee information' });
		} finally {
			setLoading(false);
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
					render={({ field }) => (
						<Calendar
							{...field}
							value={field.value ? new Date(field.value) : null}
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
							options={roles}
							optionLabel="role_name"
							optionValue='role_id'
							display="chip"
							placeholder="Select roles"
							disabled={loading}
							className={classNames('p-inputtext-sm', { 'p-invalid': errors.roles })}
						/>
					)}
				/>
				{errors.roles && <small className="p-error">{errors.roles.message}</small>}
			</div>
			
			<div className="field mb-1 col-12 md:col-6">
				<label htmlFor="date_of_joining">Date of Joining</label>
				<Controller
					name="date_of_joining"
					control={control}
					rules={{ required: 'Date of joining is required' }}
					render={({ field }) => (
						<Calendar
							{...field}
							value={field.value ? new Date(field.value) : null}
							onChange={(e) => field.onChange(e.value)}
							dateFormat="yy-mm-dd"
							placeholder="Date of Joining"
							className={classNames('p-inputtext-sm', { 'p-invalid': errors.date_of_joining })}
							showIcon
							showButtonBar
						/>
					)}
				/>
				{errors.date_of_joining && <small className="p-error">{errors.date_of_joining.message}</small>}
			</div>

			<div className="col-12">
				<Image src={selectedFile?.objectURL || employee?.profile_picture_path} zoomSrc={selectedFile?.objectURL || employee?.profile_picture_path} alt="Image" width="90" height="80" preview={true} />
				<FileUpload
					name="profile_picture_path"
					mode="basic"
					accept="image/*"
					maxFileSize={1000000}
					auto={false}
					customUpload={false}
					chooseLabel="Upload"
					onSelect={handleFileSelect}
					className="p-inputtext-sm"
					previewWidth={0}
				/>
			</div>

			<div className="text-right">
				<Button type="submit" label={employee_id ? 'Update' : 'Create'} className="w-full" size="small" />
			</div>
		</form>
	);
}

export default EmployeeBasicForm;