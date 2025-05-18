import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children }) => {
	const { tokens, loading } = useAuth()
	if (loading) {
		return <div className="p-4">Loading...</div>; // or spinner
	}

	return tokens && tokens.access ? children : <Navigate to="/" />
}

export default PrivateRoute;