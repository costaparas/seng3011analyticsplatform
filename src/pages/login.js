import React from 'react'
import { withRouter } from 'react-router'
import withRoot from '../withRoot'
import { withStyles } from 'material-ui'
import '../assets/login.css'
import { fb } from '../config'
import { base } from '../config'
import Dialog, { DialogContent, DialogTitle } from 'material-ui/Dialog'
import Button from '@material-ui/core/Button'
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'
import Typography from 'material-ui/Typography'
import _ from 'lodash'
import Select from '@material-ui/core/Select'

const styles = theme => ({})

class Login extends React.Component {

  constructor() {
    super()
    this.database = fb.database().ref()
    this.state = {
      name: null,
      pass: null,
      userId: null,
      isValid: true,

      /* modal flags */
      open: false,
      openReset: false,

      /* signup fields */
      username: '',
      email: '',
      password: '',
      confirmpass: '',
      industry: 'Aviation',
      invalid: '',
      users: [],
      categories: [],

      /* reset password form*/
      emailReset: '',
      invalidReset: ''
    }
  }

  componentDidMount() {
    /* fetch categories from firebase */
    base.fetch('categories_and_icons', {
      context: this,
    }).then((categories) => {
      var cat = Object.keys(categories).map(c => c.charAt(0).toUpperCase() + c.substr(1))
      this.setState({ categories: cat })
    })
  }

  handleClickListItem = () => {
    this.setState({ open: true })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  handleOpen = () => {
    this.setState({open: true})
  }

  handleOpenReset = () => {
    this.setState({openReset: true})
  }

  handleClose = () => {
    this.resetFields()
    this.setState({open: false})
    this.setState({openReset: false})
  }

  resetFields = () => {
    this.setState({
      username: '',
      email: '',
      password: '',
      confirmpass: '',
      industry: 'Aviation',
      invalid: '',
      emailReset: '',
      invalidReset: ''
    })
  }

  getUserId = (username, password) => {
    if (this.refs.pass.value.length < 1) {
      this.setState({isValid: false})
    } else {
      this.database.child('users').orderByChild('username').equalTo(this.refs.name.value).on('value', snap => {
        if (snap.val() != null) {
          snap.forEach(data => {
            if (data.val().password === this.refs.pass.value) {
              this.props.history.push({
                pathname: `/timeline`,
                state: {
                  currentUser: data.val()
                }
              })
            } else {
              this.setState({isValid: false})
            }
          })
        } else {
          this.setState({isValid: false})
        }
      })
    }
  }

  resetPass = () => {
    let { emailReset } = this.state
    if (!emailReset.match(/^[^@]+@[^@.][^@]*(\.[^@.]{2,})+$/)) {
      this.setState({invalidReset: 'Email is invalid.'})
    } else {
      /* would normally actually reset the password here ... */
      this.handleClose()
    }
  }

  signup = () => {
    let {
      username,
      email,
      password,
      confirmpass,
      industry
    } = this.state

    base.fetch('users', {
      context: this,
    }).then((users) => {
      this.ref = base.syncState(`timeline`, {
        context: this,
        state: 'users',
      })

      /* check for existing user name or email */
      var err = ''
      Object.entries(users).forEach(
        ([key, value]) => {
            if (value.username === username && err === '') {
              err = 'Username is taken.'
            } else if (value.email === email && err === '') {
              err = 'An account with this email already exists.'
            }
          }
      )

      /* manually validate all sign-up fields */
      if (username.match(/^\s*$/) || email.match(/^\s*$/) || password === '' || confirmpass === '') {
        this.setState({invalid: 'Please complete all fields.'})
      } else if (username.length < 3) {
        this.setState({invalid: 'Username is too short. At least 3 characters required.'})
      } else if (err.match(/username/i)) {
        this.setState({invalid: err})
      } else if (!email.match(/^[^@]+@[^@.][^@]*(\.[^@.]{2,})+$/)) {
        this.setState({invalid: 'Email is invalid.'})
      } else if (err.match(/email/i)) {
        this.setState({invalid: err})
      } else if (password.length < 6) {
        this.setState({invalid: 'Password is too short. At least 6 characters required.'})
      } else if (password !== confirmpass) {
        this.setState({invalid: 'Passwords do not match.'})
      } else {
        fb.database().ref('users/' + Math.random().toString(36).substr(2, 5)).set({
          username,
          email,
          password,
          admin: false,
          fav: industry.toLowerCase()
        })
        this.handleClose()
      }

    })
  }

  render() {
    return (
      <div className='form'>
        <div className='form_logo'>
          Event<span>S</span>tock
        </div>

        <div className='form_title'>
          Discover the impact of events on industries you're interested in
        </div>

        <div className='form_items'>
          <form autoComplete="off">
            <div className='form_inputs'>
              <label style={{marginBottom: '20px', fontSize: '20px'}}>Username</label>
              <input style={{fontSize: '16px'}} ref='name' type='text' required/>
            </div>
            <div className='form_inputs'>
              <label style={{marginBottom: '20px', fontSize: '20px'}}>Password</label>
              <input style={{fontSize: '16px'}} ref='pass' type='password' required/>
            </div>
          </form>
          <Button variant="raised" color="secondary" className='form_button' style={{margin: 10}} onClick={(e) => this.getUserId(e, this.refs.name.value, this.refs.pass.value)}>
            Log In
          </Button>
          <Button variant="raised" color="secondary" className='form_button' style={{margin: 10}}
            onClick={() => this.handleOpenReset()}
             >forgot password?</Button>
          <Button variant="raised" color="secondary" className='form_button' style={{margin: 10}}
          onClick={() => this.handleOpen()}
          >Join Now</Button>
        </div>
        {this.state.isValid ? null : <p style={{textAlign: 'center', color: 'red'}}> Invalid Credentials </p>}
        <Dialog
          open={this.state.open}
          onClose={() => this.handleClose()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={false}
        >
          <DialogTitle id="alert-dialog-title" style={{textAlign: 'center', background: '#AB47B8'}}>Create an Account</DialogTitle>
          <DialogContent>
              <TextField
                required
                autoFocus
                margin="dense"
                id="name"
                label="Username"
                type="username"
                fullWidth
                onChange={this.handleChange('username')}
              />
              <TextField
                required
                autoFocus
                margin="dense"
                id="email"
                label="Email Address"
                type="email"
                fullWidth
                onChange={this.handleChange('email')}
              />
              <TextField
                required
                autoFocus
                margin="dense"
                id="password"
                label="Password"
                type="password"
                onChange={this.handleChange('password')}
                fullWidth
              />
              <TextField
                required
                autoFocus
                margin="dense"
                id="confirm-password"
                label="Confirm Password"
                type="password"
                onChange={this.handleChange('confirmpass')}
                fullWidth
              />
            <DialogContentText style={{color: 'black', fontStyle: 'bold', marginTop: '20px'}}>
                Favourite Industry
            </DialogContentText>
            <Select
              native
              fullWidth
              value={this.state.industry}
              onChange={this.handleChange('industry')}
              inputProps={{
                id: 'industry',
              }}
            >
              {_.map(this.state.categories, (k) =>
                k === 'Uncategorised' || k === 'Other' ? null :
                  <option value={k} key={k}>{_.startCase(_.toLower(k))}</option>
              )}
            </Select>
            {this.state.invalid !== '' ?
              <Typography gutterBottom variant="subheading">
                <i>{this.state.invalid}</i>
              </Typography>
            : null}

            <Button className='form_button' onClick={this.signup} color="primary" autoFocus>
              Sign Up
            </Button>

          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.openReset}
          onClose={() => this.handleClose()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={false}
        >
          <DialogTitle id="alert-dialog-title" style={{textAlign: 'center', background: '#AB47B8'}}>Reset Password</DialogTitle>
          <DialogContent>
              <br></br>
              <Typography gutterBottom variant="subheading">
                Enter the email associated with your account to reset your password.
              </Typography>
              <TextField
                required
                autoFocus
                margin="dense"
                id="email"
                label="Email Address"
                type="email"
                fullWidth
                onChange={this.handleChange('emailReset')}
              />
            {this.state.invalidReset !== '' ?
              <Typography gutterBottom variant="subheading">
                <i>{this.state.invalidReset}</i>
              </Typography>
            : null}
            <Button className='form_button' onClick={this.resetPass} color="primary" autoFocus>
              Reset Password
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

}

export default withRouter(withRoot(withStyles(styles)(Login)))
