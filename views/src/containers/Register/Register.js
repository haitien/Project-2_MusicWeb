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
import avatarImg from '../../images/avatar.jpg';



class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //avatar
            avatarSrc: avatarImg,
            avatarNew: avatarImg,
            avatarBlob: null,
            loading: false,
            showPass: false,
            // crop
            showCropBtn: false,
            showCropDialog: false,
            crop: {x: 10, y: 10, width: 30, height: 30, aspect: 1},
            // data
            username: '',
            email: '',
            password: '',
            password_confirm: '',
            first_name: '',
            last_name: '',
            birthday: '',
            //error
            message: {},
            error: '',
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
        });
    }


    onChange = (event) => {
        const {value, name} = event.target;
        const message = this.validator.validate(name, value);
        this.setState(state => {
            state[name] = value;

            state.message[name] = message;
            return state;
        });
    };

    onBlur = (event) => {
        console.log('on blur');
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
        const {username} = this.state;
        const result = this.validator.validate('username', username);
        if (result) return;
        axios.post(API.GUEST + API.VALIDATE, {username: username}).then(res => {
            console.log('Register check exist username', res.data);
            const message = res.data.result ? 'Name is already in use !' : '';
            this.setState(state=>{
                state.message.username = message;
                return state;
            });
        }).catch(() => {

        });
    };

    validateEmail = () => {
        const {email} = this.state;
        const message = this.validator.validate('email', email);
        if (message) return;
        axios.post(API.GUEST + API.VALIDATE, {email: email}).then(res => {
            console.log('Register check exist email', res.data);
            const message = res.data.result ? 'Email is already in use !' : '';
            this.setState(prevState=>{
                prevState.message.email = message;
                return prevState;
            });
        }).catch(() => {

        });
    };


    register = () => {
        console.log('on submit');
        this.setState({loading: true, error: ''});
        // event.preventDefault();
        const {username, email, password, password_confirm, first_name, last_name, birthday, avatarBlob} = this.state;
        const result = this.validator.validateAll({username, email, password, password_confirm, first_name, last_name, birthday });
        if (result) {
            this.setState(state=>{
                state.message[result.key] = result.message;
                return state;
            });
            this.setState({loading: false, error: ''});
            return;
        }
        console.log('Validate result ', result, this.state.message);
        const form = new FormData();
        form.append('username', username);
        form.append('email', email);
        form.append('password', password);
        form.append('first_name', first_name);
        form.append('last_name', last_name);
        form.append('birthday', birthday);
        form.append('avatar', avatarBlob);
        axios.post(API.GUEST + API.REGISTER, form).then(response => {
            const user = response.data;
            this.props.actionLogin(user);
            // TODO restore old path
            this.props.history.push('/')
        }).catch(() => {
            this.setState({loading: false, error: 'Error! Please try again '})
        });
    };

    render() {
        const {error, avatarSrc, avatarNew, showPass, loading} = this.state;
        const {username, email, password, password_confirm, first_name, last_name, birthday} = this.state.message;
        return (
            <div>
                {loading && <LinearProgress color='secondary'/>}
                <Grid container>
                    <Grid item md={3} sm={1} xs={false}/>
                    <Grid item md={6} sm={10} xs={12}>
                        <Paper className={styles.wrapper}>
                            <form>
                                <Grid container>
                                    <Grid item md={7} sm={7} xs={7} className={styles.main}>
                                        <Typography component='h1' variant='h4' className={styles.header}>Sign
                                            up</Typography>
                                        <div className={styles.big_alert}>{error}</div>
                                        <FormControl margin="normal" fullWidth className={styles.control}
                                                     error={!!username}>
                                            <InputLabel htmlFor="username">Username</InputLabel>
                                            <Input name="username" onChange={this.onChange}
                                                   onBlur={this.onBlur}/>
                                        </FormControl>
                                        <div className={styles.alert}>{username}</div>
                                        <FormControl margin="normal" fullWidth className={styles.control}
                                                     error={!!email}>
                                            <InputLabel htmlFor="email">Email</InputLabel>
                                            <Input type='email' name="email" onChange={this.onChange}
                                                   onBlur={this.onBlur}/>
                                        </FormControl>
                                        <div className={styles.alert}>{email}</div>
                                        <FormControl margin="normal" fullWidth className={styles.control}
                                                     error={!!password}>
                                            <InputLabel htmlFor="password">Password</InputLabel>
                                            <Input type={showPass ? 'text' : 'password'} id="password" name="password"
                                                   onChange={this.onChange}
                                                   endAdornment={
                                                       <InputAdornment position="end">
                                                           <IconButton
                                                               aria-label="Toggle password visibility"
                                                               onClick={this.handleClickShowPassword}>
                                                               {showPass ? <Visibility/> : <VisibilityOff/>}
                                                           </IconButton>
                                                       </InputAdornment>
                                                   }/>
                                        </FormControl>
                                        <div className={styles.alert}>{password}</div>
                                        <FormControl margin="normal" fullWidth className={styles.control}
                                                     error={!!password_confirm}>
                                            <InputLabel htmlFor="password_confirm">Password confirm</InputLabel>
                                            <Input type='password' id="password_confirm" name="password_confirm"
                                                   onChange={this.onChange}/>
                                        </FormControl>
                                        <div
                                            className={styles.alert}>{password_confirm}</div>
                                        <Grid container spacing={16}>
                                            <Grid item md={6} sm={12}>
                                                <FormControl margin="normal" fullWidth className={styles.control}
                                                             error={!!first_name}>
                                                    <InputLabel htmlFor="first_name">First name</InputLabel>
                                                    <Input id="first_name" name="first_name" onChange={this.onChange}/>
                                                </FormControl>
                                                <div
                                                    className={styles.alert}>{first_name}</div>
                                            </Grid>
                                            <Grid item md={6} sm={12}>
                                                <FormControl margin="normal" fullWidth className={styles.control}
                                                             error={!!last_name}>
                                                    <InputLabel htmlFor="last_name">Last name</InputLabel>
                                                    <Input id="last_name" name="last_name" onChange={this.onChange}/>
                                                </FormControl>
                                                <div
                                                    className={styles.alert}>{last_name}</div>
                                            </Grid>
                                        </Grid>
                                        <FormControl margin="normal" fullWidth className={styles.control}
                                                     error={!!birthday}>
                                            <TextField label="Date of birth" type="date"
                                                       InputLabelProps={{shrink: true}}
                                                       name='birthday' style={{marginTop: '15px'}}
                                                       onChange={this.onChange} error={!!birthday}/>
                                        </FormControl>
                                        <div
                                            className={styles.alert}>{birthday}</div>
                                        <Button fullWidth variant="contained" color="primary"
                                                className={styles.button} onClick={this.register}>
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