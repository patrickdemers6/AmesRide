import { ScrollView } from 'react-native-gesture-handler';
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
        />
      ))}
    </ScrollView>
  );
};

export default RenderListItems;
