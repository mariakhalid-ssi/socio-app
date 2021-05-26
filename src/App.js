import React,{Component} from 'react';

import './App.css';
import NavBar from './components/NavBar'
import { CssBaseline } from '@material-ui/core';
import LoginForm from "./components/LoginForm";
import { BrowserRouter,Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PostForm from './components/PostForm';

class App extends Component {
  state={};
  componentDidMount() {
    const token= localStorage.getItem('token');
    if(token){
      this.setState({token})
    }
  }
  render() {
    return (
      <React.Fragment>
        <CssBaseline/>
        <ToastContainer/>
        <NavBar token={localStorage.getItem('token')}/>
        <main className="container">
        <BrowserRouter>
        <Switch>
            {!localStorage.getItem("token") ? (
                <>
                  <Route path="/login" component={LoginForm} />
                  <Redirect to="/login" />
                </>
              ):
              (
                <>
                  <Route path="/post" component={PostForm} />
                  <Redirect to="/post" />
                </>
              )
              }
            </Switch>
   </BrowserRouter>
        </main>
      </React.Fragment>
    );
  }
}

export default App;


// function App() {
//   return (
//     <React.Fragment>
//       <CssBaseline />
//       <NavBar />
//       <main className="container">
//           <Switch>
//             <Route path="/login" component={LoginForm}></Route>
//           </Switch>
//         </main>
//         </React.Fragment>
//   );
// }

// export default App;
