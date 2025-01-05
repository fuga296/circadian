import { BrowserRouter as Router } from 'react-router-dom';
import "./App.css"
import CircadianRoute from './circadian/routes/CircadianRoute';

const App = () => {
    return (
        <Router>
            <div className="App">
                <CircadianRoute />
            </div>
        </Router>
    );
}

export default App;