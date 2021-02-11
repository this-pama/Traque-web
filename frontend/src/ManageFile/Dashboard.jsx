import React from 'react'
import styled from 'styled-components'
import MySecondaryNavigation from '../Dashboard/MySecondaryNavigation'
import { Wrapper, Tabs, Tab, MainNavigationItem } from '@wfp/ui'

import DeptTable from './views/IncomingFile'
import OutgoingFile from './views/OutgoingFile'
import StaffTable from './views/StaffTable'
import InProcessFile from './views/PendingFile'
import SentFile from './views/SentFile'
import ArchivedFile from './views/ArchivedFile'

import { Redirect, Route, Switch } from 'react-router'
import { Link } from 'react-router-dom'

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
const Dashboard = (props) => {
    const { user } = props;
    const views = [
        {
            permissions: true,
            default: true,
            label: 'Incoming file',
            path: '/file/incoming',
            component: () => <DeptTable props={props} />,
        },

        {
            permissions: true,
            label: 'Outgoing file',
            path: '/file/outgoing',
            component: () => <OutgoingFile props={props} />,
        },

        {
            permissions: true,
            label: 'In-Process file',
            path: '/file/pending',
            component: () => <InProcessFile props={props} />,
        },

        {
            permissions: true,
            label: 'Sent file',
            path: '/file/sent',
            component: () => <SentFile props={props} />,
        },

        {
            permissions: true,
            label: 'Delayed file',
            path: '/department/staff/list',
            component: () => <StaffTable props={props}  />,
        },

        {
            permissions: true,
            label: 'Archived file',
            path: '/file/archived',
            component: () => <ArchivedFile props={props} />,
        },

        {
            permissions: true,
            label: 'Open Registry',
            path: '/department/list',
            component: () => <DeptTable props={props} />,
        },
    ]

    const defaultView = views.find((view) => view.default );
    const allowedViews = views.filter((view) =>  view.permissions );
    
    return (
        <div>
            {/* <Header /> */}
            <MySecondaryNavigation
                l1Label={user.isStaff ? 'Manage File' : "Admin dashboard"}
                l1Link={user.isStaff ? '#' : '/department'}
                l2Label={user.isAdmin ? 'Manage File' : ""}
                l2Link={user.isAdmin ? '#' : ''}
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
                className="wfp--module__background"
                style={{ minHeight: '400px' }}
            >
                <Wrapper pageWidth="lg" spacing="md">
                    <InnerWrapper>
                        {/* <div id="export-button-portal" /> */}
                        <Switch>
                            {allowedViews.map((view, i) => (
                                <Route
                                    key={i}
                                    path={view.path}
                                    render={view.component}
                                />
                            ))}

                            <Redirect
                                to={
                                    defaultView
                                        ? defaultView.path
                                        : '/login'
                                }
                            />
                        </Switch>
                    </InnerWrapper>
                </Wrapper>
            </div>
            {/* <Footer /> */}
        </div>
    )
}

export default Dashboard

const InnerWrapper = styled.div`
    position: relative;
    padding-bottom: 1rem;;
    #export-button-portal {
        position: absolute;
        right: 0;
        top: -95px;
    }
`
