import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, Image } from 'react-native';
import { getFavorites, saveFavorite, updateRating } from './LocalStorage';
import StarRating from './StarRating'; // Importez votre composant personnalisé

const ResultScreen = ({ route }) => {
    const { item } = route.params;
    const [rating, setRating] = useState(0);

    // Charger le rating existant si l'élément est déjà dans les favoris
    useEffect(() => {
        const loadRating = async () => {
            console.log('Loading rating for trackId:', item.trackId); // Vérifier le trackId
            const favorites = await getFavorites();
            console.log('Favorites loaded:', favorites); // Vérifier les favoris chargés
            const favoriteItem = favorites.find((fav) => fav.trackId === item.trackId);
            if (favoriteItem) {
                console.log('Rating found:', favoriteItem.rating); // Vérifier le rating trouvé
                setRating(favoriteItem.rating);
            } else {
                console.log('No rating found for this track.'); // Aucun rating trouvé
            }
        };
        loadRating();
    }, [item.trackId]); // Déclencher à chaque changement de trackId

    // Ajouter aux favoris
    const handleAddToFavorites = async () => {
        await saveFavorite(item);
        Alert.alert('Succès', 'Ajouté aux favoris !');
    };

    // Mettre à jour le rating
    const handleRatingChange = async (newRating) => {
        console.log('1. Setting rating:', newRating);
        setRating(newRating);
        console.log('2. Updating rating in storage...');
        await updateRating(item.trackId, newRating, item); // Passer `item` en paramètre
        console.log('3. Rating saved:', newRating);
    };

    return (
        <View style={styles.container}>
            {/* Image en haut de l'écran */}
            <Image
                source={{ uri: item.artworkUrl100 }} // URL de l'image de l'album/single
                style={styles.artwork}
            />

            {/* Nom de la chanson */}
            <Text style={styles.trackName}>{item.trackName}</Text>

            {/* Nom de l'artiste */}
            <Text style={styles.artistName}>{item.artistName}</Text>

            {/* Bouton pour ajouter aux favoris */}
            <Button title="Ajouter aux favoris" onPress={handleAddToFavorites} />

            {/* Composant StarRating pour la note */}
            <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>Votre rating :</Text>
                <StarRating
                    rating={rating}
                    onRatingChange={(newRating) => handleRatingChange(newRating)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', // Centrer le contenu horizontalement
        padding: 16,
    },
    artwork: {
        width: 200, // Taille de l'image
        height: 200,
        borderRadius: 8, // Coins arrondis
        marginBottom: 16, // Espace sous l'image
    },
    trackName: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center', // Centrer le texte
        marginBottom: 8, // Espace sous le nom de la chanson
    },
    artistName: {
        fontSize: 18,
        color: 'gray',
        textAlign: 'center', // Centrer le texte
        marginBottom: 16, // Espace sous le nom de l'artiste
    },
    ratingContainer: {
        marginTop: 16,
        alignItems: 'center', // Centrer le contenu horizontalement
    },
    ratingText: {
        fontSize: 16,
        marginBottom: 8,
    },
});

export default ResultScreen;