import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext';
import { injectLogout } from './api/axios';
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import HRDashboard from './pages/HRDashboard'
import Employees from './pages/Employees'
import EmployeeForms from './pages/EmployeeForms';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';

function App() {
	const { logout } = useAuth();

	useEffect(() => {
		injectLogout(logout);
	}, [logout]);

	return (
		<Routes>
			<Route path="/" element={<Login />} />
			{/* <Route element={<PrivateRoute />}> */}
				<Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
				<Route path="/hr-dashboard" element={<PrivateRoute><HRDashboard /></PrivateRoute>} />
				<Route path="/employees" element={<PrivateRoute><Employees /></PrivateRoute>} />
				<Route path="/employee/new" element={<PrivateRoute><EmployeeForms /></PrivateRoute>} />
				<Route path="/employee/:id/update" element={<PrivateRoute><EmployeeForms /></PrivateRoute>} />
				<Route path="/profile" element={<Profile />} />
			{/* </Route> */}
		</Routes>
	)
}

export default App