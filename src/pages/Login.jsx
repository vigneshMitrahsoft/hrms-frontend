import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust the import based on your project structure

const Login = () => {
	const { login, loading } = useAuth();
	const [credentials, setCredentials] = useState({ email: '', password: '' });

	const handleChange = (e) =>
		setCredentials({ ...credentials, [e.target.name]: e.target.value });

	const handleLogin = async () => {
		try {
			await login(credentials);
		} catch (err) {
			alert(err);
		}
	};

	return (
		<div className="grid">
			<div className="col">
				<div className="p-3"></div>
			</div>
			<div className="col">
				<div className="p-3">
					<Panel header="HRMS Login" className="mx-auto mt-5">
						<div className="p-fluid grid formgrid">
							<div className="field col-12 mb-3">
								<label htmlFor="email">Email</label>
								<InputText id="email" name="email" value={credentials.email} onChange={handleChange} />
							</div>
							<div className="field col-12 mb-3">
								<label htmlFor="password">Password</label>
								<Password id="password" name="password" value={credentials.password} onChange={handleChange} toggleMask />
							</div>
							<div className="field col-12">
							<Button label={loading ? 'Logging in...' : 'Login'} className="w-full" onClick={handleLogin} disabled={loading} />
							</div>
						</div>
					</Panel>
				</div>
			</div>
			<div className="col">
				<div className="p-3"></div>
			</div>
		</div>
	);
};

export default Login;