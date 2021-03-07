import React, { useEffect, useCallback, useReducer } from 'react';
import { View, ScrollView, Text, TextInput, Platform, Alert, StyleSheet } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import {useSelector, useDispatch} from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import Input from '../../components/UI/Input';
import {createProduct, updateProduct} from '../../store/actions/products';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      formIsValid: updatedFormIsValid
    };
  }
  return state;
};

const EditProductScreen = props => {
  const prodId = props.navigation.getParam('productId');
  const editedProduct = useSelector(state => state.products.userProducts.find(product => product.id === prodId));
  const dispatch = useDispatch();

  // we pass our reducer as first argument, and an initial state as second arg.
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct?.title || '',
      imageUrl: editedProduct?.imageUrl || '',
      description: editedProduct?.description || '',
      price: ''
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
    }, 
    formIsValid: editedProduct ? true : false
  });

  const submitHandler = useCallback(() => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please, check the errors in the form', [{
        text: 'Okay'
      }]);
      return;
    }
    if (editedProduct) {
      dispatch(updateProduct(prodId, formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl));
    } else {
      dispatch(createProduct(formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl, +formState.inputValues.price));
    }
    props.navigation.goBack();
  }, [dispatch, prodId, formState]);

  const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
    dispatchFormState({
      type: FORM_INPUT_UPDATE, 
      value: inputValue, 
      isValid: inputValidity,
      input: inputIdentifier
    });
  }, [dispatchFormState]);

  useEffect(() => {
    props.navigation.setParams({'submit': submitHandler})
  }, [submitHandler]);

  return (
    <ScrollView>
      <View style={styles.form}>
        <Input 
          id='title'
          label="title"
          errorText="Please, enter a valid title!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="next"
          onInputChange={inputChangeHandler}
          initialValue={editedProduct?.title || ''}
          initiallyValid={!!editedProduct}
          required
        />
        <Input 
          id='imageUrl'
          label="image Url"
          errorText="Please, enter a valid image url!"
          keyboardType="default"
          returnKeyType="next"
          onInputChange={inputChangeHandler}
          initialValue={editedProduct?.imageUrl || ''}
          initiallyValid={!!editedProduct}
          required
        />
        {editedProduct 
          ? null 
          : (
            <Input 
              id='price'
              label="Price"
              errorText="Please, enter a valid price!"
              keyboardType="decimal-pad"
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              required
              min={0.1}
            />
        )}
        <Input 
          id='description'
          label="Description"
          errorText="Please, enter a valid description!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          multiline
          numberOfLines={3}
          onInputChange={inputChangeHandler}
          initialValue={editedProduct?.description || ''}
          initiallyValid={!!editedProduct}
          required
          minLength={5}
        />
      </View>
    </ScrollView>
  );
};

EditProductScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam('submit');

  return {
    headerTitle: navData.navigation.getParam('productId') ? 'Edit Product' : 'Add Product',
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item 
            title='Save' 
            iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'} 
            onPress={submitFn} 
          />
        </HeaderButtons>
      );
    }
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20
  }
});

export default EditProductScreen;