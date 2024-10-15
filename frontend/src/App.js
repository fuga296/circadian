import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './components/AppRoutes';
import "./App.css"

const AppContent = () => {
    return <AppRoutes />;
}

const App = () => {
    return (
        <Router>
            <div className="App">
                <AppContent />
            </div>
        </Router>
    );
}

export default App;