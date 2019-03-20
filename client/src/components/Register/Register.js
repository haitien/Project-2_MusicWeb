import React, {Component} from 'react'
import styles from './Register.module.css'
import Grid from "@material-ui/core/Grid";
import {Dialog, Paper, Typography} from "@material-ui/core";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import avatar from './../../images/avatar.png'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css';
import DialogTitle from "@material-ui/core/DialogTitle";

const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            avatarSrc: avatar,
            avatarNew: avatar,
            avatarBlob: null,
            showCropBtn: false,
            showCropDialog: false,
            crop: {
                x: 20,
                y: 10,
                width: 30,
                height: 10,
                aspect: 1
            },
            username: '',
            password: '',
            password_confirm: '',
            first_name: '',
            last_name: '',
            email: '',
            birthday: '',
            usernameInvalid: false,
            passwordInvalid: false,
            password2Invalid: false,
            firstNameInvalid: false,
            lastNameInvalid: false,
            emailInvalid: false,
            birthdayInvalid: false,
            usernameError: '',
            passwordError: '',
            password2Error: '',
            firstNameError: '',
            lastNameError: '',
            emailError: '',
            birthdayError: '',
            error: ''
        }
        // fetch(avatar).then(res=>{
        //     return res.blob()
        // }).then(blob=>{
        //     this.setState({avatarBlob: blob})
        // })
    }
    componentWillUnmount(){

    }
    onChange = (event) => {
        const value = event.target.value
        const name = event.target.name
        this.setState({[name]: value})
    }
    onBLur = (event) => {
        const name = event.target.name
        switch (name) {
            case 'username':
                this.validateUsername()
                break
            case 'email':
                this.validateEmail()
                break
            case 'password':
                this.validatePassword()
                break
            case 'password_confirm':
                this.validatePasswordConfirm()
                break
            case 'first_name':
            case 'last_name':
                const value = event.target.value
                this.validateName(name, value)
                break
            case 'birthday':
                this.validateBirthday()
                break
            default:
                break
        }
    }

    validateUsername() {
        const normalRegex = /^[a-z0-9_-]{3,16}$/
        if (!normalRegex.test(this.state.username)) {
            this.setState({
                usernameInvalid: true,
                usernameError: 'Username must have 3-16 characters & don\'t contain special characters !'
            })
            return;
        } else {
            this.setState({usernameInvalid: false})
        }
        fetch('api/register/validate', {
            method: 'POST',
            body: JSON.stringify({username: this.state.username}),
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            }
        }).then(res => {
            return res.json()
        }).then(res => {
            if (res.username) this.setState({usernameError: "Username is already in use !"})
            this.setState({usernameInvalid: res.username})
        })
    }

    validateEmail() {
        const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm
        if (!emailRegex.test(this.state.email)) {
            this.setState({emailInvalid: true, emailError: 'You need to enter an email !'})
            return;
        } else {
            this.setState({emailInvalid: false})
        }
        fetch('api/register/validate', {
            method: 'POST',
            body: JSON.stringify({email: this.state.email}),
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            }
        }).then(res => {
            return res.json()
        }).then(res1 => {
            if (res1.email) this.setState({emailError: "Email is already in use !"})
            this.setState({emailInvalid: res1.email})
        })
    }

    validatePassword() {
        const regex = /(?=.{8,})/
        if (!regex.test(this.state.password)) {
            this.setState({passwordInvalid: true, passwordError: 'Password must be 8 characters or longer !'})
        } else {
            this.setState({passwordInvalid: false})
        }
    }

    validatePasswordConfirm() {
        if (this.state.password !== this.state.password_confirm) {
            this.setState({password2Invalid: true, password2Error: "Password not match !"})
        } else {
            this.setState({password2Invalid: false})
        }
    }

    validateName(name, value) {
        const regex = /^[A-Za-z][A-Za-z']+([ A-Za-z][A-Za-z']+)*/
        const match = regex.test(value)
        if (name === "first_name") {
            this.setState({firstNameInvalid: !match})
            this.setState({firstNameError: match || "First name is wrong !"})
        } else {
            this.setState({lastNameInvalid: !match})
            this.setState({lastNameError: match || "Last name is wrong !"})
        }
    }

    validateBirthday() {
        const date = Date.parse(this.state.birthday)
        if (date && date < Date.now()) {
            this.setState({birthdayInvalid: false})
        } else {
            this.setState({birthdayInvalid: true, birthdayError: 'Your birtday is wrong !'})
        }
    }

    register = (event) => {
        event.preventDefault()
        const valid = !this.state.usernameInvalid && !this.state.passwordInvalid && !this.state.password2Invalid && !this.state.firstNameInvalid && !this.state.lastNameInvalid && !this.state.emailInvalid && !this.state.birthdayInvalid
        const form = new FormData()
        form.append('username',this.state.username)
        form.append('password',this.state.password)
        form.append('email',this.state.email)
        form.append('first_name',this.state.first_name)
        form.append('last_name',this.state.last_name)
        form.append('birthday',this.state.birthday)
        form.append('avatar', this.state.avatarBlob)
        fetch('api/register',{
            method: 'POST',
            body: form
        }).then(res=>{
            return res.json()
        }).then(json=>{
            if (json.result) {
                this.props.history.push('/login')
                this.setState({error: ''})
            } else {
                this.setState({error: 'Error ! Please try again '})
            }
        })
    }

    render() {
        return (
            <Grid container>
                <Grid item sm={3} xs={false}></Grid>
                <Grid item sm={6}>
                    <Paper className={styles.paper}>
                        <form onSubmit={this.register}>
                            <Grid container>
                                <Grid item sm={7} xs={7} className={styles.main}>
                                    <Typography component='h1' variant='h4' className={styles.header}>Sign
                                        up</Typography>
                                    {this.state.error !== '' && <div style={{textSize:'16px', color: "#FF322A"}}>{this.state.error}</div>}
                                    <FormControl margin="normal" required fullWidth className={styles.control}>
                                        <InputLabel htmlFor="username">Username</InputLabel>
                                        <Input id="username" name="username" autoComplete="username" autoFocus
                                               onChange={this.onChange} onBlur={this.onBLur}/>
                                    </FormControl>
                                    {this.state.usernameInvalid &&
                                    <div className={styles.alert}>{this.state.usernameError}</div>}
                                    <FormControl margin="normal" required fullWidth className={styles.control}>
                                        <InputLabel htmlFor="email">Email</InputLabel>
                                        <Input type='email' id="email" name="email" autoComplete="email"
                                               onChange={this.onChange} onBlur={this.onBLur}/>
                                    </FormControl>
                                    {this.state.emailInvalid &&
                                    <div className={styles.alert}>{this.state.emailError}</div>}
                                    <FormControl margin="normal" required fullWidth className={styles.control}>
                                        <InputLabel htmlFor="password">Password</InputLabel>
                                        <Input type='password' id="password" name="password" autoComplete="password"
                                               onChange={this.onChange} onBlur={this.onBLur}/>
                                    </FormControl>
                                    {this.state.passwordInvalid &&
                                    <div className={styles.alert}>{this.state.passwordError}</div>}
                                    <FormControl margin="normal" required fullWidth className={styles.control}>
                                        <InputLabel htmlFor="password_confirm">Password confirm</InputLabel>
                                        <Input type='password' id="password_confirm" name="password_confirm" onChange={this.onChange} onBlur={this.onBLur}/>
                                    </FormControl>
                                    {this.state.password2Invalid &&
                                    <div className={styles.alert}>{this.state.password2Error}</div>}
                                    <Grid container spacing={16}>
                                        <Grid item sm={6}>
                                            <FormControl margin="normal" required fullWidth className={styles.control}>
                                                <InputLabel htmlFor="first_name">First name</InputLabel>
                                                <Input id="first_name" name="first_name" onChange={this.onChange}
                                                       onBlur={this.onBLur}/>
                                            </FormControl>
                                            {this.state.firstNameInvalid &&
                                            <div className={styles.alert}>{this.state.firstNameError}</div>}
                                        </Grid>
                                        <Grid item sm={6}>
                                            <FormControl margin="normal" required fullWidth className={styles.control}>
                                                <InputLabel htmlFor="last_name">Last name</InputLabel>
                                                <Input id="last_name" name="last_name" onChange={this.onChange}
                                                       onBlur={this.onBLur}/>
                                            </FormControl>
                                            {this.state.lastNameInvalid &&
                                            <div className={styles.alert}>{this.state.lastNameError}</div>}
                                        </Grid>
                                    </Grid>
                                    <FormControl margin="normal" required fullWidth className={styles.control}>
                                        <TextField label="Birthday" type="date" InputLabelProps={{shrink: true}}
                                                   name='birthday'
                                                   style={{marginTop: '15px'}} onChange={this.onChange}
                                                   onBlur={this.onBLur} required/>
                                        {this.state.birthdayInvalid &&
                                        <div className={styles.alert}>{this.state.birthdayError}</div>}
                                    </FormControl>
                                    <Button type="submit" fullWidth variant="contained" color="secondary"
                                            className={styles.button}>
                                        Create your account
                                    </Button>
                                </Grid>
                                <Grid className={styles.right} item sm={5} xs={5}>
                                    <div className={styles.avatarHolder}>
                                        <img src={this.state.avatarNew} alt="" className={styles.avatar}/>
                                        <div></div>
                                        {this.state.showCropBtn &&
                                        <Button size='small' variant='contained' color='primary' type='button'
                                                onClick={this.openCropDialog}>Crop</Button>}
                                    </div>
                                    <div className={styles.file}>
                                        <Typography variant='h6' align='center'>UPLOAD AVATAR</Typography>
                                        <input type='file' accept='image/*' name='avatar'
                                               onChange={this.imageChange.bind(this)}/>
                                    </div>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                    {/*<img src="https://dl.dropboxusercontent.com/s/79str86hrq4zp2k/a.jpg?dl=0" alt=""/>*/}
                </Grid>
                <Grid item sm={3} xs={false}>
                    <Dialog open={this.state.showCropDialog} onClose={this.closeCropDialog}>
                        <DialogTitle>Crop your avatar image: </DialogTitle>
                        <ReactCrop src={this.state.avatarSrc} onComplete={this.completeCropDialog}
                                   onChange={this.onCropChange} crop={this.state.crop}/>
                        <Button onClick={this.doneCropDialog} fullWidth>Done</Button>
                    </Dialog>
                </Grid>
            </Grid>
        );
    }

    imageChange(event) {
        if (event.target.files.length === 1) {
            const url = URL.createObjectURL(event.target.files[0])
            this.setState({avatarSrc: url, showCropBtn: true, avatarNew: url, avatarBlob: event.target.files[0]})
        }
    }

    onCropChange = (crop) => {
        this.setState({crop});
    }
    openCropDialog = (event) => {
        this.setState({showCropDialog: true})
    }
    closeCropDialog = (event) => {
        this.setState({showCropDialog: false})
    }
    completeCropDialog = (crop, pixel) => {
        this.setState({crop, pixelCrop: pixel});
    }
    preloadImage = (url, crossOrigin = 'anonymous') => (
        new Promise((resolve, reject) => {
            let img = new Image();
            img.crossOrigin = crossOrigin;
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url
        })
    );
    doneCropDialog = async (event) => {
        this.setState({showCropDialog: false})
        const image = await this.preloadImage(this.state.avatarSrc)
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', this.state.pixelCrop.width);
        canvas.setAttribute('height', this.state.pixelCrop.height);
        const context = canvas.getContext('2d');
        context.drawImage(
            image,
            this.state.pixelCrop.x,
            this.state.pixelCrop.y,
            this.state.pixelCrop.width,
            this.state.pixelCrop.height,
            0,
            0,
            this.state.pixelCrop.width,
            this.state.pixelCrop.height
        );
        canvas.toBlob(blob => {
            blob.name = 'new_name'
            const blobUrl = URL.createObjectURL(blob);
            this.setState({avatarNew: blobUrl, avatarBlob: blob})
        }, 'image/jpeg')
    }
}

export default Register;