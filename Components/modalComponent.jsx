import Modal from 'react-native-modal';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MultiSelectPicker = props => {
  const renderCheckBox = (itemValue, isSelected) => (
    <TouchableOpacity
      key={itemValue.value}
      onPress={() => {
        const selectedValues = props.value || [];
        const updatedValues = isSelected
          ? selectedValues.filter(value => value !== itemValue.value)
          : [...selectedValues, itemValue.value];
        props.handleSelect(updatedValues);
      }}
      style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}}>
      <Icon
        name={isSelected ? 'check-box' : 'check-box-outline-blank'}
        size={24}
        color={isSelected ? 'green' : '#aaa'}
      />
      <Text style={{marginLeft: 10}}>{itemValue.label}</Text>
    </TouchableOpacity>
  );

  const onPressDone = () => {
    props.toggleModal();
  };

  return (
    <View>
      <Modal isVisible={props.showComponent}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            display: 'flex',
            flex: 1,
          }}>
          <ScrollView style={{backgroundColor: 'white', display: 'flex'}}>
            {[
              {label: 'NorthIndian', value: 'NorthIndian'},
              {label: 'SouthIndian', value: 'SouthIndian'},
              {label: 'Chinese', value: 'Chinese'},
              {label: 'Juices', value: 'Juices'},
              {label: 'IceCreams', value: 'IceCreams'},
              {label: 'Bakeries', value: 'Bakeries'},
              {label: 'Chats', value: 'Chats'},
              {label: 'JunkFoods', value: 'JunkFoods'},
              {label: 'Korean', value: 'Korean'},
              {label: 'Japanese', value: 'Japanese'},
              {label: 'Italian', value: 'Italian'},
              {label: 'American', value: 'American'},
              {label: 'Kerala', value: 'Kerala'},
              {label: 'Hydrabadi', value: 'Hydrabadi'},
              {label: 'TamilNadu', value: 'TamilNadu'},
              {label: 'Punjabi', value: 'Punjabi'},
              {label: 'Rajasthani', value: 'Rajasthani'},
              {label: 'Others', value: 'Others'},
            ].map(item =>
              renderCheckBox(item, props.value?.includes(item.value)),
            )}
          </ScrollView>
          <TouchableOpacity
            onPress={onPressDone}
            style={{marginTop: 20, alignSelf: 'flex-end'}}>
            <Text style={{color: 'blue'}}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default MultiSelectPicker;
