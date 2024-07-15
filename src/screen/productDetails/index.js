import React, { useState, useRef, useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity, Dimensions, Button } from 'react-native';
import apiUrl from '../../../apiUrl';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';


const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarVisible: false,
    });
  }, [navigation]);

  const handleThumbnailPress = (index) => {
    setSelectedImageIndex(index);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: width * index, animated: true });
    }
  };

  const handleButtonPress = () => {
    navigation.navigate('Home')
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={handleButtonPress}>
        <View style={styles.btnBack}>
          <Ionicons name="chevron-back-outline" size={25} color="#000" style={{ justifyContent: 'center', marginHorizontal: 10 }} />
          <Text style={{ fontSize: 16, textAlignVertical: 'center' }}>Quay lại</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.imageDetail}>
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            ref={scrollViewRef}
            onMomentumScrollEnd={(event) => {
              const index = Math.floor(event.nativeEvent.contentOffset.x / width);
              setSelectedImageIndex(index);
            }}
            showsHorizontalScrollIndicator={false}
          >
            {product.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: `http://${apiUrl.tuan}:3000${image}` }}
                style={styles.productImage}
              />
            ))}
          </ScrollView>
          <Text style={styles.imageCount}>
            {selectedImageIndex + 1}/{product.images.length}
          </Text>
        </View>

        <FlatList
          data={product.images}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => handleThumbnailPress(index)}>
              <Image source={{ uri: `http://${apiUrl.tuan}:3000${item}` }} style={styles.thumbnailImage} />
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          style={styles.thumbnailList}
          contentContainerStyle={styles.thumbnailListContent}
        />
      </View>



      <ScrollView style={styles.scrollView}>

        <Text style={styles.productName}>Tên sản phẩm: {product.nameProduct}</Text>
        <Text style={styles.productPrice}>Giá: {product.price.toLocaleString()} đ</Text>
        <Text style={styles.virtualPrice}>Giá gốc: {product.virtualPrice.toLocaleString()} đ</Text>
        <Text style={styles.productDescription}>Mô tả: {product.description || 'Không có mô tả'}</Text>
        
      </ScrollView>

      <View style={styles.buttonContainer}>
        <View style={styles.heartContainer}>
          <TouchableOpacity style={styles.btnHeart}>
            <Ionicons name="heart-outline" size={28} color="#000" style={{ justifyContent: 'center' }} />
            <Text style={styles.textHeart}>Lưu</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.payContainer}>
          <TouchableOpacity style={styles.btnPay}>
            <Text style={styles.textPay}>Mua ngay</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: 'whitesmoke',
  },
  btnBack: {
    flexDirection: 'row',
    paddingVertical: 10
  },
  scrollView: {
    flex: 1,
    marginBottom: 60, // To ensure scroll content is not hidden by the button
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingHorizontal: 5,
  },

  imageDetail: {
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width,
    height: 210,
    resizeMode: 'cover',
  },
  imageCount: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 14,
  },
  productName: {
    fontSize: 18,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  productPrice: {
    fontSize: 20,
    color: 'red',
    marginBottom: 10,
    marginHorizontal: 10,
  },
  virtualPrice: {
    fontSize: 20,
    color: 'grey',
    textDecorationLine: 'line-through',
    marginBottom: 20,
    marginHorizontal: 10,
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 20,
    marginHorizontal: 10,
  },
  thumbnailList: {
    marginHorizontal: 10,

  },
  thumbnailListContent: {
    alignItems: 'center',

  },
  thumbnailImage: {
    width: 100,
    height: 60,
    marginVertical: 15,
    marginRight: 10,
    borderRadius: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 10,
  },

  heartContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRightWidth: 0.2,
    borderColor: '#a5a5a5'
  },
  btnHeart: {
    alignItems: 'center',
  },
  textHeart: {
    color: '#000'
  },

  payContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  btnPay: {
    alignSelf: 'center',
    backgroundColor: '#fc621b',
    paddingVertical: 10,
    width: '100%',
    borderRadius: 90,
  },
  textPay: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    fontWeight: '700'
  },
});

export default ProductDetailScreen;
