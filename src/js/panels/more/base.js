import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import Icon56InfoOutline from '@vkontakte/icons/dist/56/info_outline';
import {setPage, setStory} from "../../store/router/actions";

import {List, Panel, Group, Button, PanelHeader, PanelSpinner, Cell, Link, ScreenSpinner, Placeholder} from "@vkontakte/vkui";
class MorePanelBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: null,
      groups:  null,
      loading: true,
    };
  }

  componentDidMount() {
    this.setState({ 'category' : this.props.content})
    const data = new FormData();
    data.append("type", "get_user_groups");
    data.append("user_id", this.props.user.id);
    axios.post("https://app9.vk-irs.ru/api/index.php", data)
        .then(data => this.setState({groups : data.data, loading: false}))
        .catch(function (error) {
            console.log(error);
    })      
  }

  render() {
    const {id, setPage, setStory} = this.props;
    if(!this.props.user){
        return(
            <ScreenSpinner />
        );
    }
    return (
      <Panel id={id}>
              <PanelHeader>Мои уроки и мастер-классы</PanelHeader>
              {this.state.loading && <PanelSpinner/>}
              {this.state.groups ?
                  (<List>
                      {Object.values(this.state.groups).map(course => 
                          <Link key={course.id} onClick={() => {setPage('more', 'mycourse', course)}}>
                              <Group header={false} description={course.caption}>
                        <Cell indicator="Новинка">
                          {course.group}
                        </Cell>
                      </Group>
                  </Link>
                      )}
                  </List>) : <Placeholder
                                  icon={<Icon56InfoOutline />}
                                  header="Уроков пока нет :("
                                  action={<Button size="l"
                                  onClick={()=>{setStory('home', 'base')}}>Добавить</Button>}>
                                    Добавляйте уроки в избранное, которые Вас заинтересовали
                              </Placeholder>
              }
      </Panel>
    );
  }

}


const mapDispatchToProps = {
    setStory,
    setPage
};


const mapStateToProps = (state) => {
        return {
                user: state.vkui.user,
                content: state.router.content,
        };
};

export default connect(mapStateToProps, mapDispatchToProps)(MorePanelBase);