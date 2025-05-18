import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios';
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
	const navigate = useNavigate()
	// const [user, setUser] = useState(null)
	const [tokens, setTokens] = useState(() => {
		const access = localStorage.getItem('access_token');
		const refresh = localStorage.getItem('refresh_token');
		return access && refresh ? { access, refresh } : null;
	});

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// const fetchUser = async () => {
		// 	setLoading(true);
		// 	try {
		// 		if (tokens?.access) {
		// 			const res = await api.get('auth/user/', {
		// 			headers: { Authorization: `Bearer ${tokens.access}` },
		// 			});
		// 			setUser(res.data);
		// 		}
		// 	} catch (err) {
		// 		logout(); // token invalid or expired
		// 	} finally {
		// 		setLoading(false);
		// 	}
		// };

		// fetchUser();
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

			// const userRes = await api.get('auth/user/', {
			// 	headers: { Authorization: `Bearer ${access}` },
			// });

			// setUser(userRes.data);
			navigate('/dashboard');
		} catch (err) {
			throw err.response?.data?.detail || 'Login failed';
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		setTokens(null);
		// setUser(null);
		localStorage.clear();
		navigate('/');
	};

	return (
		<AuthContext.Provider value={{ tokens, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext);