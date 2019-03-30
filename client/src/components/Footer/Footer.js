import React, {Component} from "react";
import Button from "@material-ui/core/Button";
import {withRouter} from "react-router-dom";

class Footer extends Component {

    constructor(props, context) {
        super(props);
        this.state = {redirect: false}
    }

    goTo = () => {
        this.props.history.push('/about')
    }

    render() {
        return (
            <div style={{flex: '0 0 100px', backgroundColor: '#2c2c2c', display: "flex", justifyContent:'center',alignItems:'center'}}>
                <Button color='primary' variant='contained' onClick={this.goTo}>About ReactJS
                </Button>
            </div>
        )
    };
}

export default withRouter(Footer);