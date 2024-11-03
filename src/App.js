import React from 'react';
import './App.scss';
import Routes from './pages/Routes';
import { useAuthContext } from './contexts/AuthContext';
import Loader from './components/Loader';

function App() {

    const { loading } = useAuthContext()

    return (
        <>
            {!loading
                ? <Routes />
                : <Loader />
            }
        </>
    );
}

export default App;