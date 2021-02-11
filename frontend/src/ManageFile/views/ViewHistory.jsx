import React from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import _ from 'lodash'
import { Row, Col } from 'react-flexbox-grid'
import { toast } from 'react-toastify'
import Select from 'react-select'
import { connect } from 'react-redux'

import MySecondaryNavigation from '../../Dashboard/MySecondaryNavigation'
import {
    Wrapper,
    Loading,
    Module,
    ModuleHeader,
    ModuleBody,
    ModuleFooter,
    Button,
    FormGroup,
    TextInput,
    ReduxFormWrapper,
} from '@wfp/ui'
import { iconCloseOutline } from '@wfp/icons'

import { Form, FormSpy, Field } from 'react-final-form'
import { deptType } from '../../shared/utils'


class Create extends React.Component {
    state = {
        lastSaved: null,
        formData: null,
        showErrors: false,
        loading: false,
        admin: []
    }
    componentDidMount() {
        window.scrollTo(0, 0)
        this.fetchFile();

        const { location } = this.props;
        const {state}= location;

        if(state && state.edit && state.data){
            this.setState({
                formData: {
                    name: state.data.name,
                    type: {
                        value: state.data.type,
                        label: state.data.type
                    }
                }
            })
        };
    }

    fetchFile=  async val => {
        const { id }= this.props;
        this.setState({ loading: true })
        try {
            axios.get(`/v1/file/history/${id}`)
            .then(data=>{ 
                    this.setState({ 
                        file : data.data.data, 
                        history: data.data.data.history, 
                        loading: false 
                })})
        } catch (err) {
            console.log('Error while loading sub department', err)
            this.setState({ loading: false })
        }
    }

    
    render() {
        const { showErrors } = this.state;
        const { formData, loading, admin } = this.state;
        const { location, userId } = this.props;
        const {state}= location;
        return (
            <>
                <MySecondaryNavigation
                    l1Label="Manage file"
                    l1Link="/file"
                    l2Label={'File History' }
                    l2Link="#"
                    pageTitle={"Traquer" }
                />
                {loading ? (
                    <Loading active={true} withOverlay={true} />
                ) : (
                    <div
                        className="wfp--module__background"
                        style={{ minHeight: '400px' }}
                    >
                        <Wrapper
                            pageWidth="lg"
                            spacing="md"
                            mobilePageWidth="full"
                        >
                            <Module noMargin>
                                <ModuleHeader>
                                    <span style={{ fontSize: 20 }}>
                                       File History
                                    </span>
                                </ModuleHeader>
                                <ModuleBody>
                                    
                                </ModuleBody>
                                <ModuleFooter>
                                    <div></div>
                                    <div
                                        style={{
                                            width: '100%',
                                            textAlign: 'right',
                                            margin: '1.5rem 0',
                                        }}
                                    >
                                        <Button
                                            kind="secondary"
                                            onClick={() =>
                                                this.props.history.goBack()
                                            }
                                        >
                                            Go back
                                        </Button>

                                    </div>
                                </ModuleFooter>
                            </Module>
                              
                        </Wrapper>
                    </div>
                )}
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userId: state.user._id,
    }
}

export default connect(mapStateToProps, null)(Create)

const FieldWrapper = styled.div`
    margin-bottom: 30px;
`
