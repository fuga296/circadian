import { Route, Routes } from 'react-router-dom';
import Warning from './cheering/Warning';
// import Message from './cheering/Message';

function CheeringApp() {
    return (
        <Routes>
            <Route path='/cheering'>
                <Route path='warning' element={<Warning />} />
                {/* <Route path='message' element={<Message />} /> */}
            </Route>
        </Routes>
    );
}

export default CheeringApp;