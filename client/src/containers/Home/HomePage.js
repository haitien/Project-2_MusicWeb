import React, {Component} from 'react'
import Button from "@material-ui/core/Button";

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: false,
            user_id: '',
            first_name: '',
            is_admin: ''
        };
        fetch('/api/is_login').then(res => {
                return res.json()
        }).then(json => {
            if (json) {
                this.setState({login: true, user_id: json.id, first_name: json.first_name, is_admin: json.is_admin,username: json.username})
            } else {
                this.setState({login: false})
            }
        })
    }

    logout = () => {
        fetch('/api/logout').then(res => {
            return res.json()
        }).then(json => {
            if (json.result) this.setState({login: false})
        })
    };

    render() {
        return (
            <div className="App">
                <h1>Home Page</h1>
                {this.state.login ?
                    <div>Hello {this.state.first_name}
                        <div>
                            <Button variant='contained' onClick={this.logout} color='primary'>Log out</Button>
                            <Button variant='contained' color='primary' onClick={() => {
                                this.props.history.push('/user/edit')
                            }}>Edit your profile</Button>
                        </div>
                    </div> :
                    <div>
                        <Button color='primary' variant='contained' onClick={() => {
                            this.props.history.push('/login')
                        }}>Login</Button>
                        <Button color='primary' variant='contained' onClick={() => {
                            this.props.history.push('/register')
                        }}>Register</Button>
                    </div>}

                <Button color='primary' variant='contained' onClick={() => {
                    this.props.history.push('/about')
                }}>About</Button>
            </div>
        );
    }
}

export default HomePage;