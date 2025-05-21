import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios';
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
	const navigate = useNavigate()
	const [currentEmployee, setCurrentEmployee] = useState({})
	const [tokens, setTokens] = useState(() => {
		const access = localStorage.getItem('access_token');
		const refresh = localStorage.getItem('refresh_token');
		return access && refresh ? { access, refresh } : null;
	});

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (tokens?.access) {
			const decoded = jwtDecode(tokens.access);

			setCurrentEmployee({
				employee_id: decoded.employee_id,
				first_name: decoded.first_name,
				last_name: decoded.last_name,
				company_id: decoded.company_id
			});
		} else {
			logout();
		}
	}, [tokens]);

	const login = async (credentials) => {
		setLoading(true);
		try {
			const res = await api.post('auth/token', credentials);
			const access = res.data.access_token
			const refresh = res.data.refresh_token;

			setTokens({ access, refresh });
			localStorage.setItem('access_token', access);
			localStorage.setItem('refresh_token', refresh);

			navigate('/dashboard');
		} catch (err) {
			throw err.response?.data?.detail || 'Login failed';
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		setTokens(null);
		setCurrentEmployee({});
		localStorage.clear();
		navigate('/');
	};

	return (
		<AuthContext.Provider value={{ tokens, login, logout, currentEmployee, loading }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext);