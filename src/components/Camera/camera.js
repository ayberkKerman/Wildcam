
import {useState, useEffect} from 'react';
import * as React from 'react';
import {View, Text,TouchableOpacity, Settings } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import mime from 'mime'
import { StyleSheet,FlatList,Image,ActivityIndicator } from 'react-native';
import {colors} from '../../config/colors';
import firestore from '@react-native-firebase/firestore';
import { Provider as PaperProvider, Portal,Dialog,Button } from 'react-native-paper';
import {Head,Cam,Register,Login,Icon} from '../../components';


const Camera = ({route}) =>{
    const [data,setData] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    let [isLoading, setIsLoading] = useState(false);
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
    let userEmail = route.params.email
    let userUid = route.params.uid

    const wait =  () =>{
        console.log(isLoading)
        if(isLoading){
            return (
                <View style={{paddingVertical: 400}}>
                    <ActivityIndicator size ="large"/>
                </View>
                
            )
        }
        
    };


    
    const takePhotoFromCamera = () =>{

        ImagePicker.openCamera({
            width: 224,
            height: 224,
            cropping: true,
        }).then(image => {
            setIsLoading(true)
            predictAndApiCall(image).then(async datas=>{
                
                
                await getPredictedAnimal(datas).then(async (value)=>{
                    setData(value);
                    await getIdPredictedAnimal(value).then(async (value2)=>{
                        let updatedAnimal={
                            email: userEmail,
                            isExplored: true,
                            name:value,
                        }
                        await firestore().collection('explored_animals').doc(value2).update(updatedAnimal)
                        setIsLoading(false)
                        setIsDialogVisible(true);
                    })
                });
                
            }) 
        });
    }

    const predictAndApiCall = (image) =>{
        const baseUrl = 'http://10.0.2.2:5000';
        
        const formData = new FormData()

        formData.append('img', {
            uri: image.path,
            type: mime.getType(image.path),
            name: image.path.split("/").pop()
        })    
        const returnedValue = axios({
            method: 'POST',
            url: `${baseUrl}/predict`,
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
                "cache-control": "no-cache",
              },
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data"
        })
        .then((response, status) => {
            
            return response.data
        })
        .catch(function (error) {
            console.log(error);
            return error; 
        });
        
        return returnedValue
    }
    const getPredictedAnimal = async (datas) =>{
        let d = "";
        await firestore().collection('animals').get().then((querySnapshot) => {
            let numberOfAnimalList = querySnapshot.docs.map((x)=> x.data().number_of_animal)
            let engNameList = querySnapshot.docs.map((x)=> x.data().eng_name)
            let trNameList = querySnapshot.docs.map((x)=> x.data().tr_name)
            let i = 0;
            let predictedAnimalIndex=null;
            
            numberOfAnimalList.forEach(element => {
                if(element==datas){
                    predictedAnimalIndex=i;
                }
                i++;
            });
            d=engNameList[predictedAnimalIndex];
            
            
        })
        return d;
    }
    const getIdPredictedAnimal = async (nameOfPredicted) =>{
        let idOfUpdatedAnimal = null;
        await firestore().collection('explored_animals').get().then((querySnapshot)=> {
            let emailList = querySnapshot.docs.map((x)=> x.data().email)
            let nameList = querySnapshot.docs.map((x)=> x.data().name)
            let isExploredBooleanList = querySnapshot.docs.map((x)=> x.data().isExplored)
            let idList = querySnapshot.docs.map((x)=> x.id)
            
            let i = 0;
            let animalsIndex= [];
            
            emailList.forEach(element => {
                if(element==userEmail){
                    animalsIndex.push(i);
                }
                i++;
            });

            let animalsNameExplored=[];
            let animalsIsExplored=[];
            let animalsIdList=[];
            animalsIndex.forEach(element =>{
                animalsNameExplored.push(nameList[element]);
                animalsIsExplored.push(isExploredBooleanList[element]);
                animalsIdList.push(idList[element]);
            });
            
            let count = 0;
            
            animalsNameExplored.forEach(element => {
                if(element==nameOfPredicted){
                    idOfUpdatedAnimal = animalsIdList[count];
                }
                count++;
            });
            

        });
        
        return idOfUpdatedAnimal;
    }


    

    
    const choosePhotoFromLibrary = async () =>{
        
        ImagePicker.openPicker({
            width: 224,
            height: 224,
            cropping: true,
        }).then(async image => {
            setIsLoading(true)
            predictAndApiCall(image).then(async datas=>{
                
                await getPredictedAnimal(datas).then(async (value)=>{
                    setData(value);
                    await getIdPredictedAnimal(value).then(async (value2)=>{
                        let updatedAnimal={
                            email: userEmail,
                            isExplored: true,
                            name:value,
                        }
                        await firestore().collection('explored_animals').doc(value2).update(updatedAnimal)
                        setIsLoading(false)
                        setIsDialogVisible(true);
                    })
                });
                
            }) 
            
        }); 
        
    }

    

    return(
        <PaperProvider>
            
            <View  style={styles.screenContainer}>
                {wait()}
                <TouchableOpacity style={styles.ButtonContainer} onPress={takePhotoFromCamera}>
                    <Text style={styles.ButtonText}>Fotoğraf Çek <Icon name='Photo' tintColor='white'></Icon></Text>
                </TouchableOpacity>
                <View style={styles.line} />
                <TouchableOpacity style={styles.ButtonContainer} onPress={choosePhotoFromLibrary}>
                    <Text style={styles.ButtonText}>Galeriden Seç <Icon name='Galery' tintColor='white'></Icon> </Text>
                </TouchableOpacity>
                
                

               
                <Portal>
                    <Dialog visible={isDialogVisible}>
                        <Dialog.Title style={styles.DialogText}>{data}</Dialog.Title>
                        
                        <Image style = {{ backgroundColor: 'transparent', alignSelf: "center", width: 150, height: 150 }} source={pathOfPictures[data]}></Image>
                        <Dialog.Actions>
                          <Button onPress={()=> setIsDialogVisible(false)}>OK</Button> 
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                
            </View>
        </PaperProvider>
    )
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
    DialogText: {
        fontSize: 18,
        color: "black",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    },
    line:{
        marginTop: 15,
        marginBottom: 5,
        
    },
});

export default Camera;

