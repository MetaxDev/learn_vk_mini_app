import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {goBack, setPage} from "../../store/router/actions";

import {List, Panel, Group, PanelHeader, PanelSpinner, PanelHeaderBack, Cell, Link, ScreenSpinner} from "@vkontakte/vkui";

class HomePanelCategory extends React.Component {
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
		data.append("type", "get_category");
		data.append("category_id", this.props.content.category_id);
		axios.post("https://app9.vk-irs.ru/api/index.php", data)
			.then(data => this.setState({groups : data.data, loading: false}))
			.catch(function (error) {
				console.log(error);
		})		
	}


	track(course) {
		const data = new FormData();
		data.append("type", "track");
		data.append("group_id", course.id);
		data.append("user_id", this.props.user.id);
		axios.post("https://app9.vk-irs.ru/api/index.php", data)
			.catch(function (error) {
				console.log(error);
		})		
	}


	render() {
		
			const {id, goBack, setPage} = this.props;
			
			if(!this.props.user){
			    return(
			        <ScreenSpinner />
			    );
			}
			return (

					<Panel id={id}>

							<PanelHeader
									left={<PanelHeaderBack onClick={() => goBack(this.state.category)}/>}
							>
									{ this.props.content.category_name }
							</PanelHeader>
							{this.state.loading && <PanelSpinner/>}
							{this.state.groups &&
								<List>
									{Object.values(this.state.groups).map(course => 
										<Link key={course.id} onClick={() => {setPage('home', 'course', course); this.track(course)}}>
											<Group header={false} description={course.caption}>
							          <Cell indicator="">
							            {course.group}
							          </Cell>
							        </Group>
						        </Link>
									)}
									
								</List>
							}

					</Panel>
			);
	}

}


const mapDispatchToProps = {
    setPage,
    goBack
};


const mapStateToProps = (state) => {
		return {
				user: state.vkui.user,
				content: state.router.content,
		};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePanelCategory);