import axios from 'axios'
import {
    SET_USER_DATA,
    CLEAR_STORE,
} from './actionTypes'


const setUserData = (user) => ({
    type: SET_USER_DATA,
    payload: user,
})


export const clearStore = () => ({ type: CLEAR_STORE })


export const checkLoginStatus = () => {
    return (dispatch) => {
        return axios.get('/api/is-login').then((res) => {
            const { is_login } = res.data
            if (is_login) {
                dispatch(getUserData())
            }
        })
    }
}

export const getUserData = () => {
    return (dispatch) => {
        axios.get('/api/profile').then((res) => {
            dispatch(setUserData(res.data.data))
        })
    }
}

export const logout = () => {
    return async (dispatch) => {
        try {
            await axios.get('/api/logout')
        } catch (err) {}
        dispatch(clearStore())
    }
}
