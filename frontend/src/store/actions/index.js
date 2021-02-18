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


export const checkLoginStatus = (data) => {
    return (dispatch) => {
        if (data && data._id) {
            return axios.get(`/v1/user/${data._id}`).then((res) => {
                const  is_login =  res.data ? true : false;
                
                if (is_login) {
                    return dispatch(setUserData(res.data))
                }
                else return dispatch(clearStore())
            })
        }
        else return dispatch(clearStore())
    }
}

export const getUserData = (data) => {
    return (dispatch) => {
        if (data.userId) {
            axios.get(`/v1/user/${data.userId}`).then((res) => {
                dispatch(setUserData(res.data))
            })
        }
        
    }
}

export const logout = () => {
    return async (dispatch) => 
        dispatch(clearStore())
}
