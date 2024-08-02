import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import apiUrl from '../../../apiUrl';

const OrderDetail = () => {
    const route = useRoute();
    const { product } = route.params || {};

    const copyToClipboard = (text) => {
        Clipboard.setString(text);
        alert('Copied to clipboard');
    };

    return (
        <View style={styles.container}>
            {product ? (
                <>
                    <Image
                        source={{ uri: `http://${apiUrl.tuan}:3000${product.imageDescription}` }}
                        style={styles.productImage}
                    />
                    <Text style={styles.productName}>Tên sản phẩm: {product.nameProduct}</Text>
                    <Text style={styles.productPrice}>Giá: {product.price.toLocaleString()} đ</Text>
                    <Text style={styles.productDescription}>Mô tả: {product.description || 'Không có mô tả'}</Text>
                    
                    <View style={styles.row}>
                        <Text style={styles.productAccount}>Tài khoản: {product.account || 'Không có tài khoản'}</Text>
                        {product.account && (
                            <TouchableOpacity onPress={() => copyToClipboard(product.account)}>
                                <Text style={styles.copyButton}>Copy</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    
                    <View style={styles.row}>
                        <Text style={styles.productPassword}>Mật khẩu: {product.password || 'Không có mật khẩu'}</Text>
                        {product.password && (
                            <TouchableOpacity onPress={() => copyToClipboard(product.password)}>
                                <Text style={styles.copyButton}>Copy</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <Text style={styles.paymentMethod}>Phương thức thanh toán: {product.paymentMethod || 'Chưa có thông tin'}</Text>
                    <Text style={styles.paymentDate}>Ngày thanh toán: {product.paymentDate ? new Date(product.paymentDate).toLocaleString() : 'Chưa có ngày thanh toán'}</Text>
                </>
            ) : (
                <Text style={styles.text}>No product details available.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    productImage: {
        width: 200,
        height: 200,
        marginBottom: 16,
    },
    productName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 18,
        marginBottom: 8,
    },
    productDescription: {
        fontSize: 16,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    productAccount: {
        fontSize: 16,
    },
    productPassword: {
        fontSize: 16,
    },
    paymentMethod: {
        fontSize: 16,
        marginBottom: 8,
    },
    paymentDate: {
        fontSize: 16,
        marginBottom: 8,
    },
    text: {
        fontSize: 18,
    },
    copyButton: {
        fontSize: 16,
        color: 'blue',
        marginLeft: 8,
    },
});

export default OrderDetail;
