import React from 'react'
import {
    SecondaryNavigation,
    SecondaryNavigationTitle,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbHome,
} from '@wfp/ui'
import { Link as RouteLink } from 'react-router-dom'

const MyBannerNavigation = (props) => {
    return (
        <SecondaryNavigation pageWidth="lg" additional={props.additional}>
            {props.l1Label && (
                <Breadcrumb>
                    <BreadcrumbItem>
                        <RouteLink to={'/'} className="wfp--link">
                            <BreadcrumbHome />
                        </RouteLink>
                    </BreadcrumbItem>
                    {props.l1Label && (
                        <BreadcrumbItem>
                            <RouteLink to={props.l1Link}>
                                {props.l1Label}
                            </RouteLink>
                        </BreadcrumbItem>
                    )}

                    {props.l2Label && (
                        <BreadcrumbItem>
                            <RouteLink to={props.l2Link}>
                                {props.l2Label}
                            </RouteLink>
                        </BreadcrumbItem>
                    )}

                    {props.l3Label && (
                        <BreadcrumbItem>
                            <RouteLink to={props.l3Link}>
                                {props.l3Label}
                            </RouteLink>
                        </BreadcrumbItem>
                    )}

                    {props.l4Label && (
                        <BreadcrumbItem>
                            <RouteLink to={props.l4Link}>
                                {props.l4Label}
                            </RouteLink>
                        </BreadcrumbItem>
                    )}
                </Breadcrumb>
            )}
            {props.pageTitle ? (
                <SecondaryNavigationTitle>
                    {props.pageTitle}
                </SecondaryNavigationTitle>
            ) : null}
            {props.tabs ? props.tabs : null}
        </SecondaryNavigation>
    )
}

export default MyBannerNavigation
