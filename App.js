import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ProductScreen from './Components/ProductScreen';

export default function App() {
  return (
    <View style={style.BG}>
      <StatusBar style="auto" />
      <ProductScreen />
    </View>
  );
}

const style = StyleSheet.create({
  BG:{
      backgroundColor:"#FFF",
      flex:1,
      marginTop:50
  }
 
});
