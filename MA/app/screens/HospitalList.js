import React from 'react';
import Header from '../components/Header';
import { StyleSheet, Text, View, ScrollView,Button } from 'react-native';
import { ListItem, Icon } from 'react-native-elements'
import Search from './SearchHomeScreen';
import database from '@react-native-firebase/database';



class HLScreen extends React.Component {
  constructor(props) {
    super(props);
    this.search = React.createRef();
    this.state = {
      hospitalList: [],
      backupList:[],
    };
  }

  componentDidMount() {
    database().ref(`/Hospital`).once('value', snapshot => {
      this.setState({hospitalList: snapshot.val(), backupList: snapshot.val()})
    });
  }

  onSearch= (value) =>{
    this.setState({
      hospitalList:this.state.backupList.filter(item => item.hospital_name.toLocaleLowerCase().indexOf(value.toLocaleString())!=-1)
    })
  }

  render() {
    // const text1 = "Southbank Day Hospital";
    // const text2 = "1/140, melbonest, South Brisbane, QLD, 4001, Australia";
    // const text3="https://i.ibb.co/y0pkj2M/hospital-3.jpg";
    return (
        <View>
          <Header/>
          <View style = {{flexDirection: 'row', justifyContent:"center"}}>
            <Search onChange={this.onSearch} />
          </View>
         {/* <Button title="ididid" onPress={this.props.navigation.navigate('Time',{hospital: text1,hospitalAddress: text2,picture:text3})}></Button> */}
         
          <View>
            <ScrollView>
              {
                this.state.hospitalList.map((l, i) => (
                    <ListItem key={i} bottomDivider onPress={()=>{
                      this.props.navigation.navigate('Time', {hospital: l.hospital_name})
                    }}>
                      <Icon name="local-hospital" />
                      <ListItem.Content>
                        <ListItem.Title>{l.hospital_name}</ListItem.Title>
                        <ListItem.Subtitle>{l.address}</ListItem.Subtitle>
                      </ListItem.Content>
                      <ListItem.Chevron color="grey" />
                    </ListItem>
                ))
              }
            </ScrollView>
          </View>

        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HLScreen;