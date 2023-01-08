import * as React from 'react';
import {useState, useEffect} from 'react';
import {View, Text,StyleSheet,TextInput,TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth"
import {colors} from '../../config/colors';
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

const Register = ({navigation}) =>{
    
  const [UserEmail,setEmail] = useState('');
  const [UserPassword, setPassword] = useState('');
  const [UserConfirmPassword, setConfirmPassword] = useState('');
    
    const __doSignUp = () => {
      console.log(UserConfirmPassword)
        if (!UserEmail || !UserPassword) {
          notifyMessage("E-mail Ya Da Şifre Boş Bırakılamaz!")
          return
        } else if (!UserPassword && UserPassword.trim() && UserPassword.length > 6) {
          notifyMessage("Zayıf Şifre, En Az 6 Karakter")
          return
        } else {
          if(UserConfirmPassword==UserPassword){
            __doCreateUser(UserEmail, UserPassword)
            return
          }else{
            notifyMessage("Girdiğiniz Şifreler Uyuşmuyor!")
          return
          }
          
        } 
      }

      const __doCreateUser = async () => {
        try {
          let response = await auth().createUserWithEmailAndPassword(UserEmail, UserPassword)
          if (response) {
            notifyMessage('Uygulamaya Hoşgeldiniz');
            let animalList = ["Snake","Elephant","Lion","Monkey","Butterfly","Horse"]
            let exploredAnimal = {
              email: UserEmail,
              isExplored: false,
              name: "",
            }
            animalList.forEach(async element => {
              exploredAnimal.name = element;
              try{
                await firestore().collection('explored_animals').add(exploredAnimal)
              } catch(e){
                notifyMessage(e.message)
              }
          });
            
            navigation.navigate("Giriş");
          }
        } catch (e) {
          notifyMessage(e.message)
        }
      }

    return(
      <View style={styles.screenContainer}>
            
        <Text style = {styles.title}>Kayıt Ol</Text>
        <View style={styles.line}/>
        <TextInput  
        style={styles.textInp}
        placeholder="Email"
        onChangeText={(UserEmail) => setEmail(UserEmail)}
        autoCapitalize="none"
        autoCorrect={false}
        />
        <TextInput 
        style={styles.textInp}
        placeholder="Şifre"
        onChangeText={(UserPassword) => setPassword(UserPassword)}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={true}
        />
        <TextInput 
        style={styles.textInp}
        placeholder="Tekrar Şifre"
        onChangeText={(UserConfirmPassword) => setConfirmPassword(UserConfirmPassword)}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={true}
        />
        <View style={styles.line} />
        <TouchableOpacity style={styles.ButtonContainer} onPress={() => __doSignUp()}>
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
});

export default Register;