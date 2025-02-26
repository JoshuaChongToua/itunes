import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StarRating = ({ rating = 0, onRatingChange }) => {
    const [selectedRating, setSelectedRating] = useState(rating);

    // Mettre à jour selectedRating lorsque rating change
    useEffect(() => {
        setSelectedRating(rating);
    }, [rating]);

    const handleRating = (newRating) => {
        setSelectedRating(newRating);
        if (onRatingChange) {
            onRatingChange(newRating);
        }
    };

    return (
        <View style={styles.container}>
            {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                    <Icon
                        name={star <= selectedRating ? 'star' : 'star-border'}
                        size={30}
                        color={star <= selectedRating ? 'gold' : 'gray'}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
});

export default StarRating;