import { combineReducers } from 'redux'
import user from './user'

import { CLEAR_STORE } from '../actions/actionTypes'

const appReducer = combineReducers({
    user,
})

const rootReducer = (state, action) => {
    // when users log out, clear reset store to its initial state
    if (action.type === CLEAR_STORE) {
        state = undefined
    }
    return appReducer(state, action)
}

export default rootReducer
