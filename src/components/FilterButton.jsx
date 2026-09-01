import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const GAP = 6;

/**
 * Works uncontrolled (own state) or controlled by passing selectedId+onSelect,
 * so a screen can drive the filter without duplicating the selection state.
 */
const FilterButton = ({ items, selectedId: controlledId, onSelect }) => {
  const [internalId, setInternalId] = useState(null);
  const isControlled = controlledId !== undefined;
  const selectedId = isControlled ? controlledId : internalId;

  const selectFilter = (id) => {
    const next = selectedId === id && !isControlled ? null : id;
    if (!isControlled) {
      setInternalId(next);
    }
    onSelect?.(next);
  };

  const colors = {
    background: 'transparent', 
    border: '#777',      
    text: '#888',       
    gold: '#D4A84A',                
  };

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isActive = selectedId === item.id;

        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.66}
            onPress={() => selectFilter(item.id)}
            style={[
              styles.button,
              {
                backgroundColor: isActive ? colors.gold : colors.background,
                borderColor: isActive ? colors.gold : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                { color: isActive ? '#000' : colors.text },
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 15,
    gap: GAP,
  },
  button: {
    flexGrow: 1,
    flexBasis: 0,
    minWidth: 88,
    height: 33,
    paddingHorizontal: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default FilterButton;
