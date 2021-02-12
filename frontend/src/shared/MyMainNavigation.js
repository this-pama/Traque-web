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
    SubNavigationContent,
    List,
    ListItem,
    Link,
    Button
} from '@wfp/ui'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { logout } from '../store/actions'
import { Link as DomLink } from 'react-router-dom'
import PropTypes from "prop-types";

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
      }

      componentDidUpdate(prevProps, prevState) {
        if (prevProps.location != this.props.locaction) {
          this.closeMenu();
        }
      }

      closeMenu = () => {
        this.child.current && this.child.current.props.onChangeSub('close');
      };

    render() {
        const { logout, user, location, showSbpMenu } = this.props;

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
