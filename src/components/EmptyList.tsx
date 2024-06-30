import { List, ListItem, ListItemText } from '@mui/material';
import '/src/styles/list/list.scss';
import './EmptyList.scss';

function EmptyList() {
  return (
    <List className="list empty-list">
      <ListItem key="empty" className="empty">
        <ListItemText primary="The list is empty!" />
      </ListItem>
    </List>
  );
}

export default EmptyList;
