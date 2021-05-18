import React,{Component} from 'react'
import {StyleSheet,View ,Text,TouchableOpacity } from 'react-native'
import {DrawerItems} from 'react-navigation-drawer'

import firebase from 'firebase'

export default class CSBMenu extends Component{
    render(){
        return(
            <View style={{flex:1}}>
            <DrawerItems {...this.props}/>
            <View style={styles.drawerContaner}>
               <TouchableOpacity style={styles.LogoutButton}
               onPress ={() =>{
                   this.props.navigation.navigate('WelcomeScreen')
                   firebase.auth().signOut()
               }}>
                   <Text>Logout</Text>
               </TouchableOpacity>
            </View>
        </View>
  
     )
 }
}
const styles = StyleSheet.create({
drawerContaner:{
 flex:1,
 justifyContent:'flex-end',
 paddingBottom:30
},
LogoutButton:{
 justifyContent:'center',
 padding:10,
 height:30,
 width:'100%'
}
})