import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {goBack, setStory} from "./js/store/router/actions";
import {getActivePanel} from "./js/services/_functions";
import * as VK from './js/services/VK';
import axios from 'axios';
import {Epic, View, Root, Tabbar, TabbarItem, ConfigProvider, ScreenSpinner} from "@vkontakte/vkui";
import Icon28ListOutline from '@vkontakte/icons/dist/28/list_outline';
import Icon28Profile from '@vkontakte/icons/dist/28/profile';
import VKConnect from "@vkontakte/vk-bridge";
import HomePanelBase from './js/panels/home/base';
import HomePanelCategory from './js/panels/home/category';
import HomePanelCourse from './js/panels/home/course';
import MorePanelBase from './js/panels/more/base';
import MorePanelCourse from './js/panels/more/course';



class App extends React.Component {
    constructor(props) {
        super(props);
        this.lastAndroidBackAction = 0;
        this.state = {
            hasGroup : null,
            once: true

        }
    }

    componentDidMount() {
        const {goBack, dispatch} = this.props;

        dispatch(VK.initApp());
        dispatch(VK.getUser());        
        window.onpopstate = () => {
            let timeNow = +new Date();

            if (timeNow - this.lastAndroidBackAction > 500) {
                this.lastAndroidBackAction = timeNow;

                goBack(this.props.content);
            } else {
                window.history.pushState(null, null);
            }
        };

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {activeView, activeStory, activePanel, scrollPosition} = this.props;

        if (
            prevProps.activeView !== activeView ||
            prevProps.activePanel !== activePanel ||
            prevProps.activeStory !== activeStory
        ) {
            let pageScrollPosition = scrollPosition[activeStory + "_" + activeView + "_" + activePanel] || 0;

            window.scroll(0, pageScrollPosition);
        }

        
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.user) {
            const data = new FormData();
            data.append("type", "add_user");
            data.append("user_id", nextProps.user.id);
            axios.post("https://app9.vk-irs.ru/api/index.php", data)
                .then(data => {this.setState({hasGroup : data.data});this.timer()})
                .catch(function (error) {
                    console.log(error)});
        }
    }

   timer () {
      if(this.state.once) {
        setTimeout(() => VKConnect.send("VKWebAppAllowMessagesFromGroup", {"group_id": 193586337}), 60000)
        this.setState({once : false})
      }

    }
      
    componentWillUnmount() {
      clearTimeout(this.timer);
    }

    


    render() {
        const {goBack, setStory, activeView, activeStory, panelsHistory, colorScheme, content} = this.props;
        let history = (panelsHistory[activeView] === undefined) ? [activeView] : panelsHistory[activeView];


        if(this.props.user==null){
            return(
                <ScreenSpinner />
            );
        }
        
        return (
            <ConfigProvider isWebView={true} scheme={colorScheme}>
                <Epic activeStory={activeStory} tabbar={
                    <Tabbar>
                        <TabbarItem
                            onClick={() => setStory('home', 'base')}
                            selected={activeStory === 'home'}
                        ><Icon28ListOutline/></TabbarItem>
                        <TabbarItem
                            onClick={() => setStory('more', 'mybase')}
                            selected={activeStory === 'more'}
                        ><Icon28Profile/></TabbarItem>
                    </Tabbar>
                }>
                    <Root id="home" activeView={activeView}>
                        <View
                            id="home"
                            activePanel={getActivePanel("home")}
                            history={history}
                            onSwipeBack={() => goBack(content)}
                        >
                            <HomePanelBase id="base" withoutEpic={false}/>
                            <HomePanelCategory id="category" withoutEpic={false}/>
                            <HomePanelCourse id="course" withoutEpic={false}/>
                        </View>
                    </Root>
                    <Root id="more" activeView={activeView}>
                        <View
                            id="more"
                            activePanel={getActivePanel("more")}
                            history={history}
                            onSwipeBack={() => goBack(content)}
                        >
                            <MorePanelBase id="mybase" withoutEpic={false}/>
                            <MorePanelCourse id="mycourse" withoutEpic={false}/>
                        </View>
                    </Root>

                </Epic>
            </ConfigProvider>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        activeView: state.router.activeView,
        content: state.router.content,
        activeStory: state.router.activeStory,
        panelsHistory: state.router.panelsHistory,
        activeModals: state.router.activeModals,
        popouts: state.router.popouts,
        scrollPosition: state.router.scrollPosition,
        user: state.vkui.user,
        colorScheme: state.vkui.colorScheme,
    };
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setStory, goBack }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);


                 