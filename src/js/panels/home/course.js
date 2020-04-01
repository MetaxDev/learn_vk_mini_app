import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import axios from 'axios';
import {goBack} from "../../store/router/actions";

import {Div, List, Panel, Group, Button, PanelHeader, PanelSpinner, PanelHeaderBack, ScreenSpinner, Gradient, CardGrid, Card, Separator} from "@vkontakte/vkui";


class HomePanelGroups extends React.Component {

  state = {
      course: null,
      hasCourse: null,
      loading: true,
  };

  componentDidMount() {
      this.getGroup();
      this.checkGroup();
  }


  getGroup() {
    const data = new FormData();
    data.append("type", "get_group");
    data.append("group_id", this.props.content.id);
    axios.post("https://app9.vk-irs.ru/api/index.php", data)
        .then(data => {this.setState({course : data.data, loading: false})})
        .catch(function (error) {
            console.log(error);
    })   
  }

  checkGroup() {
    const check = new FormData();
    check.append("type", "check_group");
    check.append("group_id", this.props.content.id);
    check.append("user_id", this.props.user.id);
    axios.post("https://app9.vk-irs.ru/api/index.php", check)
        .then(data => {this.setState({ hasCourse: data.data })})
        .catch(function (error) {
            console.log(error);
    })   
  }

  addFavorite() {
    const data = new FormData();
    data.append("type", "add_favorite");
    data.append("group_id", this.props.content.id);
    data.append("user_id", this.props.user.id);
    axios.post("https://app9.vk-irs.ru/api/index.php", data)
        .then(data => {this.checkGroup()})
        .catch(function (error) {
            console.log(error);
    })     
  }

  render() {
      const {id, goBack} = this.props;

      if(!this.props.user){
          return(
              <ScreenSpinner />
          );
      }
      return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={() => goBack(this.props.content)}/>}
            >
              {this.props.content.group}
              </PanelHeader>
            {this.state.loading && <PanelSpinner/>}

            {this.state.course &&
              <Div>
                <Button mode='primary' size='xl' stretched={false}  onClick={() => {this.addFavorite(this.state.course)}}>{this.state.hasCourse ? 'Убрать из избранного' : 'В избранное'}</Button>
                <Separator style={{ margin: '12px 0' }} />
                  <List>
                      {Object.values(this.state.course).map(lesson => 
                        <CardGrid>
                          <Card size="xl" mode="shadow" style={{ width: '100%' }}>
                            <Gradient>
                              <div style={{ padding: '5px 10px' }} >
                                <Group header={false} description={lesson.description}>
                                  <h2>{lesson.name}</h2>
                                  <div className="video"><iframe title="yt-video" src={`https://www.youtube.com/embed/${lesson.youtube}`} frameborder="0" allow="accelerometer; autoplay; fullscreen; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                                </Group>
                              </div>
                            </Gradient>
                          </Card>
                        </CardGrid>
                  
                      )}
                      
                  </List>
              </Div>
            }
           
        </Panel>
      );
  }

}

function mapDispatchToProps(dispatch, state) {
    return {
        dispatch,
        ...bindActionCreators({goBack}, dispatch)
    }
}

const mapStateToProps = (state) => {
    return {
        content: state.router.content,
        user: state.vkui.user
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePanelGroups);

