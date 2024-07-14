import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import apiUrl from '../../../apiUrl';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const handleThumbnailPress = (index) => {
    setSelectedImageIndex(index);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: width * index, animated: true });
    }
  };

  return (
    <ScrollView style={styles.container}>
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

      <Text style={styles.productName}>Tên sản phẩm: {product.nameProduct}</Text>
      <Text style={styles.productPrice}>Giá: {product.price.toLocaleString()} đ</Text>
      <Text style={styles.virtualPrice}>Giá ảo: {product.virtualPrice.toLocaleString()} đ</Text>
      <Text style={styles.productDescription}>Mô tả: {product.description || 'Không có mô tả'}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width,
    height: 300,
    borderRadius: 10,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,
    color: 'red',
    marginBottom: 10,
  },
  virtualPrice: {
    fontSize: 20,
    color: 'grey',
    textDecorationLine: 'line-through',
    marginBottom: 20,
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  thumbnailList: {
    marginBottom: 20,
  },
  thumbnailListContent: {
    alignItems: 'center',
  },
  thumbnailImage: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 10,
  },
});

export default ProductDetailScreen;
