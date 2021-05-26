import React, { useState } from 'react'
import { TextField, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Joi, { fromByteArray } from 'joi-browser'
import { toast } from 'react-toastify'
import { withRouter } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '300px',
    },
    '& .MuiButtonBase-root': {
      margin: theme.spacing(2),
    },
  },
}))

const LoginForm = (props) => {
  const classes = useStyles()
  const loginUserName = 'maria'
  const loginpassword = '123456'
  const [state, setState] = useState({
    userName: '',
    password: '',
  })

  const [error, setErrorState] = useState({
    errors: {},
  })
  const validate = () => {
    const options = { abortEarly: false }
    const { error } = Joi.validate(state, schema, options)
    if (!error) return null
    const errors = {}
    for (let item of error.details) errors[item.path[0]] = item.message
    return errors
  }

  const HandleSubmit = (e) => {
    e.preventDefault()
    const errors = validate()

    setErrorState({ errors: errors })
    if (errors) {
      let showError = ''
      if (errors.userName) {
        showError = errors.userName + ' \n '
      }
      if (errors.password) {
        showError += errors.password
      }
      return toast.error(showError)
    }
    if (state.userName !== loginUserName || state.password !== loginpassword) {
      return toast.error('Incorrect UserName or Password')
    }
    var passwordHash = require('password-hash')

    var token = passwordHash.generate(state.userName + ' ' + state.password)
    localStorage.setItem('token', token)
    props.history.go('/post')
  }

  const schema = {
    userName: Joi.string().required().label('UserName'),
    password: Joi.string().min(4).required().label('Password'),
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }
  return (
    <div>
      <form className={classes.root} onSubmit={HandleSubmit}>
        <TextField
          label="User Name"
          error={error.errors && error.errors.userName}
          id="userName"
          autoComplete="off"
          value={state.userName}
          onChange={handleChange}
        />
        <TextField
          label="Password"
          error={error.errors && error.errors.password}
          id="password"
          type="password"
          autoComplete="off"
          value={state.password}
          onChange={handleChange}
        />

        <div>
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </div>
      </form>
    </div>
  )
}

export default withRouter(LoginForm)
