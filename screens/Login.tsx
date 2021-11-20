import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';

//formik
import {Formik} from 'formik';

// icons
import {Octicons, Ionicons, Fontisto } from '@expo/vector-icons';

import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    SubTitle,
    StyledFormArea,
    LeftIcon,
    StyledInputLabel,
    StyledTextInput,
    RightIcon,
    StyledButton,
    ButtonText,
    Colors,
    MsgBox,
    Line,
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent
} from "../components/styles";
import { View, ActivityIndicator } from 'react-native';

// Colors
const {brand, darkLight, primary} = Colors;

// keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper'

// API client
import axios from 'axios';

import * as Google from 'expo-google-app-auth';

const Login = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [googleSubmitting, setGoogleSubmitting] = useState(false);

    const handleLogin =  async (credentials, setSubmitting) => {
        handleMessage(null);
        const url = 'http://192.168.1.107:8081/user/signin'

        await axios
            .post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result;
                if (status !== 'SUCCESS') {
                    handleMessage(message, status)
                } else {
                    navigation.navigate('Welcome', { ...data[0] });
                }
                setSubmitting(false);
            })
            .catch(error => {
            // console.log(error.JSON());
            console.log(error);
            setSubmitting(false);
            handleMessage("An error occurred. Check your network and try again");
        })
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    const handleGoogleSignin = () => {
        setGoogleSubmitting(true);
        const config = {
            iosClientId: `812259799892-r9oneb93bgbpv2pro47bo54893tr0r87.apps.googleusercontent.com`,
            androidClientId: `812259799892-kl3t6k45sa25bu26id29v7cbg5bfa2vp.apps.googleusercontent.com`,
            scopes: ['profile', 'email']
        };

        Google
            .logInAsync(config)
            .then((result) => {
                const {type, user} = result;

                if(type == 'success'){
                    const {email, name, photoUrl} = user;
                    handleMessage('Google signin successful', 'SUCCESS');
                    setTimeout(() => navigation.navigate('Welcome', {email, name, photoUrl}), 1000);
                } else {
                    handleMessage('Google signin was cancelled');
                }
                setGoogleSubmitting(false);
            })
            .catch(error => {
                console.log(error);
                handleMessage('An error occurred. Check your network and try again');
                setGoogleSubmitting(false);
            })
    };

    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark" />
                <InnerContainer>
                    <PageLogo resizeMode="cover" source={require('./../assets/img/img1.png')}/>
                    <PageTitle>Nature Crib</PageTitle>
                    <SubTitle>Account Login</SubTitle>
                    <Formik
                        initialValues={{email: '', password: ''}}
                        onSubmit={(values, {setSubmitting}) => {
                            if (values.email == '' || values.password == '') {
                                handleMessage('Please fill all the fields')
                                setSubmitting(false);
                            } else {
                                handleLogin(values, setSubmitting);
                            }
                        }}
                    >{({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (<StyledFormArea>
                        <MyTextInput
                            label="Email Address"
                            icon="mail"
                            placeholder="exemple@gmail.com"
                            placeholderTextColor={darkLight}
                            onChangeText={handleChange('email')}
                            onblur={handleBlur('email')}
                            value={values.email}
                            keyboardType="email-address"
                        />

                        <MyTextInput
                            label="Password"
                            icon="lock"
                            placeholder="* * * * * * * *"
                            placeholderTextColor={darkLight}
                            onChangeText={handleChange('password')}
                            onblur={handleBlur('password')}
                            value={values.password}
                            secureTextEntry={hidePassword}
                            isPassword={true}
                            hidePassword={hidePassword}
                            setHidePassword={setHidePassword}
                        />
                        <MsgBox type={messageType}>{message}</MsgBox>
                        {!isSubmitting && (
                            <StyledButton onPress={handleSubmit}>
                                <ButtonText>Login</ButtonText>
                            </StyledButton>
                        )}

                        {isSubmitting && (
                            <StyledButton disabled={true}>
                                <ActivityIndicator size="large" color={primary} />
                            </StyledButton>
                        )}

                        <Line/>

                        {!googleSubmitting && (
                            <StyledButton google={true} onPress={handleGoogleSignin}>
                                <Fontisto name="google" color={primary} size={25}/>
                                <ButtonText google={true}>Sign in with Google</ButtonText>
                            </StyledButton>
                        )}

                        {googleSubmitting && (
                            <StyledButton google={true} disabled={true}>
                                <ActivityIndicator size="large" color={primary} />
                            </StyledButton>
                        )}
                        <ExtraView>
                            <ExtraText>Don't have an account already? </ExtraText>
                            <TextLink onPress={() => navigation.navigate("Signup")}>
                                <TextLinkContent>Signup</TextLinkContent>
                            </TextLink>
                        </ExtraView>
                    </StyledFormArea>)}
                    </Formik>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
    return (<View>
        <LeftIcon>
            <Octicons name={icon} size={30} color={brand} />
        </LeftIcon>
        <StyledInputLabel>{label}</StyledInputLabel>
        <StyledTextInput {...props} />
        {isPassword && (
            <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                <Ionicons name={hidePassword ?  'md-eye-off' : 'md-eye'} size={30} color={darkLight}/>
            </RightIcon>
        )}
    </View>)

}

export default Login;