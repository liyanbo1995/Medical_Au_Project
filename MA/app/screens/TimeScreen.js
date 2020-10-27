import React, { useState, useEffect } from 'react';
import {Image, StyleSheet, Text, TouchableHighlight, View, Button, Alert, ScrollView} from 'react-native';
import Header from '../components/Header';
import FormButton from '../components/FormButton';
import database from '@react-native-firebase/database';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ListItem, Icon } from 'react-native-elements';
import Modal from 'react-native-modal';




const TimeScreen = (props) => {
    const { hospitalID } = props.route.params;
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateProps, setDateProps] = useState(new Date());
    const [weekDay, setWeekday] = useState(dateProps.getDay());
    const [address, setAddress] = useState('');
    const [area, setArea] = useState('');
    const [price, setPrice] = useState('');
    const [name, setName] = useState('');
    const [dateDisplay, setDateDisplay] = useState('Choose a day to start your booking');
    const [description, setDescription] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    

    useEffect(() => {
        database().ref(`/Hospital/${hospitalID}`).once('value', snapshot => {
        setAddress(snapshot.val().address); 
        setArea(snapshot.val().area);
        setPrice(snapshot.val().average_price);
        setName(snapshot.val().hospital_name);
        setDescription(snapshot.val().description);
        });
      }, 
      [])

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        // console.warn("A date has been picked: ", date);
        setDateProps(date);
        setWeekday(date.getDay())
        hideDatePicker();
    };

    function dateGet() {
        var date = new Date();
        var day = date.getDate();
        return day;
    }

    function dateMonthGet() {
        var date = new Date();
        var month = date.getMonth() + 1;
        return month;
    }

    function getDate() {
        var date = dateProps;
       

        var year = date.getFullYear().toString();
        var month = (date.getMonth()+1).toString();
        var day = date.getDate().toString();
        var hour =  date.getHours().toString();
        var minute = date.getMinutes().toString();
        var weekday = weekDay.toString();

        return day+'/'+month+'/'+year +' 星期'+ weekday + ' '+hour+':'+(date.getMinutes()<10?'0':'') + minute;
        };
    
        const list = [
            {
              title: "Hospital",
              icon: 'person-outline',
              subtitle: name,
            },
            {
                title: "Area",
                icon: 'wc',
                subtitle: area
              },
            {
              title: "Address",
              icon: 'pin-drop',
              subtitle: address
            },
            {
                title: "Reference Price",
                icon: 'pin-drop',
                subtitle: "$" + price
              },
          ]
          const desList = [
              {
                title: "Hospital Description",
                icon: 'pin-drop',
                subtitle: "Tap me" 
              }
          ]
          

  return (
    <View>
      <Header/>
      <View>
            {
            list.map((item, i) => (
            <ListItem key={i} bottomDivider >
            <Icon name={item.icon}/>
            <ListItem.Content>
            <ListItem.Title>{item.title}</ListItem.Title>
            <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
            </ListItem.Content>
            </ListItem>
            ))
            }
            {
            desList.map((item, i) => (
            <ListItem key={i} bottomDivider onPress = {()=> setModalVisible(true)}>
            <Icon name={item.icon}/>
            <ListItem.Content>
            <ListItem.Title>{item.title}</ListItem.Title>
            <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
            </ListItem>
            ))
            }
      </View>
     
     <View style = {styles.timeBox}>
        <Text>{dateDisplay}</Text>
     <Button title="Show Date Picker" onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
     </View>

      
      <FormButton buttonTitle='Next step' onPress={()=>{
          if(dateProps.getMonth() > dateMonthGet() || dateProps.getDate() >= dateGet()){
            props.navigation.navigate('DoctorList', {weekDay: weekDay, date: dateProps.toDateString(), hospitalID: hospitalID });
          } else {
              Alert.alert("Invalid date","Sorry, the date in the past cannot be booked.")
          }}} />
        
          <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          isVisible={modalVisible}
        >
          <View style={styles.centeredView}>
          
            <View style={styles.modalView}>

              <Text style={styles.modalHead}>About</Text>
              <View  style = {styles.desScrollView}>
                  <ScrollView persistentScrollbar = {true} >
                  <Text>{description}</Text>
                  </ScrollView>
              </View>
              
              
            </View>
            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center", height:10}}>
            <Icon name="close"
                onPress={() => {
                  setModalVisible(!modalVisible);}}
                size={17} color="white" style={{}}/>
                <Text onPress={() => {
                  setModalVisible(!modalVisible);}} style={{color:'white', fontSize:17, marginLeft:3}} >close</Text>
            </View>
           
          </View>
        </Modal>
      </View>
    </View>
  );
  };

const styles = StyleSheet.create({
    hitText: {
        marginTop:60,
        textAlign:"center",
        fontSize:20
    },
    infsStyle:{
        fontSize:20,
    },
    imageStyle:{
        marginTop:10,
        marginLeft:65,
        width:250,
        height:200,

    },
    container: {
        flex: 1,
        flexDirection:"row",
        marginTop: 40
    },
    rowItem:{
        flex: 1,
        flexDirection:"column",
        backgroundColor:"white",
        alignItems:"center"
    },
    image:{
        width:180,
        height:300,
        borderWidth:2,
        borderRadius:8,
        borderColor:"#E5E5E5",
    },
    imgText: {
        textAlign:"center",
        fontSize:20,
        color:"white"
    },
    timeBox: {
        
    },
    desBox: {
        backgroundColor: "blue",

    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        height:350,
        width:300,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      modalHead: {
        marginBottom: 10,
        textAlign: "center",
        fontSize: 21,
        fontWeight:"bold"
      },
      desScrollView: {
        height:210,
      }
});

export default TimeScreen;
