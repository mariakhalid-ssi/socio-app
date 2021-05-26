import React, { useState, useEffect } from 'react'
import http from '../services/httpService'
import { makeStyles } from '@material-ui/core/styles'
import config from '../config/config.json'
import { DataGrid } from '@material-ui/data-grid'
import { TextField, Button, Tooltip, Toolbar, Link } from '@material-ui/core'
import { toast } from 'react-toastify'
import Modal from '@material-ui/core/Modal'

const useStyles = makeStyles((theme) => ({
  button: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))
function rand() {
  return Math.round(Math.random() * 20) - 10
}

function getModalStyle() {
  const top = 30 + rand()
  const left = 40 + rand()

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}
const PostForm = () => {
  const [post, setPost] = useState({})
  const classes = useStyles()
  const [postObj, setState] = useState({
    userId: 1,
    id: 0,
    title: '',
    body: '',
  })
  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      width: 400,
      renderCell: (params) => {
        const onEdit = () => {
          postObj.body = params.row.body
          postObj.title = params.row.title
          postObj.id = params.row.id
          setState(postObj)
          handleOpen()
        }
        return <Link onClick={onEdit}>{params.row.title}</Link>
      },
      // valueGetter: (params) => <p>{params.row.title}</p>,
    },
    { field: 'body', headerName: 'Body', width: 700 },
    {
      field: '',
      headerName: 'Action',
      disableClickEventBubbling: true,
      width: 150,
      renderCell: (params) => {
        const onDelete = async () => {
          const originalPosts = post.hits

          const posts = post.hits.filter((p) => p.id !== params.row.id)
          setPost({ hits: posts })
          try {
            await http.delete(config.apiEndpoint + '/' + params.row.id)
            toast.success('This post has been successfully deleted')
          } catch (ex) {
            if (ex.response && ex.response.status === 404)
              setPost({ hits: originalPosts })
            toast.error('This post has already been deleted')
          }
        }

        const onEdit = () => {
          postObj.body = params.row.body
          postObj.title = params.row.title
          postObj.id = params.row.id
          setState(postObj)
          handleOpen()
        }
        return (
          <React.Fragment>
            <Button onClick={onEdit} color="primary">
              Edit
            </Button>
            <Button onClick={onDelete} color="secondary">
              Delete
            </Button>
          </React.Fragment>
        )
      },
    },
  ]

  const [modalStyle] = React.useState(getModalStyle)
  const genrateRows = () => {
    let rows = []
    {
      post.hits && post.hits.map((item) => rows.push(item))
    }
    return rows
  }

  const rows = genrateRows()
  const handleChange = (e) => {
    const { id, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const HandleSubmit = async (e) => {
    e.preventDefault()
    if (postObj.id <= 0) {
      let b = await http.post(config.apiEndpoint, postObj)
      let newData = [...post.hits, b.data]
      setPost({ hits: newData })
    } else {
      await http.put(config.apiEndpoint + '/' + postObj.id, postObj)
      const posts = [...post.hits]
      const index = posts.findIndex((element, index) => {
        if (element.id === postObj.id) {
          return true
        }
      })
      posts[index + 1] = { ...postObj }
      setPost({ hits: posts })
    }
    postObj.body = ''
    postObj.title = ''
    setState(postObj)
    handleClose()
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await http.get(config.apiEndpoint)
      setPost({ hits: data })
    }
    fetchData()
  }, [setPost])

  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <form onSubmit={HandleSubmit}>
        <h2 id="server-modal-title">
          {postObj.id === 0 ? 'Create Post Details' : 'Edit Post Details'}
        </h2>
        <TextField
          label="title"
          id="title"
          autoComplete="off"
          value={postObj.title}
          style={{ margin: 8 }}
          margin="normal"
          fullWidth
          variant="outlined"
          onChange={handleChange}
        />
        <TextField
          label="body"
          id="body"
          fullWidth
          style={{ margin: 8 }}
          variant="outlined"
          autoComplete="off"
          value={postObj.body}
          margin="normal"
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="primary">
          {postObj.id === 0 ? 'Create' : 'Update'}
        </Button>
      </form>
    </div>
  )

  return (
    <React.Fragment>
      <Toolbar>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleOpen}
        >
          Create New Post
        </Button>
      </Toolbar>
      <div style={{ height: 600, width: '100%', padding: '2%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={10} />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {body}
        </Modal>
      </div>
    </React.Fragment>
  )
}

export default PostForm
