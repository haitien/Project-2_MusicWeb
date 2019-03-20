import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import styles from './EditProfile.module.css'
import {AppBar, Dialog} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CameraAlt from '@material-ui/icons/CameraAltOutlined'
import Button from "@material-ui/core/Button";
import ReactCrop from 'react-image-crop'
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this._componentMouted = false;
        this.state = {
            avatarSrc: '',
            avatarNew: '',
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
            error: '',
            editPassword: false
        };
        fetch('/api/user/edit_profile').then(res => {
            if (res.status === 401) {
                this.props.history.push('/login')
            } else {
                return res.json()
            }
        }).then(json => {
            this.setState({
                avatarNew: json.avatar,
                avatarSrc: json.avatar,
                username: json.username,
                password: json.password,
                first_name: json.first_name,
                last_name: json.last_name,
                birthday: this.formatDate(json.date_of_birth),
                email: json.email,
                user_id: json.id,
                original: json
            })
        })
    }

    componentDidMount() {
        this._componentMouted = true

    }

    onChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({[name]: value})
    };
    onBlur = (event) => {
        const name = event.target.name;
        switch (name) {
            case 'email':
                this.validateEmail();
                break;
            case 'password':
                // this.validatePassword();
                break;
            case 'password_confirm':
                // this.validatePasswordConfirm();
                break;
            case 'first_name':
            case 'last_name':
                const value = event.target.value;
                // this.validateName(name, value);
                break;
            case 'birthday':
                // this.validateBirthday();
                break;
            default:
                break

        }
    };
    validateEmail() {
        if (this.state.email === this.state.original.email) {
            this.setState({emailInvalid: false})
            return
        }
        const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm;
        if (!emailRegex.test(this.state.email)) {
            this.setState({emailInvalid: true, emailError: 'You need to enter an email !'});
            return;
        } else {
            this.setState({emailInvalid: false})
        }
        console.log('email')
        fetch('/api/register/validate', {
            method: 'POST',
            body: JSON.stringify({email: this.state.email}),
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            }
        }).then(res => {
            return res.json()
        }).then(res1 => {
            if (res1.email) this.setState({emailError: "Email is already in use !"});
            this.setState({emailInvalid: res1.email})
        })
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    render() {
        return (
            <div>
                <AppBar>
                    <Typography variant="h5" color="inherit" onClick={() => {
                        this.props.history.push('/')
                    }}>
                        Home page
                    </Typography>
                </AppBar>
                <Grid container className={styles.main}>
                    <Grid item xs={false} sm={3}>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant='h5'>Edit your profile</Typography>
                        <Grid container>
                            <Grid item xs={false} sm={1}/>
                            <Grid item xs={12} sm={10}>
                                <Grid container>
                                    <Grid item xs={12} sm={5} style={{overFlow: 'hidden'}}>
                                        <div className={styles.avatarHolder}>
                                            <img src={this.state.avatarNew} alt="" className={styles.avatar}/>

                                            {this.state.showCropBtn &&
                                            <Button size='small' variant='contained' color='primary' type='button'
                                                    onClick={this.openCropDialog}>Crop</Button>}

                                            <label className={styles.custom_file_upload}>
                                                <CameraAlt/>
                                                <input type="file" accept='image/*' name='avatar'
                                                       onChange={this.imageChange} className={styles.input_avatar}/>
                                            </label>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={7} style={{overFlow: 'hidden'}}>
                                        <h1>{this.state.first_name + ' ' + this.state.last_name}</h1>
                                        <h3>Username: <span style={{color: '#1E3C51'}}>{this.state.username}</span></h3>
                                        <h3>UserID: <span style={{color: '#1E3C51'}}>{this.state.user_id}</span></h3>
                                    </Grid>
                                    <FormControl margin="normal" fullWidth className={styles.control}>
                                        <InputLabel htmlFor="email">Email</InputLabel>
                                        <Input type='email' id="email" name="email" autoComplete="email"
                                               onChange={this.onChange} onBlur={this.onBlur} value={this.state.email}/>
                                    </FormControl>
                                    {this.state.emailInvalid &&
                                    <div className={styles.alert}>{this.state.emailError}</div>}
                                    <FormControlLabel style={{width: '100%'}}
                                        control={
                                            <Checkbox fullWidth
                                                checked={this.state.editPassword}
                                                onChange={this.setCheck} name="editPassword"/>
                                        }
                                        label="Change password"/>
                                    <FormControl margin="normal" fullWidth className={styles.control}>
                                        <InputLabel htmlFor="password">Old password</InputLabel>
                                        <Input type='password' id="password" name="password" autoComplete="password"
                                               onChange={this.onChange} onBlur={this.onBlur}
                                               disabled={!this.state.editPassword}/>
                                    </FormControl>
                                    {this.state.passwordInvalid &&
                                    <div className={styles.alert}>{this.state.passwordError}</div>}
                                    <FormControl margin="normal" fullWidth className={styles.control}>
                                        <InputLabel htmlFor="password_confirm">New password</InputLabel>
                                        <Input type='password' id="password_confirm" name="password_confirm"
                                               onChange={this.onChange} onBlur={this.onBlur}
                                               disabled={!this.state.editPassword}/>
                                    </FormControl>
                                    {this.state.password2Invalid &&
                                    <div className={styles.alert}>{this.state.password2Error}</div>}
                                    <Grid container spacing={16}>
                                        <Grid item sm={6}>
                                            <FormControl margin="normal" fullWidth className={styles.control}>
                                                <InputLabel htmlFor="first_name">First name</InputLabel>
                                                <Input id="first_name" name="first_name" onChange={this.onChange}
                                                       onBlur={this.onBlur} value={this.state.first_name}/>
                                            </FormControl>
                                            {this.state.firstNameInvalid &&
                                            <div className={styles.alert}>{this.state.firstNameError}</div>}
                                        </Grid>
                                        <Grid item sm={6}>
                                            <FormControl margin="normal" fullWidth className={styles.control}>
                                                <InputLabel htmlFor="last_name">Last name</InputLabel>
                                                <Input id="last_name" name="last_name" onChange={this.onChange}
                                                       onBlur={this.onBlur} value={this.state.last_name}/>
                                            </FormControl>
                                            {this.state.lastNameInvalid &&
                                            <div className={styles.alert}>{this.state.lastNameError}</div>}
                                        </Grid>
                                    </Grid>
                                    <FormControl margin="normal" fullWidth className={styles.control}>
                                        <TextField label="Birthday" type="date" InputLabelProps={{shrink: true}}
                                                   name='birthday'
                                                   style={{marginTop: '15px'}} onChange={this.onChange}
                                                   onBlur={this.onBlur} value={this.state.birthday}/>
                                        {this.state.birthdayInvalid &&
                                        <div className={styles.alert}>{this.state.birthdayError}</div>}
                                    </FormControl>
                                    <Button type="submit" fullWidth variant="contained" color="secondary"
                                            className={styles.button}>
                                        Edit your profile
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={false} sm={3}>
                        <Dialog open={this.state.showCropDialog} onClose={this.closeCropDialog}>
                            <DialogTitle>Crop your avatar image: </DialogTitle>
                            <ReactCrop src={this.state.avatarSrc} onComplete={this.completeCropDialog}
                                       onChange={this.onCropChange} crop={this.state.crop}/>
                            <Button onClick={this.doneCropDialog} fullWidth>Done</Button>
                        </Dialog>
                    </Grid>

                </Grid>

            </div>
        )
    }

    setCheck = (event) => {
        this.setState(preState => ({
            editPassword: !preState.editPassword
        }))
    };
    imageChange = (event) => {
        if (event.target.files.length === 1) {
            const url = URL.createObjectURL(event.currentTarget.files[0]);
            this.setState({avatarSrc: url, showCropBtn: true, avatarNew: url, avatarBlob: event.target.files[0]});
            this.cropImage(url, null)
        }
    };
    onCropChange = (crop) => {
        this.setState({crop});
    };
    openCropDialog = () => {
        this.setState({showCropDialog: true})
    };
    closeCropDialog = () => {
        this.setState({showCropDialog: false})
    };
    completeCropDialog = (crop, pixel) => {
        this.setState({crop, pixelCrop: pixel});
    };
    doneCropDialog = async () => {
        this.setState({showCropDialog: false});
        this.cropImage(this.state.avatarSrc, this.state.pixelCrop)
    };

    cropImage(source, pixelCrop) {
        const img = new Image();
        img.src = source;
        img.onload = () => {
            if (pixelCrop == null) {
                pixelCrop = {};
                const width = img.width;
                const height = img.height;
                if (width > height) {
                    pixelCrop.width = height;
                    pixelCrop.height = height;
                    pixelCrop.x = width / 2 - height / 2;
                    pixelCrop.y = 0
                } else {
                    pixelCrop.width = width;
                    pixelCrop.height = width;
                    pixelCrop.x = 0;
                    pixelCrop.y = height / 2 - width / 2
                }
            }
            const targetSize = (pixelCrop.width > 250) ? 250 : pixelCrop.width;
            const canvas = document.createElement('canvas');
            canvas.setAttribute('width', targetSize);
            canvas.setAttribute('height', targetSize);
            const context = canvas.getContext('2d');
            context.drawImage(
                img,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.width,
                0,
                0,
                targetSize,
                targetSize
            );
            canvas.toBlob(blob => {
                // blob.name = 'new_name';
                const blobUrl = URL.createObjectURL(blob);
                this.setState({avatarNew: blobUrl, avatarBlob: blob})
            }, 'image/jpeg')
        }
    }
}

export default EditProfile;