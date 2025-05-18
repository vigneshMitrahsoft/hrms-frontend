import axios from 'axios'

let authLogout = null;

export const injectLogout = (logoutFn) => {
	authLogout = logoutFn;
};

const api = axios.create({
	baseURL: 'http://127.0.0.1:8000/api',
	headers: { 'Content-Type': 'application/json' }
});

// Define whitelist rules with both path and method
const tokenExcludedRoutes = [
	{ path: '/login', method: 'POST' },
	{ path: '/register', method: 'POST' },
];

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('access_token');

	// Normalize method to uppercase
	// const method = config.method?.toUpperCase();
	const url = new URL(config.url, api.defaults.baseURL).pathname;

	const isExcluded = tokenExcludedRoutes.some(
		(route) =>
		route.path === url
		// && route.method === method
	);

	if (token && !isExcluded) {
		config.headers['Authorization'] = `Bearer ${token}`;
	}

	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401 && authLogout) {
			authLogout();
		}

		return Promise.reject(error);
	}
);  


export default api;