import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, Animated } from 'react-native';
import { getFavorites, clearFavorites, updateRating, removeFavorite } from './LocalStorage';
import StarRating from './StarRating';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from "@react-navigation/native";

const FavoritesScreen = ({ navigation }) => {
    const [favorites, setFavorites] = useState([]);
    const animatedValues = favorites.reduce((acc, item) => {
        acc[item.trackId] = new Animated.Value(1); // Animation pour chaque élément
        return acc;
    }, {});

    useEffect(() => {
        const loadFavorites = async () => {
            const data = await getFavorites();
            setFavorites(data);
        };
        loadFavorites();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const loadFavorites = async () => {
                const data = await getFavorites();
                setFavorites(data);
            };
            loadFavorites();
        }, [])
    );


    // Fonction pour vider la liste des favoris
    const handleClearFavorites = async () => {
        Alert.alert(
            'Vider les favoris',
            'Êtes-vous sûr de vouloir supprimer tous les favoris ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel',
                },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        await clearFavorites();
                        setFavorites([]);
                        console.log('Favorites cleared');
                    },
                },
            ],
            { cancelable: true }
        );
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={handleClearFavorites}
                    style={{ marginRight: 15 }}
                >
                    <Icon name="delete" size={24} color="#FF6B6B" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    // Fonction pour mettre à jour la note d'un favori
    const handleRatingChange = async (trackId, newRating) => {
        try {
            await updateRating(trackId, newRating);
            const updatedFavorites = favorites.map((item) =>
                item.trackId === trackId ? { ...item, rating: newRating } : item
            );
            setFavorites(updatedFavorites);
            console.log('Rating updated successfully');
        } catch (error) {
            console.error('Error updating rating:', error);
        }
    };

    // Fonction pour supprimer un favori avec confirmation
    const handleRemoveFavorite = async (trackId) => {
        Alert.alert(
            'Supprimer le favori',
            'Êtes-vous sûr de vouloir supprimer ce favori ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel',
                },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await removeFavorite(trackId);
                            const updatedFavorites = favorites.filter((item) => item.trackId !== trackId);
                            setFavorites(updatedFavorites);
                            console.log('Favorite removed successfully');
                        } catch (error) {
                            console.error('Error removing favorite:', error);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    // Animation pour l'icône de poubelle
    const animateIcon = (trackId) => {
        Animated.sequence([
            Animated.timing(animatedValues[trackId], {
                toValue: 1.2,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(animatedValues[trackId], {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    // Rendu personnalisé pour chaque élément de la liste
    const renderItem = ({ item }) => (
        <Animated.View
            style={[
                styles.itemContainer,
                {
                    transform: [{ scale: animatedValues[item.trackId] }],
                },
            ]}
        >
            {/* Image de l'album */}
            <Image
                source={{ uri: item.artworkUrl100 }}
                style={styles.artwork}
            />
            {/* Détails de la chanson */}
            <View style={styles.textContainer}>
                <Text style={styles.trackName}>{item.trackName}</Text>
                <Text style={styles.artistName}>{item.artistName}</Text>
                {/* Notation avec étoiles */}
                <StarRating
                    rating={item.rating}
                    onRatingChange={(newRating) => handleRatingChange(item.trackId, newRating)}
                />
            </View>
            {/* Icône de poubelle avec animation */}
            <TouchableOpacity
                onPress={() => {
                    animateIcon(item.trackId);
                    handleRemoveFavorite(item.trackId);
                }}
                style={styles.deleteButton}
            >
                <Icon name="delete" size={24} color="#FF6B6B" />
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Mes Favoris</Text>
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.trackId.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#4c669f', // Couleur de fond unie
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    artwork: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    trackName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    artistName: {
        fontSize: 14,
        color: '#666',
    },
    deleteButton: {
        padding: 10,
    },
});

export default FavoritesScreen;