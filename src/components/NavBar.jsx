import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[700],
  },
}))

const NavBar = ({ token }) => {
  const logout = () => {
    localStorage.removeItem('token')
    window.location.href = '/'
  }

  const classes = useStyles()
  return (
    <div>
      {token && (
        <AppBar
          position="static"
          color="default"
          elevation={0}
          className={classes.appBar}
        >
          <Toolbar>
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              className={classes.toolbarTitle}
            >
              Socio App
            </Typography>

            <nav>
              <Link
                variant="button"
                color="textPrimary"
                className={classes.link}
                onClick={logout}
              >
                Logout
              </Link>
            </nav>
          </Toolbar>
        </AppBar>
      )}
    </div>
  )
}
export default NavBar
