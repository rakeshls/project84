import React, { Component } from "react";
import {View, StyleSheet, Text,TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView} from "react-native";
import db from "../config";
import firebase from "firebase"
import MyHeader from "../components/MyHeader";
import {SafeAreaProvider} from 'react-native-safe-area-context'

export default class RequesteItemScreen extends Component {
  constructor() {
    super();
    this.state = {
      userName: firebase.auth().currentUser.email,
      itemName: "",
      description: "",
    };
  }
  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }

  addItem = (itemName, description) => {
    var userName = this.state.userName;
    var exchageId=this.createUniqueId()
    db.collection('exchangeRequests').add({
      "userName": userName,
      "itemName": itemName,
      "Description": description,
      "exchageId":exchageId,
      "date":firebase.firestore.FieldValue.serverTimestamp()
    });

    this.setState({
      itemName: '',
      description: '',
    })

    return alert("Item ready to exchange", "", [
      {
        text: 'OK',
        onPress: () => {
          this.props.navigation.navigate('HomeScreen');
        },
      },
    ]);
  };

  receivedBooks=(ItemName)=>{
    var userId = this.state.userId
    var requestId = this.state.requestId
    db.collection('receivedItems').add({
        "userId": userId,
        "itemName":itemName,
        "requestId"  : requestId,
        "itemStatus"  : "received",
  
    })
  }
  sendNotification=()=>{
    //to get the first name and last name
    db.collection('Users').where('EmailId','==',this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var name = doc.data().firstName
        var lastName = doc.data().lastName
  
        // to get the donor id and book nam
        db.collection('all_notifications').where('exchageId','==',this.state.requestId).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            var donorId  = doc.data().donor_id
            var bookName =  doc.data().itemName
  
            //targert user id is the donor id to send notification to the user
            db.collection('all_notifications').add({
              "targeted_user_id" : donorId,
              "message" : name +" " + lastName + " received the Items " + bookName ,
              "notification_status" : "unread",
              "itemName" : bookName
            })
          })
        })
      })
    })
  }
  render() {
    return (
      <SafeAreaProvider>
      <View style = {{ flex: 1}}>

        <MyHeader navigation={this.props.navigation} title = "Exchange items"/>

        <View style={{ flex: 1 }}>
          <KeyboardAvoidingView>
            <TextInput
              style={styles.formTextInput}
              placeholder={"item name"}
              onChangeText={(text) => {
                this.setState({
                  itemName: text,
                });
              }}
              value={this.state.itemName}
            />

            <TextInput
              style ={[styles.formTextInput,{height:300}]}
              multiline
              numberOfLines ={8}
              placeholder={"description"}
              onChangeText={(text) => {
                this.setState({
                  description: text,
                });
              }}
              value={this.state.description}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.addItem(this.state.itemName, this.state.description);
              }}
            >
              <Text> Add Item </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </View>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formTextInput: {
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button: {
    width:"75%",
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop:20
    },
});
