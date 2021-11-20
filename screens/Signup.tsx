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
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';

// Colors
const {brand, darkLight, primary} = Colors;

//Datetimepicker
import DateTimePicker from '@react-native-community/datetimepicker';

// keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper'

//api client
import axios from "axios";


const Signup = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date(2000, 0, 1));

    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    //Actual date of birth to be sent
    const [dob, setDob] = useState();

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
        setDob(currentDate);
    }

    const showDatePicker = () => {
        setShow(true)
    }

    //form handling
    const handleSignup =  async (credentials, setSubmitting) => {
        handleMessage(null);
        const url = 'http://192.168.1.107:8081/user/Signup'

        await axios
            .post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result;
                if (status !== 'SUCCESS') {
                    handleMessage(message, status)
                } else {
                    navigation.navigate('Welcome', { ...data });
                }
                setSubmitting(false);
            })
            .catch(error => {
                // console.log(error.JSON());
                // console.log(error);
                setSubmitting(false);
                handleMessage("An error occurred. Check your network and try again");
            })
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark" />
                <InnerContainer>
                    <PageTitle>Nature Crib</PageTitle>
                    <SubTitle>Account Signup</SubTitle>

                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode='date'
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                        />
                    )}

                    <Formik
                        initialValues={{ name: '', email: '', dateOfBirth: '', password: '', confirmPassword: ''}}
                        onSubmit={(values, {setSubmitting}) => {
                            values = {...values, dateOfBirth: dob}
                            if (values.email == '' || values.password == '' || values.name == '' || values.dateOfBirth == '' || values.confirmPassword == '') {
                                handleMessage('Please fill all the fields')
                                setSubmitting(false);
                            } else if (values.password !== values.confirmPassword) {
                                handleMessage('Passwords do not match')
                                setSubmitting(false);
                            } else {
                                handleSignup(values, setSubmitting);
                            }
                        }}
                    >{({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (<StyledFormArea>
                        <MyTextInput
                            label="Full Name"
                            icon="person"
                            placeholder="Richard Barnes"
                            placeholderTextColor={darkLight}
                            onChangeText={handleChange('name')}
                            onblur={handleBlur('name')}
                            value={values.name}
                        />

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
                            label="Date of Birth"
                            icon="calendar"
                            placeholder="YYYY- MM - DD"
                            placeholderTextColor={darkLight}
                            onChangeText={handleChange('dateOfBirth')}
                            onblur={handleBlur('dateOfBirth')}
                            value={dob ? dob.toDateString() : ''}
                            isDate={true}
                            editable={false}
                            showDatePicker={showDatePicker}
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

                        <MyTextInput
                            label="Confirm Password"
                            icon="lock"
                            placeholder="* * * * * * * *"
                            placeholderTextColor={darkLight}
                            onChangeText={handleChange('confirmPassword')}
                            onblur={handleBlur('confirmPassword')}
                            value={values.confirmPassword}
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
                        <ExtraView>
                            <ExtraText>Already have an account? </ExtraText>
                            <TextLink onPress={() => navigation.navigate('Login')}>
                                <TextLinkContent>Login</TextLinkContent>
                            </TextLink>
                        </ExtraView>
                    </StyledFormArea>)}
                    </Formik>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, isDate, showDatePicker, ...props }) => {
    return (<View>
        <LeftIcon>
            <Octicons name={icon} size={30} color={brand} />
        </LeftIcon>
        <StyledInputLabel>{label}</StyledInputLabel>
        {!isDate && <StyledTextInput {...props} />}
        {isDate && <TouchableOpacity onPress={showDatePicker}>
            <StyledTextInput {...props} />
        </TouchableOpacity>}
        {isPassword && (
            <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                <Ionicons name={hidePassword ?  'md-eye-off' : 'md-eye'} size={30} color={darkLight}/>
            </RightIcon>
        )}
    </View>)

}

export default Signup;