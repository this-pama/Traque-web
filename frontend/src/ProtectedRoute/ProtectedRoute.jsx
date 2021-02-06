import React from 'react'
import { Route, Redirect } from 'react-router'
const ProtectedRoute = ({ isAllowed, ...props }) => {
    return isAllowed ? <Route {...props} /> : <Redirect to="/login" />
}

export default ProtectedRoute
