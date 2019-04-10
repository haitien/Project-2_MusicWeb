import React from 'react';
import {Link} from "react-router-dom";

class Unauthorized extends React.Component {
    render() {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',flexDirection:'column'}}>
                <h1 style={{fontSize: '80px'}}>401</h1>
                <h2>You are not authotized for selected action</h2>
                <h3>Go to login page  <Link to='/login'>Login</Link></h3>

            </div>
        )
    }
}

export default Unauthorized;