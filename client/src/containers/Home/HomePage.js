import React, {Component} from 'react'
import Button from "@material-ui/core/Button";

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logged: false,
            user_id: '',
            first_name: '',
            is_admin: ''
        };
        fetch('/api/is-logged').then(res => {
            return res.json()
        }).then(json => {
            if (json.id)
                this.setState({logged: true, user_id: json.id, first_name: json.name, is_admin: json.admin})
        })
    }

    logout = () => {
        fetch('/api/logout').then(res => {
            return res.json()
        }).then(json => {
            if (json.result) this.setState({logged: false})
        })
    };

    render() {
        return (
            <div className="App">
                <h1>Home Page</h1>
                {this.state.logged ?
                    <div>Hello {this.state.first_name}
                        <div>
                            <Button variant='contained' onClick={this.logout}>Log out</Button>
                            <Button variant='contained' onClick={()=>{this.props.history.push('/user/edit')}}>Edit your profile</Button>
                        </div>
                    </div> :
                    <div>
                        <Button variant='contained' onClick={()=>{this.props.history.push('/login')}}>Login</Button>
                    </div>}
            </div>
        );
    }
}

export default HomePage;