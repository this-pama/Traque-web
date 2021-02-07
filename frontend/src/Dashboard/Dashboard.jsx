import React from 'react'
import styled from 'styled-components'
import MySecondaryNavigation from './MySecondaryNavigation'
import { Wrapper, Tabs, Tab, MainNavigationItem } from '@wfp/ui'

import MinistryTable from './views/MinistryTable'
import AdminTable from './views/AdminTable'

import { Redirect, Route, Switch } from 'react-router'
import { Link } from 'react-router-dom'
import ReactDOM from 'react-dom'
import Header from '../shared/Header'
import MiddleHeader from '../shared/MiddleHeader'
import Footer from '../shared/Footer'

const listElReactRouter = ({
    index,
    selected,
    label,
    to,
    exact,
    handleTabClick,
}) => (
    <Route
        path={to}
        exact={exact}
        children={({ match }) => {
            if (match && !selected) {
                /* handle the Tab changes */
                handleTabClick(index, label)
            }
            return (
                <div
                    className={
                        match
                            ? 'wfp--tabs__nav-item wfp--tabs__nav-item--selected'
                            : 'wfp--tabs__nav-item'
                    }
                >
                    <Link className="wfp--tabs__nav-link" to={to}>
                        {label}
                    </Link>
                </div>
            )
        }}
    />
)
const Dashboard = ({ user }) => {
    const views = [
        {
            permissions: true,
            label: 'Ministry',
            path: '/ministry/list',
            component: () => <MinistryTable />,
        },
        {
            permissions: true,
            label: 'Admins',
            path: '/ministry/admin',
            component: () => <AdminTable />,
        },
    ]
    const allowedViews = views.filter((view) =>  view.permissions )

    return (
        <div>
            <Header />
            <MySecondaryNavigation
                l1Label=" "
                l1Link=" "
                pageTitle={`Traquer`}
                tabs={
                    <Tabs customTabContent={true}>
                        {allowedViews.map((view, i) => (
                            <Tab
                                key={i}
                                label={view.label}
                                to={view.path}
                                renderListElement={listElReactRouter}
                            ></Tab>
                        ))}
                    </Tabs>
                }
            ></MySecondaryNavigation>
            <div
                // className="wfp--module__background"
                style={{ minHeight: '400px' }}
            >
                <Wrapper pageWidth="lg" spacing="md">
                    <InnerWrapper>
                        <div id="export-button-portal" />
                        <Switch>
                            {allowedViews.map((view, i) => (
                                <Route
                                    key={i}
                                    path={view.path}
                                    render={view.component}
                                />
                            ))}

                            {/* <Redirect
                                to={'/login'}
                            /> */}
                        </Switch>
                    </InnerWrapper>
                </Wrapper>
            </div>
            <Footer />
        </div>
    )
}

export default Dashboard

const InnerWrapper = styled.div`
    position: relative;
    #export-button-portal {
        position: absolute;
        right: 0;
        top: -95px;
    }
`
