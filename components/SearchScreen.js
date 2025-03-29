import React, { useState } from 'react';
import {View, TextInput, FlatList, StyleSheet, Image, Text, TouchableOpacity, Button} from 'react-native';
import searchITunes from './ItunesApi';

const SearchScreen = ({ navigation }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        const data = await searchITunes(query);
        setResults(data);
    };

    // Rendu personnalisé pour chaque élément de la liste
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('Result', { item })}
        >
            <Image
                source={{ uri: item.artworkUrl100 }}
                style={styles.artwork}
            />
            <View style={styles.textContainer}>
                <Text style={styles.trackName}>{item.trackName}</Text>
                <Text style={styles.artistName}>{item.artistName}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Rechercher un artiste ou une chanson..."
                value={query}
                onChangeText={setQuery}
            />
            <Button title="Rechercher" onPress={handleSearch} />
            <FlatList
                data={results}
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
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
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

export default SearchScreen;