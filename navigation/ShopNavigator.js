import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductsDetailScreen from '../screens/shop/ProductsDetailScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import CartScreen from '../screens/shop/CartScreen';

import colors from '../constants/Colors';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? colors.primary : ''
  },
  headerTitleStyle: { fontFamily: 'open-sans-bold' },
  headerBackTitleStyle: { fontFamily: 'opan-sans' },
  headerTintColor: Platform.OS === 'android' ? 'white' : colors.primary
}

const ProductsNavigator = createStackNavigator({
  ProductsOverview: ProductsOverviewScreen, 
  ProductDetail: ProductsDetailScreen,
  Cart: CartScreen 
}, {
  navigationOptions: {
    drawerIcon: drawerConfig => <Ionicons name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'} size={23} color={drawerConfig.tintColor} />
  },
  defaultNavigationOptions: defaultNavOptions
});

const OrdersNavigator = createStackNavigator({
  Orders: OrdersScreen
}, {
  navigationOptions: {
    drawerIcon: drawerConfig => <Ionicons name={Platform.OS === 'android' ? 'md-list' : 'ios-list'} size={23} color={drawerConfig.tintColor} />
  },
  defaultNavigationOptions: defaultNavOptions 
});

const AdminNavigator = createStackNavigator({
  UserProducts: UserProductsScreen, 
  EditProduct: EditProductScreen
}, {
  navigationOptions: {
    drawerIcon: drawerConfig => <Ionicons name={Platform.OS === 'android' ? 'md-create' : 'ios-create'} size={23} color={drawerConfig.tintColor} />
  },
  defaultNavigationOptions: defaultNavOptions
});


const ShopNavigator = createDrawerNavigator({
  Products: ProductsNavigator,
  Orders: OrdersNavigator,
  Admin: AdminNavigator
}, {
  contentOptions: {
    activeTintColor: colors.primary
  }
})


export default createAppContainer(ShopNavigator);