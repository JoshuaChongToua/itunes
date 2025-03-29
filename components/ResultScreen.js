import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { getFavorites, saveFavorite, updateRating } from './LocalStorage';
import StarRating from './StarRating';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient'; // Pour le dégradé

const ResultScreen = ({ route }) => {
    const { item } = route.params;
    const [rating, setRating] = useState(0);

    // Charger le rating existant si l'élément est déjà dans les favoris
    useEffect(() => {
        const loadRating = async () => {
            const favorites = await getFavorites();
            const favoriteItem = favorites.find((fav) => fav.trackId === item.trackId);
            if (favoriteItem) {
                setRating(favoriteItem.rating);
            }
        };
        loadRating();
    }, [item.trackId]);

    // Ajouter aux favoris
    const handleAddToFavorites = async () => {
        await saveFavorite(item);
        Alert.alert('Succès', 'Ajouté aux favoris !');
    };

    // Mettre à jour le rating
    const handleRatingChange = async (newRating) => {
        setRating(newRating);
        await updateRating(item.trackId, newRating, item);
    };

    return (
        <LinearGradient
            colors={['#1A1A2E', '#16213E', '#0F3460', '#E94560']} // Dégradé moderne
            style={styles.container}
        >
            {/* Image de l'album */}
            <Image
                source={{ uri: item.artworkUrl100 }} // Utilisation de artworkUrl100
                style={styles.artwork}
            />

            {/* Nom de la chanson */}
            <Text style={styles.trackName}>{item.trackName}</Text>

            {/* Nom de l'artiste */}
            <Text style={styles.artistName}>{item.artistName}</Text>

            {/* Bouton pour ajouter aux favoris */}
            <TouchableOpacity style={styles.favoriteButton} onPress={handleAddToFavorites}>
                <Icon name="favorite" size={24} color="#FFF" />
                <Text style={styles.favoriteButtonText}>Ajouter aux favoris</Text>
            </TouchableOpacity>

            {/* Composant StarRating pour la note */}
            <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>Votre note :</Text>
                <StarRating
                    rating={rating}
                    onRatingChange={(newRating) => handleRatingChange(newRating)}
                />
            </View>

            {/* Informations supplémentaires (optionnel) */}
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Album : {item.collectionName}</Text>
                <Text style={styles.infoText}>Genre : {item.primaryGenreName}</Text>
                <Text style={styles.infoText}>Date de sortie : {item.releaseDate.substring(0, 10)}</Text>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    artwork: {
        width: 150, // Taille réduite pour artworkUrl100
        height: 150,
        borderRadius: 10, // Coins arrondis
        marginBottom: 20,
    },
    trackName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF', // Texte blanc pour contraste
        textAlign: 'center',
        marginBottom: 10,
    },
    artistName: {
        fontSize: 18,
        color: '#DDD', // Texte gris clair pour un look sobre
        textAlign: 'center',
        marginBottom: 20,
    },
    favoriteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Bouton semi-transparent
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginBottom: 20,
    },
    favoriteButtonText: {
        fontSize: 16,
        color: '#FFF', // Texte blanc pour contraste
        marginLeft: 10,
    },
    ratingContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Fond semi-transparent
        borderRadius: 10,
        padding: 15,
        width: '80%',
        alignItems: 'center',
        marginBottom: 20,
    },
    ratingText: {
        fontSize: 18,
        color: '#FFF', // Texte blanc
        marginBottom: 10,
    },
    infoContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Fond semi-transparent
        borderRadius: 10,
        padding: 15,
        width: '80%',
    },
    infoText: {
        fontSize: 16,
        color: '#FFF', // Texte blanc
        marginBottom: 10,
    },
});

export default ResultScreen;