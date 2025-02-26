import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorites';

// Sauvegarder un résultat dans les favoris
const saveFavorite = async (item) => {
    try {
        const favorites = await getFavorites();
        const existingItem = favorites.find((fav) => fav.trackId === item.trackId);

        if (!existingItem) {
            // Ajouter une propriété `rating` avec une valeur par défaut
            const newItem = { ...item, rating: 0 };
            favorites.push(newItem);
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
            console.log('New favorite added:', newItem); // Vérifier l'élément ajouté
        }
    } catch (error) {
        console.error('Error saving favorite:', error);
    }
};
// Récupérer la liste des favoris
const getFavorites = async () => {
    try {
        const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error('Error getting favorites:', error);
        return [];
    }
};

// Mettre à jour le rating d'un favori
const updateRating = async (trackId, rating, item) => {
    try {
        console.log('Updating rating for trackId:', trackId); // Vérifier le trackId
        const favorites = await getFavorites();
        console.log('Favorites before update:', favorites); // Vérifier les favoris avant la mise à jour

        // Vérifier si l'élément existe déjà dans les favoris
        const existingItem = favorites.find((fav) => fav.trackId === trackId);

        let updatedFavorites;
        if (existingItem) {
            // Si l'élément existe, mettre à jour son rating
            updatedFavorites = favorites.map((fav) =>
                fav.trackId === trackId ? { ...fav, rating } : fav
            );
        } else {
            // Si l'élément n'existe pas, l'ajouter aux favoris avec le rating
            updatedFavorites = [...favorites, { ...item, rating }];
        }

        console.log('Favorites after update:', updatedFavorites); // Vérifier les favoris après la mise à jour
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
        console.log('Rating updated successfully'); // Confirmer la mise à jour
    } catch (error) {
        console.error('Error updating rating:', error);
    }
};

const clearFavorites = async () => {
    try {
        await AsyncStorage.removeItem(FAVORITES_KEY); // Supprimer la clé FAVORITES_KEY
        console.log('Favorites cleared successfully'); // Confirmer que les favoris sont vidés
    } catch (error) {
        console.error('Error clearing favorites:', error);
    }
};

// Exporter la fonction
export { saveFavorite, getFavorites, updateRating, clearFavorites };

// Exporter les fonctions
