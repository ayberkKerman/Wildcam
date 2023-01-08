import * as React from 'react';
import {useState,useEffect} from 'react';
import {View, Text,Input,Button,TouchableOpacity,StyleSheet,Switch,ActivityIndicator} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import auth from "@react-native-firebase/auth";
import {colors} from '../../config/colors';

import {  TextInput } from 'react-native-paper';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import {
    ToastAndroid,
    Platform,
    AlertIOS,
  } from 'react-native';


function notifyMessage(msg) {
if (Platform.OS === 'android') {
  ToastAndroid.show(msg, ToastAndroid.SHORT)
} else {
  AlertIOS.alert(msg);
}
}
let sayac = 0;
const Login =  ({navigation}) =>  {
    
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emal,setEmal] = useState("");
    const [userId, setUserId] = useState("");
    
    let [isLogged, setIsLogged] = useState(false);
    let [isLoading, setIsLoading] = useState(true);
    let [error, setError] = useState();
  
   const getData= (async ()=>{
            try{
                const data = await AsyncStorage.getItem('keepLoggedIn');
                const emall = await AsyncStorage.getItem('email');
                const uid = await AsyncStorage.getItem('uid');
                
                var trueData = (data === 'true');
                setEmal(emall)
                
                setUserId(uid)
                setIsLogged(trueData);
                setIsLoading(false)

        } catch(error){ 
            setIsLoading(false);
            setError(error)
        }
   }) 
    
        
   


    useEffect(()=>{
       
            getData();
    },[])

    const setContent =  () =>{
        sayac++;
        if(isLoading){
            return <ActivityIndicator size ="large"/>
        }
        
        if(sayac<6){
            if(isLogged==true && userId){
                
                let user = {
                    user:{
                        uid: userId.substring(1,userId.length-1),
                        email: emal.substring(1,emal.length-1),
                    },
                    
                }

                navigation.navigate("Ana Sayfa",{paramKey: user});
        
            }
        }
            
        
        if(error){
            console.log(error);
        }
        
    };

    loginUser = async (email,password) =>{
        
        try {
            if (typeof email === 'string' && email.length === 0 || typeof password === 'string' && password.length === 0) {
                notifyMessage("E-mail Ya Da Şifre Boş Olamaz!")
            }
            else{
                let user = await auth().signInWithEmailAndPassword(email,password)
                
                AsyncStorage.setItem('keepLoggedIn',JSON.stringify(isLogged))
                AsyncStorage.setItem('email',JSON.stringify(email))
                AsyncStorage.setItem('uid',JSON.stringify(user.user.uid))
                
                navigation.navigate("Ana Sayfa",{paramKey: user});
            } 
        }
        catch(error){
            notifyMessage(error.message)
        }
    }

    return (
        <View  style={styles.screenContainer}>
            {setContent()}
            <Text style = {styles.title}>Giriş</Text>
            <View style={styles.line}/>
            <TextInput  
            style={styles.textInp}
            placeholder="Email"
            onChangeText={(email) => setEmail(email)}
            autoCapitalize="none"
            autoCorrect={false}
            />
            <TextInput 
            style={styles.textInp}
            placeholder="Şifre"
            onChangeText={(password) => setPassword(password)}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            />
            <View style={styles.line} />
            <View style={styles.checkboxContainer}>
            <CheckBox
                disabled={false}
                value= {isLogged}
                onValueChange={(newValue) => setIsLogged(newValue)}
            />
                <Text style={styles.label}>Beni Hatırla</Text>
            </View>
            <TouchableOpacity style={styles.ButtonContainer} onPress={() => loginUser(email,password)}>
                <Text style={styles.ButtonText}>Giriş Yap</Text>
            </TouchableOpacity>
            <View style={styles.line} />
            <TouchableOpacity style={styles.ButtonContainer} onPress={() => navigation.navigate("Kayıt Ol")}>
                <Text style={styles.ButtonText}>Kayıt Ol</Text>
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
      paddingVertical: 10,
      paddingHorizontal: 12
    },
    ButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    },
    line:{
        marginTop: 1,
        marginBottom: 5,
        
    },
    container: {
        alignItems: 'center',
        paddingTop: 36,
        paddingHorizontal: 36,
        paddingBottom: 10, 
    },
    title:{
        fontSize: 36,
        fontWeight: '500',
        color: colors.accent,
        alignSelf: "center",
    },
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
      },
    checkbox: {
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
        marginBottom:10,
        textAlign:"center",
      },
});
export default Login;
