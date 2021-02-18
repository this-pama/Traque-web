import React from 'react'
import styled from 'styled-components'
import {
    User,
    SubNavigation,
    MainNavigation,
    MainNavigationItem,
    SubNavigationHeader,
    SubNavigationTitle,
    SubNavigationLink,
    Icon,
    Button,
    Modal,
    Search,
    Loading,
    InlineLoading,
    List , ListItem
} from '@wfp/ui'
import {iconHeaderSearch} from '@wfp/icons'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { logout } from '../store/actions'
import { Link as DomLink } from 'react-router-dom'
import PropTypes from "prop-types";
import _ from 'lodash'
import axios from 'axios'
import Can from '../shared/Can'

const CustomWrapper = styled.div`
    .wfp--wrapper.wfp--wrapper--width-md.wfp--wrapper--width-mobile-full.wfp--main-navigation__wrapper {
        max-width: 1200px;
    }
`
const Wrapper = styled.div`
    .wfp--main-navigation{
        background-color: #1841BA;
    }
`
class MainNav extends React.Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
      };
    
      constructor(props) {
        super(props);
        this.child = React.createRef();

        this.state = {
            startSearch: false,
            loading: false,
            searching: false,
            searchResult: [],
        }
      }

      componentDidUpdate(prevProps, prevState) {
        if (prevProps.location != this.props.locaction) {
          this.closeMenu();
        }
      }

      closeMenu = () => {
        this.child.current && this.child.current.props.onChangeSub('close');
      };

      loadOptions = _.debounce(
        async (input) => {
            if(input == undefined) return  this.setState({ searching : false, searchResult: [] })
            
            if(input.length <= 2) return  this.setState({ searching : false, searchResult: [] })

            this.setState({ searching : true, searchResult: [] })
            axios.post(`/v1/file/search`, { name: input }).then((res) => 
                this.setState({ searchResult: res.data, searching: false })
            )
            .catch(()=> this.setState({ searching : false, searchResult: [] }))
        },
            500,
            { leading: true, trailing: true }
        );

    render() {
        const { logout, user, location, showSbpMenu } = this.props;
        const { loading, startSearch, searchResult, searching } = this.state;

        const permissions = user && user.userRole ? user.userRole.permission : [];
        const userRole = user && user.userRole ? user.userRole.name : null;

        if (!user) return null
        return (
            <>
                {location.pathname === '/login' ? null : (
                    <Wrapper>
                    <CustomWrapper>
                        <MainNavigation
                            logo={
                                <a href="/">
                                    {' '}
                                    Traquer
                                </a>
                            }
                        >
                            <Can
                                rules={permissions}
                                userRole={userRole}
                                perform={'canSearchFile'}
                                yes={() => (
                                    <div style={{ paddingRight: 80}}>
                                        <MainNavigationItem>
                                            <Icon
                                                icon={iconHeaderSearch}
                                                fill={'#fff'}
                                                width={25}
                                                height={25}
                                                description="Search file using file name or number"
                                                onClick={()=> this.setState({ startSearch: true })}
                                            />
                                        </MainNavigationItem>
                                    </div>
                                )}
                            />

                            <MainNavigationItem
                                className="wfp--main-navigation__user"
                                subNavigation={
                                    <SubNavigation>
                                        <SubNavigationHeader>
                                            <SubNavigationTitle>
                                                Welcome {user.firstName}!
                                            </SubNavigationTitle>
                                            <SubNavigationLink>
                                                <Button
                                                    kind="primary"
                                                    small
                                                    onClick={() => logout()}
                                                >
                                                    Logout
                                                </Button>
                                            </SubNavigationLink>
                                        </SubNavigationHeader>
                                    </SubNavigation>
                                }
                            >
                                <User
                                    ellipsis
                                    title=""
                                />
                            </MainNavigationItem>
                        </MainNavigation>
                    </CustomWrapper>

                    
                    <Modal
                        open={startSearch}
                        primaryButtonText="Close"
                        // secondaryButtonText="Cancel"
                        onRequestSubmit={()=>this.setState({ startSearch: false })}
                        onRequestClose={()=>this.setState({ startSearch: false })}
                        modalLabel="Search file by name or number"
                        wide={true}
                        type='info'
                    >
                        {searching && <InlineLoading description="searching..." />}
                            
                        <Search
                            className="some-class"
                            kind="large"
                            name="input-name"
                            labelText="Saerch"
                            closeButtonLabelText="Close"
                            placeHolderText="Search file by name or number"
                            onChange={(e, p) => this.loadOptions( p && p.target.value)}
                        />

                        <br/>
                            {searchResult.length <= 0 && searching== false &&
                                <p style={{ textAlign: 'center' }}>
                                    No file found
                                </p>
                            }
                        
                        <List
                            kind="details"
                            style={{
                            columnCount: 2
                            }}
                        >
                            {searchResult.map((p, i) =>(
                                <div style={{ 
                                    backgroundColor : `${i%2 == 0 ? '#f2f2f2' : '#e6e6e6'}`, 
                                    borderRadius: 10, 
                                    paddingLeft: 20,
                                    paddingTop: 2,
                                    cursor: 'pointer',
                                    textDecoration: 'none'
                                    // paddingBottom: 2,
                                }}
                                onClick={()=> this.setState({ startSearch: false, searchResult: [] })}
                                >
                                    
                                    <DomLink to={`/history/file/${p._id}`}>
                                        <ListItem >
                                            <div className='wfp--label'>{p.name}</div>
                                            <div className='wfp--form__helper-text'> {p.fileNo} </div>
                                            <div className='wfp--form__helper-text'> {p.type} </div>
                                        </ListItem>
                                    </DomLink>
                                </div>
                            ))}
                        </List>
                        


                    </Modal>

                    </Wrapper>
                )}
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logout()),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainNav))
