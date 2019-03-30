import React, {Component} from 'react'
import styles from './Register.module.css'
import Grid from "@material-ui/core/Grid";
import {Dialog, Paper, Typography} from "@material-ui/core";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css';
import DialogTitle from "@material-ui/core/DialogTitle";
import CustomValidator from '../../js/custom_validator';
import validator from 'validator';
import axios from 'axios';
import AppConstants from '../../js/app_constant'
import API from '../../js/api_constants';
import {actionLogin} from "../../js/store";
import {connect} from "react-redux";
import LinearProgress from "@material-ui/core/LinearProgress";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

class Register extends Component {
    constructor(props) {
        super(props);
        const temp = {isInvalid: false, message: ''};
        this.state = {
            //avatar
            avatarSrc: AppConstants.AVATAR_URL,
            avatarNew: AppConstants.AVATAR_URL,
            avatarBlob: null,
            // crop
            showCropBtn: false,
            showCropDialog: false,
            crop: {x: 20, y: 10, width: 30, height: 10, aspect: 1},
            // data
            username: '',
            email: '',
            password: '',
            password_confirm: '',
            first_name: '',
            last_name: '',
            birthday: '',
            //error
            _username: temp,
            _email: temp,
            _password: temp,
            _password_confirm: temp,
            _first_name: temp,
            _last_name: temp,
            _birthday: temp,
            error: '',
            loading: false,
            showPass: false
        };

        this.validator = new CustomValidator({
            username: {
                methods: [validator.matches],
                args: [AppConstants.REGEX_USERNAME],
                messages: ['Username must have 3-16 characters & don\'t contain special characters']
            },
            email: {
                methods: [validator.isEmail],
                messages: ['That is not a valid email']
            },
            password: {
                methods: [validator.matches],
                args: [AppConstants.REGEX_PASSWORD],
                messages: ['Password must be 8 characters or longer']
            },
            password_confirm: {
                methods: [(pass_confirm) => (pass_confirm === this.state.password)],
                messages: ['Password confirm not match password']
            },
            first_name: {
                methods: [validator.matches],
                args: [AppConstants.REGEX_NAME],
                messages: ['First name is wrong']
            },
            last_name: {
                methods: [validator.matches],
                args: [AppConstants.REGEX_NAME],
                messages: ['Last name is wrong']
            },
            birthday: {
                methods: [validator.isBefore],
                messages: ['Your birthday is wrong']
            }
        })
    }

    onChange = (event) => {
        const {value, name} = event.target;
        this.setState({[name]: value});
        const result = this.validator.validate({[name]: value});
        this.setState({['_' + name]: result});
        return result.isInvalid;
    };

    onBlur = (event) => {
        this.setState({error: ''});
        const name = event.target.name;
        switch (name) {
            case 'username':
                this.validateUsername();
                break;
            case 'email':
                this.validateEmail();
                break;
            default:
        }
    };

    validateUsername = () => {
        const {isInvalid} = this.validator.validate({username: this.state.username});
        if (isInvalid) return;
        axios.post(API.GUEST + API.VALIDATE, {username: this.state.username}).then(res => {
            if (res.data.username) {
                this.setState({_username: {isInvalid: true, message: 'Name is already in use !'}})
            } else {
                this.setState({_username: {isInvalid: false, message: ''}})
            }
        }).catch(err=>{});
    };

    validateEmail = () => {
        const {isInvalid} = this.validator.validate({email: this.state.email});
        if (isInvalid) return;
        axios.post(API.GUEST + API.VALIDATE, {email: this.state.email}).then(res => {
            if (res.data.email) {
                this.setState({_email: {isInvalid: true, message: 'Email is already in use !'}})
            } else {
                this.setState({_email: {isInvalid: false, message: ''}})
            }
        }).catch(err=>{});
    };


    register = (event) => {
        this.setState({loading: true, error: ''});
        event.preventDefault();
        const result = this.validator.validateAll(this.state);
        const form = new FormData();
        console.log('validate result ',result);
        Object.keys(result).filter(key => (key !== 'isValid')).forEach(item => {
            this.setState({['_' + item]: result[item]});
            item !== 'password_confirm' && form.append(item, this.state[item]);
        });
        if (!result.isValid) {
            this.setState({loading: false, error: ''});
            return;
        }
        form.append('avatar', this.state.avatarBlob);
        axios.post(API.GUEST + API.REGISTER, form).then(response => {
            const user = response.data;
            this.props.actionLogin(user);
            // TODO retore old path
            this.setState({error: ''});
            this.props.history.push('/')
        }).catch(error=>{
            this.setState({loading: false, error: 'Error! Please try again '})
        });
    };

    render() {
        const {_username, _email, _password, _password_confirm, _first_name, _last_name, _birthday, error, avatarSrc, avatarNew, showPass, loading} = this.state;
        return (
            <div>
                {loading && <LinearProgress color='secondary'/>}
                <Grid container>
                    <Grid item md={3} sm={1} xs={false}/>
                    <Grid item md={6} sm={10} xs={12}>
                        <Paper className={styles.paper}>
                            <form onSubmit={this.register}>
                                <Grid container>
                                    <Grid item md={7} sm={7} xs={7} className={styles.main}>
                                        <Typography component='h1' variant='h4' className={styles.header}>Sign
                                            up</Typography>
                                        <div className={styles.big_alert}>{error !== '' && error}</div>
                                        <FormControl margin="normal" fullWidth className={styles.control}
                                                     error={_username.isInvalid}>
                                            <InputLabel htmlFor="username">Username</InputLabel>
                                            <Input id="username" name="username" onChange={this.onChange}
                                                   onBlur={this.onBlur}/>
                                        </FormControl>
                                        <div
                                            className={styles.alert}>{_username.isInvalid && _username.message}</div>
                                        <FormControl margin="normal" fullWidth className={styles.control}
                                                     error={_email.isInvalid}>
                                            <InputLabel htmlFor="email">Email</InputLabel>
                                            <Input type='email' id="email" name="email" onChange={this.onChange}
                                                   onBlur={this.onBlur}/>
                                        </FormControl>
                                        <div
                                            className={styles.alert}>{_email.isInvalid && _email.message}</div>
                                        <FormControl margin="normal" fullWidth className={styles.control}
                                                     error={_password.isInvalid}>
                                            <InputLabel htmlFor="password">Password</InputLabel>
                                            <Input type={showPass?'text':'password'} id="password" name="password"
                                                   onChange={this.onChange}
                                                   endAdornment={
                                                       <InputAdornment position="end">
                                                           <IconButton
                                                               aria-label="Toggle password visibility"
                                                               onClick={this.handleClickShowPassword}>
                                                               {showPass ? <Visibility /> : <VisibilityOff />}
                                                           </IconButton>
                                                       </InputAdornment>
                                                   }/>
                                        </FormControl>
                                        <div
                                            className={styles.alert}>{_password.isInvalid && _password.message}</div>
                                        <FormControl margin="normal" fullWidth className={styles.control}
                                                     error={_password_confirm.isInvalid}>
                                            <InputLabel htmlFor="password_confirm">Password confirm</InputLabel>
                                            <Input type='password' id="password_confirm" name="password_confirm"
                                                   onChange={this.onChange}/>
                                        </FormControl>
                                        <div
                                            className={styles.alert}>{_password_confirm.isInvalid && _password_confirm.message}</div>
                                        <Grid container spacing={16}>
                                            <Grid item md={6} sm={12}>
                                                <FormControl margin="normal" fullWidth className={styles.control}
                                                             error={_first_name.isInvalid}>
                                                    <InputLabel htmlFor="first_name">First name</InputLabel>
                                                    <Input id="first_name" name="first_name" onChange={this.onChange}/>
                                                </FormControl>
                                                <div
                                                    className={styles.alert}>{_first_name.isInvalid && _first_name.message}</div>
                                            </Grid>
                                            <Grid item md={6} sm={12}>
                                                <FormControl margin="normal" fullWidth className={styles.control}
                                                             error={_last_name.isInvalid}>
                                                    <InputLabel htmlFor="last_name">Last name</InputLabel>
                                                    <Input id="last_name" name="last_name" onChange={this.onChange}/>
                                                </FormControl>
                                                <div
                                                    className={styles.alert}>{_last_name.isInvalid && _last_name.message}</div>
                                            </Grid>
                                        </Grid>
                                        <FormControl margin="normal" fullWidth className={styles.control}
                                                     error={_birthday.isInvalid}>
                                            <TextField label="Date of birth" type="date"
                                                       InputLabelProps={{shrink: true}}
                                                       name='birthday' style={{marginTop: '15px'}}
                                                       onChange={this.onChange}/>
                                        </FormControl>
                                        <div
                                            className={styles.alert}>{_birthday.isInvalid && _birthday.message}</div>
                                        <Button type="submit" fullWidth variant="contained" color="primary"
                                                className={styles.button}>
                                            Create your account
                                        </Button>
                                    </Grid>
                                    <Grid className={styles.right} item md={5} sm={5} xs={5}>
                                        <div className={styles.avatarHolder}>
                                            <img src={avatarNew} alt="" className={styles.avatar}/>
                                        </div>
                                        <div style={{textAlign: 'center'}}>{this.state.showCropBtn &&
                                        <Button size='small' variant='contained' color='secondary' type='button'
                                                onClick={this.openCropDialog}>Crop</Button>}
                                        </div>
                                        <div className={styles.file}>
                                            <Typography variant='h6' align='center'>UPLOAD AVATAR</Typography>
                                            <input type='file' accept='image/*' name='avatar'
                                                   onChange={this.onImageChange}/>
                                        </div>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Grid>
                    <Grid item md={3} sm={1} xs={false}>
                        <Dialog open={this.state.showCropDialog} onClose={this.closeCropDialog}>
                            <DialogTitle>Crop your avatar image: </DialogTitle>
                            <ReactCrop src={avatarSrc} onComplete={this.completeCropDialog}
                                       onChange={this.onCropChange} crop={this.state.crop}/>
                            <Button onClick={this.doneCropDialog} fullWidth>Done</Button>
                        </Dialog>
                    </Grid>
                </Grid>
            </div>
        );
    }
    handleClickShowPassword = () => {
        this.setState(prevState => ({showPass: !prevState.showPass}));
    };
    onImageChange = (event) => {
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
            canvas.width = targetSize;
            canvas.height = targetSize;
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
                const blobUrl = URL.createObjectURL(blob);
                this.setState({avatarNew: blobUrl, avatarBlob: blob})
            }, 'image/jpeg')
        }
    }
}

export default connect(null, {actionLogin})(Register);