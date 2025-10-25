import React, { useState } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Styles
import { TextStyles } from '../../../styles/Text';

const { width } = Dimensions.get('window');

const slides = [
  { id: '1', title: 'Écrit', text: 'Découvrez notre app 🚀' },
  { id: '2', title: 'Lis tes postes', text: 'Facile à utiliser' },
  { id: '3', title: 'Puissant', text: 'Conçu pour aller loin' },
];

export default function Onboarding() {
  const navigation = useNavigation<any>();

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <FlatList
      data={slides}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={e => {
        const index = Math.round(e.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
      }}
      renderItem={({ item }) => (


        <View style={styles.page}>

          <View>
            <Text style={TextStyles.Title}>{item.title}</Text>

            {item.id === '3' ? (
              <Pressable onPress={() => {navigation.navigate('SignUp')}} >
                <Text style={[TextStyles.MoreButton, { marginTop: 20, color: 'blue' }]}>Commencer</Text>
              </Pressable>
            ): null}
          </View>
          
        </View>


      )}
      keyExtractor={item => item.id}
    />
  );
}

const styles = StyleSheet.create({
  page: {
    width,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
});