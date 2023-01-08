import * as React from 'react';
import {useState, useEffect} from 'react';
import {View, Text,StyleSheet,TouchableOpacity,FlatList,SafeAreaView,Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {colors} from '../../config/colors';
import {ToastAndroid,Platform,AlertIOS} from 'react-native';
import { LogBox } from 'react-native';
import {Head,Camera,Register,Login,Icon} from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';

const pathOfPictures = {
    Monkey: require("../../assets/photos/Monkey.png"),
    Horse: require("../../assets/photos/Horse.png"),
    Snake: require("../../assets/photos/Snake.png"),
    Butterfly: require("../../assets/photos/Butterfly.png"),
    Elephant: require("../../assets/photos/Elephant.png"),
    Lion:require("../../assets/photos/Lion.png"),
    MaskedMonkey: require("../../assets/photos/MaskedMonkey.png"),
    MaskedHorse: require("../../assets/photos/MaskedHorse.png"),
    MaskedSnake: require("../../assets/photos/MaskedSnake.png"),
    MaskedButterfly: require("../../assets/photos/MaskedButterfly.png"),
    MaskedElephant: require("../../assets/photos/MaskedElephant.png"),
    MaskedLion:require("../../assets/photos/MaskedLion.png"),
}

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'Each child in a list should have a unique "key" prop.',
    'Warning: Cannot update a component (`ForwardRef(BaseNavigationContainer)`) while rendering a different component (`Login`). To locate the bad setState() call inside `Login`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render'
]);





function notifyMessage(msg) {
if (Platform.OS === 'android') {
  ToastAndroid.show(msg, ToastAndroid.SHORT)
} else {
  AlertIOS.alert(msg);
}
}


const Header = ({route,navigation}) =>{


    const [nameData,setNameData] = useState([]);
    const [boolData,setBoolData] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    let userEmail = route.params.paramKey.user.email;
    let userUid = route.params.paramKey.user.uid
    
    navigation.addListener('focus', () => {
        databaseCall(userEmail)
    });
    const logOut = async () => {
        AsyncStorage.setItem('keepLoggedIn',JSON.stringify(false));
        AsyncStorage.setItem('email',JSON.stringify(""));
        AsyncStorage.setItem('uid',JSON.stringify(""));
        navigation.navigate("Giriş");

    }


    const databaseCall = async (useremail) => {
        
        let animalsNameExplored=[];
        let animalsIsExplored=[];
        await firestore().collection('explored_animals').onSnapshot(async (querySnapshot)=> {
            let emailList = querySnapshot.docs.map((x)=> x.data().email)
            let nameList = querySnapshot.docs.map((x)=> x.data().name)
            let isExploredBooleanList = querySnapshot.docs.map((x)=> x.data().isExplored)
    
            let i = 0;
            let animalsIndex= [];
            
            emailList.forEach(element => {
                if(element==useremail){
                    animalsIndex.push(i);
                }
                i++;
            });
    
            
            animalsIndex.forEach(element =>{
                animalsNameExplored.push(nameList[element]);
                animalsIsExplored.push(isExploredBooleanList[element]);
            });
            
            setNameData(animalsNameExplored);
            setBoolData(animalsIsExplored);
  
        });
        
        
    }
    useEffect(() => {
        databaseCall(userEmail).then((nameD) =>{
            setIsVisible(true);
        } );
        
      },[true]);
   
    
    return(
        <View style={styles.screenContainer}>
            
            <View style={styles.container}>
            
                <Text style = {styles.title}>HAYVANLAR</Text>
                
                <View style={styles.line}/>
                <View visible={isVisible} style ={styles.list}>
                
                    <FlatList 
                        data={nameData}
                        extraData={boolData}
                         renderItem={({ item, index }) => {
                        if (boolData[index]==false) {
                            return (
                            <View style={{ alignItems: 'center',backgroundColor: "#e0ffff",flexDirection: 'row'}}>
                                <Text style={styles.falseitem}>{item} </Text>
                                <Image style = {{ backgroundColor: 'transparent', alignSelf: "center", width: 65, height: 65 }} source={pathOfPictures["Masked"+item]}></Image>
                                
                            </View>
                            )
                        }
                            return( 
                            <View style={{ alignItems: 'center',backgroundColor: "#e0ffff",flexDirection: 'row'}}>
                                <Text style={styles.trueitem}>{item} </Text>
                                <Image style = {{ backgroundColor: 'transparent', alignSelf: "center", width: 65, height: 65 }} source={pathOfPictures[item]}></Image>
                                
                            </View>
                            
                            
                            )
                        }}
                         
                        keyExtractor={(item) => item.id}
                    />

                </View>
                
            </View>
            
            <TouchableOpacity style={styles.ButtonContainer} onPress={() => navigation.navigate("Kamera",{email: userEmail, uid: userUid})}>
            
                <Text style={styles.ButtonText}>  Kamera  <Icon name='Camera' tintColor='white'></Icon></Text>
                
            </TouchableOpacity>
            <TouchableOpacity style={styles.logOutButtonContainer} onPress={()=>logOut()}>
            
                <Text style={styles.ButtonText}>  Çıkış Yap  </Text>
                
            </TouchableOpacity>
        </View>
            
    );
    
}

const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,
      justifyContent: "center",
      padding: 16,
      backgroundColor: colors.background,
    },
    ButtonContainer: {
      elevation: 8,
      backgroundColor: "#009688",
      borderRadius: 10,
      paddingVertical: 5,
      paddingHorizontal: 6,
      marginBottom: 10,
      
    },
    logOutButtonContainer: {
        elevation: 8,
        backgroundColor: "#009688",
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 6,
        marginBottom: 60,
      },
    ButtonText: {
        fontSize: 24,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    },
    line:{
        width:90,
        height: 1,
        marginTop: 1,
       
        backgroundColor: colors.gray,
    },
    container: {
        alignItems: 'center',
        paddingTop: 100,
        paddingHorizontal: 36,
        paddingBottom: 10, 
        backgroundColor: colors.background,
        
    },
    title:{
        fontSize: 36,
        fontWeight: '500',
        color: colors.accent,
        alignSelf: "center",
        
    },
  
    subtitle:{
        fontSize: 18,
        color: colors.text_color,
    },
    textInp:{
        paddingTop:2,
        paddingBottom:1,
        width:380,
        fontSize:20,
        borderBottomWidth:1,
        borderBottomColor:'#000',
  
        marginTop: 20,
        marginBottom: 15,
        textAlign:"center",
    },
    list:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
    },
    falseitem: {
        padding: 20,
        fontSize: 18,
        marginTop: 5,
        paddingLeft: 100,
        backgroundColor: "#e0ffff",
        fontWeight: "bold",
        textAlign:'center',
        textTransform: "uppercase",
        opacity: 0.5
    },
    trueitem: {
        padding: 20,
        fontSize: 18,
        marginTop: 5,
        paddingLeft: 100,
        backgroundColor: "#e0ffff",
        fontWeight: "bold",
        textAlign:'center',
        textTransform: "uppercase",
        
    },
  });

export default Header;