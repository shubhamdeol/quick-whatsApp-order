
import React, { useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Text } from '../common';
import { theme } from '../theme';
import { SCREEN_WIDTH } from '../constants/layout';
import { v1 as uuidv1 } from 'uuid';

interface IItem {
    id: string,
    name: string;
    quantity: number;
}


export default function CreateList() {

    const [items, setItems] = useState<IItem[]>([{
        id: uuidv1(),
        name: 'Item One',
        quantity: 1
    }]);

    return (
        <View style={styles.container}>
            <Text style={styles.createOrderText}>Create Order</Text>
            <Text style={styles.createListText}>Make list of items you need</Text>
            <FlatList
                data={items}
                renderItem={({ item }) => <Text>{item.name}</Text>}
                
            />
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: SCREEN_WIDTH * 0.02
    },
    createOrderText: {
        color: theme.colors.black_primary,
        textAlign: 'center',
        fontSize: theme.fontSize.xlarge,
        marginVertical: theme.space.medium
    },
    createListText: {
        color: theme.colors.black_primary,
        fontWeight: '500'
    }
});
