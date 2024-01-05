import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik';
import { getAllShops } from '../webEventHandlers';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'react-native-axios';
import Snackbar from 'react-native-snackbar';
import * as yup from 'yup';

const DeleteShopDialog = (props) => {

    const getShops = async () => {
        try {
            const response = await getAllShops();
            props.setShopsList(response)
        } catch (error) {
            console.log(`Error: ${error}`)
            Snackbar.show({
                text: 'Error In Fetching Shops List',
                duration: Snackbar.LENGTH_LONG
            })
        }
    }

    const deleteShop = async (id) => {
        try {
            const url = `http://10.0.2.2:5000/FoodShop/${id}`
            const response = await axios.delete(url);
            if (response.status === 200) {
                console.log("Shop Has Been Deleted Successfully");
                getShops()
                props.onClickBack()
                Snackbar.show({
                    text: 'Shop Has Been Deleted Successfully',
                    duration: Snackbar.LENGTH_LONG
                })
            }
        } catch (error) {
            console.log(`Error: ${error}`)
            Snackbar.show({
                text: 'Error In Deleting The Shop',
                duration: Snackbar.LENGTH_LONG
            })
        }
    }

    const handleSubmit = (values) => {
        console.log('Form values:', values);
        deleteShop(values.shopId)
    };

    const validationSchema = yup.object().shape({
        shopId: yup.string()
            .required('Shop Id is required'),
    });

    return (
        <Formik
            initialValues={{ shopId: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ handleChange, handleBlur, setFieldValue, handleSubmit, values, errors, touched }) => (
                <View style={styles.mainDiv}>
                    <View style={[styles.headingDiv, { alignItems: 'center', display: 'flex', justifyContent: 'center' }]}>
                        <Text style={[styles.text, { paddingTop: 5, paddingBottom: 5 }]}>
                            Ohhhh 😯😯 Please Don't Leave us 😭
                        </Text>
                    </View>
                    <View style={styles.fieldsDiv}>
                        <View>
                            <Text style={styles.fieldNamesText}>Id :</Text>
                            <TextInput
                                onChangeText={handleChange('shopId')}
                                onBlur={handleBlur('shopId')}
                                value={values.shopId}
                                placeholder="Enter the shopId you want to delete"
                                style={styles.textBox}
                                placeholderTextColor={"#999"}
                            />
                            {touched.shopId && errors.shopId && (
                                <Text style={styles.errorText}>{errors.shopId}</Text>
                            )}
                        </View>
                    </View>
                    <View style={styles.buttonDiv}>
                        <TouchableOpacity onPress={() => { props.onClickBack() }} style={styles.button}>
                            <Text style={styles.buttonText}>
                                Back
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSubmit} style={styles.button} type="submit">
                            <Text style={styles.buttonText}>
                                Submit
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </Formik>
    )
}

export default DeleteShopDialog

const styles = StyleSheet.create({
    mainDiv: {
        flex: 1,
    },
    headingDiv: {
        backgroundColor: '#a881af',
    },
    text: {
        color: 'white',
        fontWeight: 'bold'
    },
    buttonDiv: {
        display: "flex",
        flexDirection: "row",
        justifyContent: 'center',
        gap: 20,
        marginBottom: 20,
        marginTop: 10
    },
    button: {
        backgroundColor: '#a881af',
        padding: 8,
        borderRadius: 10
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    fieldsDiv: {
        margin: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
    },
    fieldNamesText: {
        color: "#212121",
        fontWeight: "bold"
    },
    textBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
        marginTop: 5,
        height: 30,
        fontSize: 16
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    }
})