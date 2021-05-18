import React from 'react'
import { Text, View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import MyHeader from '../components/MyHeader'
import {ListItem} from 'react-native-elements'
import db from '../config'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {SafeAreaView} from 'react-navigation'
export default class HomeScreen extends React.Component{
    constructor(){
        super();
        this.state={
            requestedBooksList : []
        }
        this.requestRef=null
    }
    getRequestedBooksList =()=>{
        this.requestRef = db.collection('exchangeRequests')
        .onSnapshot((snapshot)=>{

          var requestedBooksList =[]
           snapshot.forEach((doc)=>{
             requestedBooksList.push(doc.data())
           })
          this.setState({
            requestedBooksList : requestedBooksList
          });
        })
      }
    
      componentDidMount(){
        this.getRequestedBooksList()
      }
    
      componentWillUnmount(){
        this.requestRef();
      }
    
      keyExtractor = (item, index) => index.toString()
    
      renderItem = ( {item, i} ) =>{
        console.log(item)
        return (
          <ListItem
            key={i}
            title={item.itemName}
            subtitle={item.Description}
            titleStyle={{ color: 'black', fontWeight: 'bold' }}
            rightElement={
                <TouchableOpacity style={styles.button}
                onPress={()=>{
                  this.props.navigation.navigate('RecvDetailsScreen',{'details':item})
                }}
               >
                  <Text style={{color:'#ffff'}}>Exchange</Text>
                </TouchableOpacity>
              }
            bottomDivider
          />
        )
      }
    
    render(){
        return(
          <SafeAreaProvider>
         <MyHeader navigation={this.props.navigation} title="Barter App" />
         <View style={{flex:1}}>
          {
            this.state.requestedBooksList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of All Requested List</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.requestedBooksList}
                renderItem={this.renderItem}
              />
            )
          }
            </View>
            </SafeAreaProvider>
        )
    }
}
const styles = StyleSheet.create({
    subContainer:{
      flex:1,
      fontSize: 20,
      justifyContent:'center',
      alignItems:'center'
    },
    button:{
      width:100,
      height:30,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8
       }
    }
  })