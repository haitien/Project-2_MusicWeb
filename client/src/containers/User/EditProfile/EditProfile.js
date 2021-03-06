import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import styles from './EditProfile.module.css'
import {Dialog} from "@material-ui/core";
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
import {Link, withRouter} from "react-router-dom";
import validator from 'validator';
import CustomValidate from '../../../js/custom_validator';
import API from './../../../js/api_constants';
import AppConstants from '../../../js/app_constant';
import axios from 'axios';
import Utils from "../../../js/utils";
import Crop from '@material-ui/icons/Crop';
import {actionLogin} from "../../../js/store";
import {connect} from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import LinearProgress from "@material-ui/core/LinearProgress";
import avatarImg from '../../../images/avatar.jpg';

class EditProfile extends Component {
    constructor(props) {
        super(props);
        const temp = {isInvalid: false, message: ''};
        this.state = {
            avatarSrc: avatarImg,
            avatarNew: avatarImg,
            avatarBlob: null,
            editPass: false,
            showPass: false,
            loading: false,
            data: {first_name: 'first_name', last_name: 'last_name', id: 'id'},
            // crop
            showCropBtn: false,
            showCropDialog: false,
            crop: {x: 20, y: 10, width: 30, height: 10, aspect: 1},
            // data
            email: '',
            old_password: '',
            new_password: '',
            first_name: '',
            last_name: '',
            birthday: '',
            //error
            error: '',
            _email: temp,
            _old_password: temp,
            _new_password: temp,
            _first_name: temp,
            _last_name: temp,
            _birthday: temp,
        };


        this.validator = new CustomValidate({
            email: {
                methods: [validator.isEmail],
                messages: ['That is not a valid email']
            },
            old_password: {
                methods: [validator.matches],
                args: [AppConstants.REGEX_PASSWORD],
                messages: ['Password must be 8 characters or longer']
            },
            new_password: {
                methods: [validator.matches, (new_pass) => (this.state.old_password !== new_pass)],
                args: [AppConstants.REGEX_PASSWORD, null],
                messages: ['Password must be 8 characters or longer', 'New password is same the old']
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
        axios.get(API.USER + API.EDIT_PROFILE).then(response => {
            console.log('EditProfile => get profile', response.data);
            response.data.date_of_birth = Utils.formatDate(response.data.date_of_birth);
            this.setState({
                avatarNew: response.data.avatar,
                avatarSrc: response.data.avatar,
                data: response.data,
                email: response.data.email,
                first_name: response.data.first_name,
                last_name: response.data.last_name,
                birthday: response.data.date_of_birth,
            })
        }).catch(() => {
            this.props.history.push('/401')
        });
    };

    onChange = (event) => {
        const {value, name} = event.target;
        this.setState({[name]: value});
        const result = this.validator.validate({[name]: value});
        this.setState({['_' + name]: result});
        return result.isInvalid;
    };

    onBlur = (event) => {
        this.setState({error: ''});
        const {name} = event.target;
        switch (name) {
            case 'email':
                this.validateEmail();
                break;
            case 'old_password':
                this.validatePassword();
                break;
            default:
        }
    };

    validateEmail() {
        const {email, data} = this.state;
        if (email === data.email) {
            this.setState({_email: {isInvalid: false, message: ''}});
            return
        }
        const {isInvalid} = this.validator.validate({email: email});
        if (isInvalid) return;
        axios.post(API.GUEST + API.VALIDATE, {email: email}).then(response => {
            console.log('EditProfile => check exist email', response.data);
            if (response.data.email) {
                this.setState({_email: {isInvalid: true, message: 'Email is already in use !'}})
            } else {
                this.setState({_email: {isInvalid: false, message: ''}})
            }
        }).catch(err => {
        });
    }

    validatePassword() {
        const {old_password, data} = this.state;
        if (old_password === data.password) {
            this.setState({_old_password: {isInvalid: false, message: ''}});
            return
        }
        const {isInvalid} = this.validator.validate({old_password: old_password});
        if (isInvalid) return;
        axios.post(API.USER + API.CHECK_PASSWORD, {password: old_password}).then(response => {
            console.log('EditProfile => check right password', response.data);
            if (response.data.result) {
                this.setState({_old_password: {isInvalid: false, message: ''}})
            } else {
                this.setState({_old_password: {isInvalid: true, message: 'Not match your current password!'}})
            }
        }).catch(() => {
            this.props.history.push('/401');
        });
    }

    editProfile = (event) => {
        this.setState({loading: true, error: ''});
        event.preventDefault();
        const {email, old_password, new_password, first_name, last_name, birthday, editPass, data, avatarBlob} = this.state;
        let temp = null;
        if (editPass) {
            temp = {email, old_password, new_password, first_name, last_name, birthday};
        } else {
            temp = {email, first_name, last_name, birthday};
        }
        const result = this.validator.validateAll(temp);
        console.log('Validate result', temp);
        const form = new FormData();
        Object.keys(result).filter(key => (key !== 'isValid')).forEach(item => {
            this.setState({['_' + item]: result[item]});
            form.append(item, this.state[item]);
        });
        if (!result.isValid) {
            this.setState({loading: false, error: ''});
            return;
        }
        if (!editPass && email === data.email && first_name === data.first_name && last_name === data.last_name && birthday === data.date_of_birth && !avatarBlob) {
            this.setState({loading: false, error: 'Nothing has changed!'});
            return;
        }
        form.append('avatar', this.state.avatarBlob);
        axios.post(API.USER + API.EDIT_PROFILE, form).then(response => {
            this.setState({error: '', loading: false});
            this.props.actionLogin(response.data);
            this.props.history.push('/')
        }).catch(error => {
            if (error.response.status === 401) {
                this.props.history.push('/401');
            } else {
                this.setState({error: 'Error ! Please try again '})
            }
        });
    };

    render() {
        const {email, first_name, last_name, birthday, error, data, avatarNew, avatarSrc, editPass, showPass, loading} = this.state;
        const {_email, _first_name, _last_name, _old_password, _new_password, _birthday} = this.state;
        return (
            <div className={styles.big_wrapper}>
                <div className={styles.navbar}>
                    <Link to='/' className={styles.brand}>
                        <Typography variant="h5" style={{color: 'white'}}>
                            Home page
                        </Typography>
                    </Link>
                </div>
                <div className={styles.wrapper}>
                    {loading && <LinearProgress color='secondary'/>}
                    <Grid container>
                        <Grid item md={3} sm={1} xs={false}/>
                        <Grid item md={6} sm={10} xs={12}>
                            <Typography variant='h5'>Edit your profile</Typography>
                            <Grid container>
                                <Grid item sm={1} xs={false}/>
                                <Grid item sm={10} xs={12}>
                                    <form onSubmit={this.editProfile}>
                                        <Grid container spacing={8} style={{alignItems: 'center'}}>
                                            <Grid item sm={5} xs={12} style={{overFlow: 'hidden'}}>
                                                <div className={styles.avatarHolder}>
                                                    <img src={avatarNew} alt="Avatar" className={styles.avatar}/>
                                                    {this.state.showCropBtn &&
                                                    <Crop className={styles.crop} onClick={this.openCropDialog}/>}
                                                    <label className={styles.custom_file_upload}>
                                                        <CameraAlt/>
                                                        <input type="file" accept='image/*' name='avatar'
                                                               onChange={this.imageChange}
                                                               className={styles.input_avatar}/>
                                                    </label>
                                                </div>
                                            </Grid>
                                            <Grid item sm={7} xs={12} style={{overFlow: 'hidden'}}>
                                                <h1 style={{marginTop: '0'}}>{data.first_name + ' ' + data.last_name}</h1>
                                                <h3 style={{marginTop: '0'}}>UserID: <span
                                                    style={{color: '#1E3C51'}}>{data.id}</span>
                                                </h3>
                                                <h3 style={{marginTop: '0'}}>Username: <span
                                                    style={{color: '#1E3C51'}}>{data.username}</span>
                                                </h3>
                                            </Grid>
                                        </Grid>
                                        {error !== '' && <div className={styles.big_alert}>{error}</div>}
                                        <FormControl margin="normal" fullWidth className={styles.control}>
                                            <InputLabel htmlFor="email">Email</InputLabel>
                                            <Input type='email' name="email" onChange={this.onChange}
                                                   onBlur={this.onBlur}
                                                   value={email}/>
                                        </FormControl>
                                        <div className={styles.alert}>{_email.isInvalid && _email.message}</div>
                                        <FormControlLabel style={{width: '100%'}}
                                                          control={
                                                              <Checkbox
                                                                  checked={editPass}
                                                                  onChange={this.setCheck} name="editPassword"/>
                                                          }
                                                          label="Change password"/>
                                        <FormControl margin="normal" fullWidth className={styles.control}>
                                            <InputLabel htmlFor="old_password">Old password</InputLabel>
                                            <Input type={showPass ? 'text' : 'password'} name="old_password"
                                                   onChange={this.onChange} onBlur={this.onBlur}
                                                   disabled={!editPass}
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
                                        <div
                                            className={styles.alert}>{editPass && _old_password.isInvalid && _old_password.message}</div>
                                        <FormControl margin="normal" fullWidth className={styles.control}>
                                            <InputLabel htmlFor="new_password">New password</InputLabel>
                                            <Input type='password' name="new_password"
                                                   onChange={this.onChange} disabled={!editPass} onBlur={this.onChange}/>
                                        </FormControl>
                                        <div
                                            className={styles.alert}>{editPass && _new_password.isInvalid && _new_password.message}</div>
                                        <Grid container spacing={16}>
                                            <Grid item sm={6}>
                                                <FormControl margin="normal" fullWidth className={styles.control}>
                                                    <InputLabel htmlFor="first_name">First name</InputLabel>
                                                    <Input name="first_name" onChange={this.onChange} onBlur={this.onChange}
                                                           value={first_name}/>
                                                </FormControl>
                                                <div
                                                    className={styles.alert}>{_first_name.isInvalid && _first_name.message}</div>
                                            </Grid>
                                            <Grid item sm={6}>
                                                <FormControl margin="normal" fullWidth className={styles.control}>
                                                    <InputLabel htmlFor="last_name">Last name</InputLabel>
                                                    <Input name="last_name" onChange={this.onChange} value={last_name} onBlur={this.onChange}/>
                                                </FormControl>
                                                <div
                                                    className={styles.alert}>{_last_name.isInvalid && _last_name.message}</div>
                                            </Grid>
                                        </Grid>
                                        <FormControl margin="normal" fullWidth className={styles.control}>
                                            <TextField label="Birthday" type="date" InputLabelProps={{shrink: true}}
                                                       name='birthday'
                                                       style={{marginTop: '15px'}} onChange={this.onChange} onBlur={this.onChange}
                                                       value={birthday}/>
                                        </FormControl>
                                        <div className={styles.alert}>{_birthday.isInvalid && _birthday.message}</div>
                                        <Button type="submit" fullWidth variant="contained" color="secondary"
                                                className={styles.button}>
                                            Edit your profile
                                        </Button>
                                    </form>
                                </Grid>
                                <Grid item sm={1} xs={false}/>
                            </Grid>
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
            </div>
        )
    }

    handleClickShowPassword = () => {
        if (!this.state.editPass) {
            this.setState({showPass: false});
            return
        }
        this.setState(prevState => ({showPass: !prevState.showPass}))
    };
    setCheck = () => {
        this.setState(preState => ({
            editPass: !preState.editPass
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

export default withRouter(connect(null, {actionLogin})(withRouter(EditProfile)));