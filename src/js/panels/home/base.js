import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {goBack, setPage, setStory} from '../../store/router/actions';

import {Div, Panel, Group, Button, PanelHeader, Search, List, Cell, Separator, Header, Link} from '@vkontakte/vkui'

const thematics = [
  {category_id: 1, category_name: 'Иностранные языки'},
  {category_id: 2, category_name: 'Информационные технологии'},
  {category_id: 3, category_name: 'Спорт и фитнес'},
  {category_id: 6, category_name: 'Финансы'},
  {category_id: 7, category_name: 'Маркетинг и реклама'},
  {category_id: 8, category_name: 'Логистика'},
  {category_id: 10, category_name: 'Бизнес'},
  {category_id: 13, category_name: 'Красота и здоровье'},
  {category_id: 16, category_name: 'Продажи'},
  {category_id: 19, category_name: 'Наука'},    
];

class HomePanelBase extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      search: ''
    }
    this.onChange = this.onChange.bind(this);
  }


  onChange (e) { this.setState({ search: e.target.value }); }

  get thematics () {
    const search = this.state.search.toLowerCase();
    return thematics.filter(({category_name}) => category_name.toLowerCase().indexOf(search) > -1);
  }

  render() {
      const {id, setPage, setStory} = this.props;

      return (
          <Panel id={id}>
              <PanelHeader>Бесплатные уроки и мастер-классы</PanelHeader>
              <Group>
                  <Div>
                      <Button mode='primary' size='l' stretched={true} onClick={() => setStory('more', 'mybase')}>Мои
                          уроки и мастер-классы</Button>
                  </Div>
                  <Separator style={{ margin: '12px 0' }} />
                  <Header>Выберите категорию</Header>
                  <Search value={this.state.search} onChange={this.onChange} after={null}/>
                            {this.thematics.length > 0 &&
                              <List>
                                {this.thematics.map(thematic => <Cell key={thematic.category_id}>
                                      <Link onClick={() => setPage('home', 'category', thematic)}>{thematic.category_name}</Link>
                                  </Cell>)}
                              </List>
                            }

              </Group>
          </Panel>
      );
  }

}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({setStory, setPage, goBack}, dispatch)
    }
}

export default connect(null, mapDispatchToProps)(HomePanelBase);



