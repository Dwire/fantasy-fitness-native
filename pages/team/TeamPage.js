import React, { Component } from 'react'
import { View, Text, Button, Image, ScrollView, TouchableHighlight, Animated, Easing } from 'react-native'
import { AppStyle } from '../../styles/AppStyle';
import { HomeStyle } from '../../styles/HomeStyle'
import { connect } from 'react-redux'

//prabably need to changeDisplay
import UserCard from '../../components/UserCard'
import TeamCard from '../../components/TeamCard'
import CurrentTeamCard from './CurrentTeamCard'
import TeammateCard from './TeammateCard'
import RootAdapter from '../../adapters/RootAdapter'

import SmallSquareCard from '../../components/cards/SmallSquareCard'
import HeaderWithAvatar from '../../components/headers/HeaderWithAvatar'
import Header from '../../components/headers/Header'



class TeamPage extends Component {

  state = {
    display: 'TEAM',
    nextDisplay: 'TEAM'
  }

  changeDisplay = newDisplay => {
    this.setState({ nextDisplay: newDisplay })
  }

  afterAnimation = () => {
    this.setState({ display: this.state.nextDisplay })
  }

  renderCurrentTeam = () => {
    const { team } = this.props
    const { name, motto, image_url } = team.currentTeam
    const { display } = this.state
    // const fullName = `${first_name} ${last_name}`

    if (display !== 'TEAM') {
      return (
          <TouchableHighlight
            onPress={()=>this.changeDisplay('TEAM')}
            underlayColor='transparent' >
            <HeaderWithAvatar avatar={image_url} text={name} />
          </TouchableHighlight>
        )
    } else {
      return <CurrentTeamCard
        team={ team.currentTeam }
        nextDisplay={ this.state.nextDisplay }
        afterAnimation={ this.afterAnimation } />
    }
  }

  renderTeams = () => {
    const { allTeams } = this.props.team
    const { display } = this.state

    if (display === 'TEAMS'){
      const teamCards = allTeams.map(team => <TeamCard team={ team } key={ team.name } profileY={this.state.profileY} nextDisplay={ this.state.nextDisplay } afterAnimation={ this.afterAnimation } navigation={this.props.navigation} />)
      return (
        <ScrollView horizontal style={{padding: 10}} >
          {teamCards}
        </ScrollView>
      )
    } else {
      const teamCards = allTeams.map(team => <SmallSquareCard image_url={ team.image_url } key={ team.name } />)
      return (
        <ScrollView horizontal style={{padding: 10}}>
          {teamCards}
        </ScrollView>
      )
    }
  }

  renderTeammates = () => {
    const { teammates } = this.props.team.currentTeam
    const { display } = this.state

    if (display === 'TEAMMATES'){
      const teammatesCard = teammates.map(teammate => <TeammateCard
        teammate={ teammate }
        key={ teammate.id }
        profileY={this.state.profileY}
        nextDisplay={ this.state.nextDisplay }
        afterAnimation={ this.afterAnimation }
        navigation={this.props.navigation} />
      )
      return (
        <ScrollView horizontal style={{padding: 10}} >
          {teammatesCard}
        </ScrollView>
      )
    } else {
      const teammatesCard = teammates.map(teammate => <SmallSquareCard image_url={ teammate.avatar } key={ teammate.id } />)
      return (
        <ScrollView horizontal style={{padding: 10}}>
          {teammatesCard}
        </ScrollView>
      )
    }
  }


  // renderCompletions = () => {
  // this could come in handy soon
  //   const { completions } = this.props.user.attributes
  //   const { display } = this.state
  //
  //   // render claimed workouts, with name and icon as a little avatar
  //   // shows more detail when display is WORKOUTS
  //
  //   if (display === 'WORKOUTS'){
  //     const workoutCards = completions.map((completion) => <CompletionCard completion={ completion } key={ completion.id } nextDisplay={ this.state.nextDisplay } afterAnimation={ this.afterAnimation } />)
  //     return (
  //       <ScrollView horizontal style={{padding: 10}} >
  //         {workoutCards}
  //       </ScrollView>
  //     )
  //   } else {
  //     const workoutCards = completions.map((completion) => <SmallSquareCard image_url={ completion.workout.image_url } key={ completion.id } />)
  //     return (
  //       <ScrollView horizontal style={{padding: 10}}>
  //         {workoutCards}
  //       </ScrollView>
  //     )
  //   }
  // }
  //

  render(){
    const { attributes } = this.props.user
    const { display } = this.state

    return (
      <View style={ HomeStyle.profile } >
        <View style={ HomeStyle.firstLayer } >
          { attributes && this.renderCurrentTeam() }
        </View>
        <View style={ HomeStyle.secondLayer }>
          <TouchableHighlight
            onPress={()=>this.changeDisplay("TEAMS")}
            underlayColor='transparent' >
            <Header text="My Teams"/>
          </TouchableHighlight>
          { attributes && this.renderTeams() }
        </View>
        <View style={ HomeStyle.thirdLayer }>
          <TouchableHighlight
            onPress={()=>this.changeDisplay("TEAMMATES")}
            underlayColor='transparent' >
            <Header text="Teammates"/>
          </TouchableHighlight>
          { attributes && this.renderTeammates() }
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    team: state.team,
    user: state.user
  }
}

export default connect(mapStateToProps)(TeamPage)
