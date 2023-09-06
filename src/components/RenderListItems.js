import { ScrollView } from 'react-native';
import { List } from 'react-native-paper';

const RenderListItems = ({ items }) => {
  return (
    <ScrollView>
      {items.map((item, i) => (
        <List.Item
          key={i}
          title={item.title}
          description={item.description}
          onLongPress={item.holdHandler}
          onPress={item.handler}
          descriptionNumberOfLines={4}
        />
      ))}
    </ScrollView>
  );
};

export default RenderListItems;
