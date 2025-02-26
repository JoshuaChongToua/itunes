import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from './components/SearchScreen';
import ResultScreen from './components/ResultScreen';
import FavoritesScreen from './components/FavoriteScreen';

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Search">
                <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Recherche iTunes' }} />
                <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Détails' }} />
                <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoris' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;