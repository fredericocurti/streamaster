import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Avatar from 'material-ui/Avatar'
import TextField from 'material-ui/TextField'
import Card from 'material-ui/Card'
import auth from '../helpers/auth.js'

class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            auth : false,
            open : false,
            error : '',
            dialogState : 'login',
            imageFile : null,
            imageBlob : 'https://www.colorado.edu/ocg/sites/default/files/styles/small/public/people/person-placeholder_34.jpg?itok=XHQXiJa4',
            textFields : {
              email : '',
              password : '',
              userName : '',
            }
          }
    }

  handleOpen = () => {
    this.setState({open: true})
  }

  handleClose = () => {
    this.setState({open: false})
  }

  handleTextChange = (event) => {
    let text = this.state.textFields
    this.setState({ ...this.state, textFields: 
      { ...this.state.textFields,[event.target.id] : event.target.value }}
    )
  }

  handleLogin = async () => {
    if (this.state.textFields.email != '' && this.state.textFields.password != '') {
      let result = await auth.login(this.state.textFields.email,this.state.textFields.password)

      if (result.status == 401) {
        this.setState({ error : "Senha incorreta. Verifique sua senha e tente novamente"})
      } else if (result.status == 404) {
        this.setState({ error : "Usuário não encontrado. Verifique se essa conta está registrada"})
      } else {
        this.props.onLogin(result)
      }

    }
  }

  handleRegister = async () => {
    let res = await auth.register(this.state.textFields.email,this.state.textFields.userName,this.state.textFields.password,this.state.imageBlob)
    if (res) this.props.onLogin(res)
  }

  switchDialogContent = () => {
    if (this.state.dialogState === 'login'){
      this.setState({ dialogState : 'register' })
    } else {
      this.setState({ dialogState : 'login' })
    }
  }

  onFileChange = async (ev) => {
    const file = Array.from(ev.target.files).pop()
    const formData = new FormData()    
    formData.append("source", file)
    formData.append("type", "file")
    formData.append("action", "upload")

    const res = await fetch("https://imgbb.com/json", {
        method: "POST",
        body: formData
    })

    const json = await res.json()
    this.setState({ imageBlob: json.image.display_url })    
  }

    render() {
    const dialogContent = () => {
      if (this.state.dialogState === 'login'){
        return (
          <span> 
            <TextField
                className='col s12 centered'
                id='email'
                floatingLabelText="Email"
                value={this.state.textFields.email}
                onChange={this.handleTextChange}
                type='email'
              />
              <TextField
                className='col s12 centered'
                id='password'
                floatingLabelText="Senha"
                value={this.state.textFields.password}
                onChange={this.handleTextChange}
                type="password"
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter') {
                    ev.preventDefault();
                    this.handleLogin();
                  }
                }}
              />
              <div className='centered col s12' style={{color : 'red'}}>
                {this.state.error}
              </div>
              <div className='centered col s12' style={{marginTop:10}}>
                <FlatButton
                  label="Login" 
                  onClick={this.handleLogin}
                  style={{margin:5,display:'block',margin:'0 auto'}}
                />
              </div>
              <div className='centered col s12'>
                <FlatButton
                  label="Criar conta" 
                  onClick={this.switchDialogContent}
                  style={{margin:5,display:'block',margin:'0 auto'}}
                />
              </div>

          </span>
        )} else {
          return (
            <span> 
              <TextField
                className='col s12 centered'
                floatingLabelText="Email"
                value={this.state.textFields.email}
                onChange={this.handleTextChange}
                type='email'
                id='email'
              />
              <TextField
                className='col s12 centered'
                floatingLabelText="Username"
                value={this.state.textFields.userName}
                onChange={this.handleTextChange}
                type='text'
                errorText={ this.state.textFields.userName.length > 16 ? "O tamanho máximo é 16 caracteres" : null }
                id='userName'
              />
              <TextField
                className='col s12 centered'
                id='password'
                floatingLabelText="Senha"
                value={this.state.textFields.password}
                onChange={this.handleTextChange}
                type="password"
                errorText={ this.state.textFields.password.length > 16 ? "O tamanho máximo é 16 caracteres" : null }
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter') {
                    ev.preventDefault();
                    this.handleRegister();
                  }
                }}
              />
              <div style={{display:'flex', justifyContent:'center'}}>
                <Avatar
                  className='login-avatar'
                  src={this.state.imageBlob}
                  onClick={() => { this.fileInput.click() }}
                />
                <input name="myFile" style={{ display: 'none' }} type="file" ref={(input) => { this.fileInput = input }} onChange={this.onFileChange} />
              </div>
              <div className='centered col s12' style={{color : 'red'}}>
                {this.state.error}
              </div>
              <div className='centered col s12' style={{marginTop:10}}>
                <FlatButton
                  label="Registrar"
                  onClick={this.handleRegister}
                  style={{margin:5,display:'block',margin:'0 auto'}}
                />
                <FlatButton
                  label="Voltar"
                  onClick={this.switchDialogContent}
                  style={{margin:5,display:'block',margin:'0 auto'}}
                />
              </div>
          </span>
          )
        }
    }

        return (
            // <div className="App">
            // <div className="App-header">
    
            //   <h4> Streamaster</h4>
            //   <p> Find and stream any song, anywhere </p>
    
            // </div>
              <Card style={{padding: 20}}>
                {dialogContent()}
              </Card>
            // </div>
        )
    }
}

export default Login;