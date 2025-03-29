import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons'; // Assurez-vous d'avoir installé @expo/vector-icons
import SearchScreen from './components/SearchScreen';
import ResultScreen from './components/ResultScreen';
import FavoritesScreen from './components/FavoriteScreen';

// Créez un Stack Navigator pour la recherche
const SearchStack = createStackNavigator();
const SearchStackScreen = () => (
    <SearchStack.Navigator>
        <SearchStack.Screen
            name="Search"
            component={SearchScreen}
            options={{ title: 'Recherche' }}
        />
        <SearchStack.Screen
            name="Result"
            component={ResultScreen}
            options={{ title: 'Détails' }}
        />
    </SearchStack.Navigator>
);

// Créez un Stack Navigator pour les favoris
const FavoritesStack = createStackNavigator();
const FavoritesStackScreen = () => (
    <FavoritesStack.Navigator>
        <FavoritesStack.Screen
            name="Favorites"
            component={FavoritesScreen}
            options={{ title: 'Favoris' }}
        />
    </FavoritesStack.Navigator>
);

// Créez un Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'SearchStack') {
                            iconName = focused ? 'search' : 'search';
                        } else if (route.name === 'FavoritesStack') {
                            iconName = focused ? 'favorite' : 'favorite-border';
                        }

                        return <MaterialIcons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: 'tomato',
                    tabBarInactiveTintColor: 'gray',
                })}
            >
                <Tab.Screen
                    name="SearchStack"
                    component={SearchStackScreen}
                    options={{ title: 'Recherche', headerShown: false }}
                />
                <Tab.Screen
                    name="FavoritesStack"
                    component={FavoritesStackScreen}
                    options={{ title: 'Favoris', headerShown: false }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default App;