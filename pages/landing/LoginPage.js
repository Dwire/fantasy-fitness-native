import React, { Component } from 'react'
import { connect } from 'react-redux'

import { AppStyle } from '../../styles/AppStyle'
import { HomeStyle } from '../../styles/HomeStyle'
import Ionicons from 'react-native-vector-icons/Ionicons'
import RootAdapter from '../../adapters/RootAdapter'
import InputWithLabel from '../../components/form/InputWithLabel'

import { setUser } from '../../actions/userActions'
import { setTeam } from '../../actions/teamActions'
import { signIn } from '../../actions/sessionActions'

class LoginPage extends Component {
  // 

  state = {
    user: {
      username: '',
      password: '',
    },
    errors: null
  }

  _storeData = async (token) => {
    console.log("token", token)
    try {
      await AsyncStorage.setItem('token', token)
    } catch (error) {

    }
  }

  handleText = (text, name) => {
    this.setState(prevState => {
      return {
        user: {
          ...prevState.user,
          [name]: text
        }
      }
    })
  }

  handlePress = () => {
    const { SessionAdapter } = RootAdapter
    // if login ==> take state and submit a login session
    // if sign up ==> take state and submit a users create request
     // on sucessful login ==> save encoded jwt into AsyncStorage
    SessionAdapter.login(this.state.user)
      .then(data => {
        if (data.message) throw Error(data.message)
        // find a way to global save with the session Reducer
        this._storeData(data.jwt)
        this.props.setUser(data.user)
        this.props.setTeam(data.user)
        this.props.signIn()
      })
      .catch(this.renderErrors)
  }

  renderErrors = (errors) => {
    this.setState({errors: errors.message})
  }

  renderLogin = () => {
    const { signUp, username, password, user, errors } = this.state

    return (
      <View >
        <Text style={ AppStyle.header }>LOGIN</Text>
        {errors && <Text style={AppStyle.label}>{errors}</Text>}
        <InputWithLabel
          label="Username"
          name="username"
          icon='ios-person'
          handleText={this.handleText}
          value={username}
          type="username"
          placeholder='Enter your username...' />
        <InputWithLabel
          label="Password"
          name="password"
          type="password"
          icon='ios-lock'
          handleText={this.handleText}
          value={password}
          placeholder='Enter your password...' />

        <TouchableHighlight
          style={AppStyle.button}
          onPress={this.handlePress}
        >
        <Text> Log in </Text>
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    return (
      <View style={ HomeStyle.firstLayer }>
        { this.renderLogin()}
      </View>
    )
  }
}


export default connect(null, { signIn, setUser, setTeam })(LoginPage)