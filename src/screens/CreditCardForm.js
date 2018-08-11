import React from 'react';
import { Keyboard, ScrollView, View, Alert,Platform, StatusBarIOS, Dimensions, TextInput, Image, Text,
    TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { Input } from 'react-native-elements';
import { FormLabel, FormInput, FormValidationMessage, CheckBox, Avatar,Header } from 'react-native-elements';
import Toast from 'react-native-root-toast';

export default class CreditCardForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            userName : '',
            creditCardNumber : '',
            cardType: 'Visa',
            expiryYear: '',
            expiryMonth: '',
            Ccv: '',
            cardIcon: "https://s3-us-west-2.amazonaws.com/ryde-bucket-oregon/icons/sample.png",
            error : false,
            isSubmitting: false,
            success : false,
            message: '',
        }
    }


    _handleCardNumberChange = (e) => {
        let cardNumber = e.replace("-","").replace("-","").replace("-","").replace("-","")
        let newCard = ''
        cardNumber.split("").forEach((element,index) => {
            if(index === 4 || index === 8 || index === 12 || index === 16 ){
                newCard = newCard +'-' + element ;
            }else{
                newCard = newCard + element;
            }
        });
        if(cardNumber.length <= 16){
            this.setState({ creditCardNumber: newCard, error: false },state=>{
                this._onChageCreditCardNumber()
            })
        }    
    }

    _handleChangeExpireMonth = (e)=> this.setState({expiryMonth : e })
   
    _handleChangeExpireYear = (e)=> this.setState({expiryYear :  e })

    _handleCcv= (e) => this.setState({Ccv: e})

    _onChageCreditCardNumber = () =>{
        const { creditCardNumber } = this.state;
        const s3Link = "https://s3-us-west-2.amazonaws.com/ryde-bucket-oregon/icons/";
        if(creditCardNumber.charAt(0) == 3 &&  ((creditCardNumber.charAt(1) == 4 || creditCardNumber.charAt(1) == 7))){
          this.setState({cardType: 'American Express', error:false ,cardIcon: s3Link+"americanExpress.png" })
        }else if(creditCardNumber.charAt(0) == 6 && (creditCardNumber.charAt(2)== 0 || creditCardNumber.charAt(1) == 4 || creditCardNumber.charAt(1) == 5)){
          this.setState({cardType: 'Discover', error:false ,cardIcon: s3Link+"discover.png" })
        }else if(creditCardNumber.charAt(0) == 3 && (creditCardNumber.charAt(1) == 9 || creditCardNumber.charAt(1) == 0 || creditCardNumber.charAt(1) == 6 || creditCardNumber.charAt(1) == 8)){
          this.setState({cardType: 'JCB', error:false ,cardIcon: s3Link+"jcb.png" })
        }else if(creditCardNumber.charAt(0) == 3 &&  (creditCardNumber.charAt(1) == 4 || creditCardNumber.charAt(1) == 7 || creditCardNumber.charAt(1) == 8)){
          this.setState({cardType: 'Diners Club/ Carte Blanche' , error:false ,cardIcon: s3Link+"dccb.png"})
        }else if(creditCardNumber.charAt(0) == 4){
          this.setState({cardType: 'Visa' , error:false ,cardIcon: s3Link+"visa.png"})
        }else if(creditCardNumber.charAt(0) == 5 && (creditCardNumber.charAt(1) >= 1 && creditCardNumber.charAt(1) <= 5)){
          this.setState({cardType: 'Mastercard' , error:false ,cardIcon: s3Link+"mastercard.png"})
        }else {
          this.setState({cardType: '' ,cardIcon: "https://s3-us-west-2.amazonaws.com/ryde-bucket-oregon/icons/sample.png"})
        }
  
      }

      _handleFormSubmit = async () => {
        try {
            const { userName,creditCardNumber,expiry } = this.state;
            this.setState({isSubmitting: true, success: false, message: ''})
            if(this.state.error){
                setTimeout(()=>{
                    this.setState({isSubmitting: false})
                },1000);
                return false;
            }
            if(!this._validate()){
                setTimeout(()=>{
                    this.setState({isSubmitting: false})
                },1000);
                return false
            }
            
            /**
             * SEND POST REQUEST TO API 
           **/
          setTimeout(()=>{
            this.setState({isSubmitting: false, success: true , message: 'Successfuly saved..!'});
          },2000);
        } catch (error) {
            console.log('Error ',error);
        }
    }

    _validate = () => {
        if(!this.state.userName){
            return false;
        }else if(!this.state.creditCardNumber){
            return false;
        }else if(!this.state.expiryMonth){
            return false;
        }else if(!this.state.expiryYear){
            return false;
        }else if(!this.state.Ccv){
            return false;
        }else if(!this.state.cardType){
            this.setState({ error: true ,message: 'Please check your card number.!'});
            return false;
        }else if(!Number.isInteger( parseInt(this.state.expiryMonth))  ){
            this.setState({ error: true ,message: 'Please check expire month.!'});
            return false;
        }else if(!Number.isInteger(parseInt(this.state.expiryYear))){
            this.setState({ error: true ,message: 'Please check expire year.!'});
            return false;
        }else if(!Number.isInteger(parseInt(this.state.Ccv))){
            this.setState({ error: true ,message: 'Please  check Ccv.!'});
            return false;
        }
        
        else{
            this.setState({ error: false});
            return true;
        }
    }

    render(){
        const { userName, creditCardNumber, expiryMonth, expiryYear, Ccv, cardIcon, isSubmitting } = this.state
        return ( 
            <ScrollView contentContainerStyle={{flex: 1}} keyboardVerticalOffset={65} behavior="padding">
                <Header
                centerComponent={{ text: 'CREDIT CARD FORM', style: { color: '#fff' } }}
                />
                <View style={styles.container}>
                  <View style={styles.row}>
                    <FormLabel labelStyle={styles.labelStyle}>Name<Text style={styles.required}>*</Text></FormLabel>
                    <FormInput 
                      containerStyle={styles.inputStyle}
                      inputStyle={styles.inputTextStyle}
                      value={userName}
                      autoCorrect={false}
                      autoCapitalize="words"
                      placeholder="Enter your name"
                      onChangeText={ userName => this.setState({userName}) }
                      />
                      { (!userName && isSubmitting) && <FormValidationMessage style={{marginLeft:0,marginRight:0}} >{'This field is required'}</FormValidationMessage>}
                  </View>

                  <View style={[styles.row, {width: '100%'}]}>
                    <FormLabel labelStyle={styles.labelStyle}>Card #<Text style={styles.required}>*</Text></FormLabel>
                    <View style={{position: 'relative'}}>
                        <FormInput
                        containerStyle={styles.inputStyle}
                        inputStyle={styles.inputTextStyle}
                        value={creditCardNumber}
                        autoCorrect={false}
                        autoCapitalize="words"
                        placeholder="**** **** **** ****"
                        onChangeText={ this._handleCardNumberChange}
                        maxLength={19}
                        />
                        { cardIcon && <Image source={{ uri: cardIcon }} style={{ width:54, height:34, marginRight:0, position: 'absolute', right: 0 }}/> }
                    </View>
                    { (!creditCardNumber && isSubmitting) && <FormValidationMessage style={{marginLeft:0,marginRight:0}} >{'This field is required'}</FormValidationMessage>}
                  </View>

                  <View style={styles.row}>
                    <FormLabel labelStyle={styles.labelStyle}>Expire Month<Text style={styles.required}>*</Text></FormLabel>
                    <FormInput
                      containerStyle={styles.inputStyle}
                      inputStyle={styles.inputTextStyle}
                      value={expiryMonth}
                      autoCorrect={false}
                      autoCapitalize="words"
                      placeholder="MM"
                      maxLength={2}
                      onChangeText={ this._handleChangeExpireMonth}
                      />
                      { (!expiryMonth && isSubmitting) && <FormValidationMessage style={{marginLeft:0,marginRight:0}} >{'This field is required'}</FormValidationMessage>}
                  </View>

                  <View style={styles.row}>
                    <FormLabel labelStyle={styles.labelStyle}>Expire Year<Text style={styles.required}>*</Text></FormLabel>
                    <FormInput
                      containerStyle={styles.inputStyle}
                      inputStyle={styles.inputTextStyle}
                      value={expiryYear}
                      autoCorrect={false}
                      autoCapitalize="words"
                      placeholder="YYYY"
                      maxLength={4}
                      onChangeText={ this._handleChangeExpireYear}
                      />
                      { (!expiryYear && isSubmitting) && <FormValidationMessage style={{marginLeft:0,marginRight:0}} >{'This field is required'}</FormValidationMessage>}
                  </View>

                  <View style={styles.row}>
                    <FormLabel labelStyle={styles.labelStyle}>Cvv<Text style={styles.required}>*</Text></FormLabel>
                    <FormInput
                      containerStyle={styles.inputStyle}
                      inputStyle={styles.inputTextStyle}
                      value={Ccv}
                      autoCorrect={false}
                      autoCapitalize="words"
                      placeholder="****"
                      maxLength={4}
                      onChangeText={ this._handleCcv}
                      />
                      { (!Ccv && isSubmitting) && <FormValidationMessage style={{marginLeft:0,marginRight:0}} >{'This field is required'}</FormValidationMessage>}
                  </View>
                
                </View>
                
                <Toast
                      visible={this.state.error}
                      backgroundColor="#E74C3C"
                      position={-1}
                      shadow={false}
                      hideOnPress={true}
                      onHide={() =>  this.setState({ error: false, message: ''})}
                      containerStyle={{alignItems:'flex-start', width:'100%', borderRadius:0, padding:30}}
                  >
                    <Text style={{fontSize:16, fontWeight:'600'}}>{ this.state.message }</Text>
                </Toast>
                <Toast
                      visible={this.state.success}
                      backgroundColor="#00b300"
                      position={-1}
                      shadow={false}
                      hideOnPress={true}
                      onHide={() =>  this.setState({ success: false, message: ''})}
                      containerStyle={{alignItems:'flex-start', width:'100%', borderRadius:0, padding:30}}
                  >
                    <Text style={{fontSize:16, fontWeight:'600'}}>{ this.state.message }</Text>
                </Toast>
                <TouchableOpacity style={styles.mainButton} onPress={() => this._handleFormSubmit() }>
                    <Text style={styles.mainButtonText} >ADD</Text>
                    { this.state.isSubmitting && <ActivityIndicator size="small" color="#fff" />}
                </TouchableOpacity>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    wrapper:{
      flex:1,
      backgroundColor: 'red'
    },
    container:{
        flex:1,
        padding:15,
    },
    row:{
      paddingVertical:15
    },
    required:{
      color:'#E74C3C'
    },
    //Form Styles
    labelStyle: {
      color: '#999',
      fontSize: 16,
      fontWeight: '100',
      marginTop:0,
      marginBottom:0,
      marginLeft:0,
      marginRight:0
    },
    inputStyle:{
      marginLeft:0,
      marginRight:0,
      borderBottomColor:'#ddd'
    },
    inputTextStyle:{
      color:'#484848',
      width:'100%',
      paddingTop:10,
      paddingBottom:10,
      height:44
    },
    mainButton: {
      backgroundColor: '#476dc5',
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    mainButtonText:{
      color: '#FFF',
      fontWeight: '600',
      fontSize: 20,
      textAlign:'center',
      marginRight: 10
    },

    flexContainer:{
        flexDirection: 'row',
        alignItems: 'center'
    }
  });
  