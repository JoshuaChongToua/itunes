import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import { getFavorites, clearFavorites, updateRating } from './LocalStorage'; // Importer updateRating
import StarRating from './StarRating'; // Importer le composant StarRating

const FavoritesScreen = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const loadFavorites = async () => {
            const data = await getFavorites();
            setFavorites(data);
        };
        loadFavorites();
    }, []);

    const handleClearFavorites = async () => {
        await clearFavorites();
        setFavorites([]);
        console.log('Favorites cleared');
    };

    // Fonction pour mettre à jour la note d'un favori
    const handleRatingChange = async (trackId, newRating) => {
        try {
            // Mettre à jour la note dans le stockage local
            await updateRating(trackId, newRating);

            // Mettre à jour l'état local pour refléter le changement
            const updatedFavorites = favorites.map((item) =>
                item.trackId === trackId ? { ...item, rating: newRating } : item
            );
            setFavorites(updatedFavorites);

            console.log('Rating updated successfully');
        } catch (error) {
            console.error('Error updating rating:', error);
        }
    };

    // Rendu personnalisé pour chaque élément de la liste
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.itemContainer}>
            {/* Icône à gauche */}
            <Image
                source={{ uri: item.artworkUrl100 }} // URL de l'image de l'album/single
                style={styles.artwork}
            />
            {/* Texte à droite */}
            <View style={styles.textContainer}>
                <Text style={styles.trackName}>{item.trackName}</Text>
                <Text style={styles.artistName}>{item.artistName}</Text>
                {/* Afficher les étoiles pour la note */}
                <StarRating
                    rating={item.rating} // Passer la note comme prop
                    onRatingChange={(newRating) => handleRatingChange(item.trackId, newRating)} // Passer la fonction de mise à jour
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Button title="Clear Favorites" onPress={handleClearFavorites} />
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.trackId.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    itemContainer: {
        flexDirection: 'row', // Aligner l'icône et le texte horizontalement
        alignItems: 'center', // Centrer verticalement
        marginBottom: 16,
    },
    artwork: {
        width: 50, // Taille de l'icône
        height: 50,
        borderRadius: 8, // Coins arrondis
        marginRight: 16, // Espace entre l'icône et le texte
    },
    textContainer: {
        flex: 1, // Prendre tout l'espace disponible à droite
    },
    trackName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    artistName: {
        fontSize: 14,
        color: 'gray',
    },
});

export default FavoritesScreen;