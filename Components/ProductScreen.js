import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Image } from 'react-native';
import axios from 'axios';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { Searchbar } from "react-native-paper";

const ProductScreen = () => {
    
        const [offset, setOffset] = useState(0);
        const [loadingMore, setLoadingMore] = useState(false);
        const [productNames, setProductNames] = useState([]);
        const [products, setProducts] = useState([]);
        const [searchQuery, setSearchQuery] = useState("");
        const [filteredProducts, setFilteredProducts] = useState([]);
        const baseUrl = "http://139.59.66.191:3016/viewProducts"
        const searchUrl = `${baseUrl}?product_name=`;
        const numColumns = 2;


        const renderLoader = () => {
            if (!loadingMore) {
                return null;
            }
            
            return (
                <View style={styles.loaderStyle}>
                    <ActivityIndicator size="large" color="#ffa600" />
                </View>
            );
        };

        const loadMoreItem = () => {
            if (loadingMore) return;
            setLoadingMore(true);
            setOffset(offset + 1);
        };

        useEffect(() => {
            fetchProducts()
        }, [offset])

        const fetchProducts = () => {
            axios
            .get(`${baseUrl}?offset=${offset}&limit=10`)
            .then(res => {
                console.log("new data", res.data.data);
                setProducts(prevProducts => [...prevProducts, ...res.data.data]);
                setLoadingMore(false);
            }).catch(err => console.log(err));
        };
        
        useEffect(()=> {
            if(searchQuery !== ""){
                axios
                .get(searchUrl+ searchQuery)
                .then((res)=>{
                    const filteredSearchResults = res.data.data.map((item) => ({
                        _id: item._id,
                        productName: item.product_name,
                        productCost: item.cost
                    }));
                    setFilteredProducts(filteredSearchResults);
                })
                .catch(err => console.log(err));
            }
            else {
                setFilteredProducts(productNames);
            }
        }, [searchQuery, productNames])

        //on chaging search test

    const onChangeSearch = (query) => {
        setSearchQuery(query);
    };
    const renderProduct = ({ item }) => {
        return (
            <View style={styles.card}>
                {item.image_url && <Image source={{ uri: item.image_url }} style={styles.image} />}
                {item.product_name && <Text style={styles.title}>{item.product_name}</Text>}
                {typeof item.cost === 'number' && <Text style={styles.description}>Cost: ${item.cost.toFixed(2)}</Text>}
            </View>
        );
    };

    const renderTwoProducts = ({ item, index }) => {
        
        if (index % 2 === 0) {
            return (
                <View style={styles.row}>
                    <View style={styles.cardContainer}>
                        {renderProduct({ item })}
                    </View>
                    
                    {products[index + 1] && (
                        <View style={styles.cardContainer}>
                            {renderProduct({ item: products[index + 1] })}
                        </View>
                    )}
                </View>
            );
        } else {
            // Return null for odd index to avoid rendering a duplicate card
            return null;
        }
    }

    return(
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search Products"
                    value={searchQuery}
                    onChangeText={onChangeSearch}
                    style={styles.searchBox}
                />
            </View>
            <View style={styles.productListContainer}>
            {console.log('filteredProducts:', filteredProducts)}
            <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item._id}
                    renderItem={renderTwoProducts}
                    numColumns={numColumns}
                    ListFooterComponent={renderLoader}
                    onEndReached={loadMoreItem}
                    onEndReachedThreshold={0.1}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    )

    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        searchBox: {
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#ffa600',
            backgroundColor: "white",
            marginBottom: 10,
        },
        searchContainer: {
            backgroundColor: "#ffa600",
            paddingHorizontal: 10,
        },
        productListContainer: {
    
            alignItems: "center",
            flex: 1,
        },
        loaderStyle: {
            marginVertical: 16,
            alignItems: "center",
            justifyContent: "center",
        }
    
    
    });

    export default ProductScreen;
