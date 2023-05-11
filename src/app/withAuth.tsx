import { useEffect, useState } from 'react';
import axios from 'axios';

const withAuth = (WrappedComponent: React.ComponentType) => {
    const AuthenticatedComponent: React.FC = (props) => {
        const [authChecked, setAuthChecked] = useState(false);

        useEffect(() => {
            const token = localStorage.getItem('token');

            const checkTokenValidity = async () => {
                try {
                    if (!token) {
                        window.location.href = '/login'; // Redirect to login page if there is no token
                    } else {
                        const response = await axios.post('https://localhost:44326/api/auth/token', {
                            Tkey: token,
                        });

                        if (response.status !== 200) {
                            window.location.href = '/login'; // Redirect to login page if token is invalid
                        }
                    }
                } catch (error) {
                    console.error(error);
                    window.location.href = '/login'; // Redirect to login page if there is any error
                } finally {
                    setAuthChecked(true); // Set authChecked to true after the authentication check is complete
                }
            };

            checkTokenValidity();
        }, []);

        // Render the WrappedComponent only when the authentication check is complete
        return authChecked ? <WrappedComponent {...props} /> : null;
    };

    return AuthenticatedComponent;
};

export default withAuth;
