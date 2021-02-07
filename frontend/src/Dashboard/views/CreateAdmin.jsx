import React from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import _ from 'lodash'
import { Row, Col } from 'react-flexbox-grid'

import MySecondaryNavigation from '../MySecondaryNavigation'
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


class RostersScreeningForm extends React.Component {
    state = {
        lastSaved: null,
        formData: null,
        showErrors: false,
        loading: false,
    }
    componentDidMount() {
        window.scrollTo(0, 0)
    }
    
    onSubmit = async (values) => {
        const formData={}
        try {
            await axios.put(`/api/screening/${formData.id}/finish`, formData)
            this.props.history.goBack()
        } catch (err) {
            console.log('Error in ScreeningForm onSubmit method', err)
            this.setState({ showErrors: true })
        }
    }

    
    render() {
        const { showErrors } = this.state
        const { formData, loading } = this.state
        const { id } = this.props.match.params;
        
        return (
            <>
                <MySecondaryNavigation
                    l1Label="Admin"
                    l1Link="/ministry/admin"
                    l2Label="Create ministry administrator"
                    l2Link="#"
                    pageTitle={'Create Administrator'}
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

                            <Form
                                onSubmit={this.onSubmit}
                                initialValues={formData}
                                validate={(values) => {
                                    const errors = {}
                                    const {
                                        ministry,
                                    } = values

                                    if (!ministry) {
                                        errors.ministry = {
                                            value:
                                                'Ministry name is required',
                                            show: showErrors,
                                        }
                                    } 
                                    return errors
                                }}
                                render={({ values, onSave, valid, reset }) => (
                                    <form>
                                        <Module noMargin>
                                            <ModuleHeader>
                                                <span style={{ fontSize: 20 }}>
                                                    Create administrator
                                                </span>
                                            </ModuleHeader>
                                            <ModuleBody>
                                                <Row>
                                                <Col 
                                                    md={6}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <FieldWrapper>
                                                        <Field
                                                            component={
                                                                ReduxFormWrapper
                                                            }
                                                            inputComponent={
                                                                TextInput
                                                            }
                                                            id="firstName"
                                                            name="firstName"
                                                            type="text"
                                                            labelText="First name"
                                                        />
                                                    </FieldWrapper>
                                                </Col>

                                                <Col 
                                                    md={5}
                                                    sm={5}
                                                    xs={12}
                                                >
                                                    <FieldWrapper>
                                                        <Field
                                                            component={
                                                                ReduxFormWrapper
                                                            }
                                                            inputComponent={
                                                                TextInput
                                                            }
                                                            id="lastName"
                                                            name="lastName"
                                                            type="text"
                                                            labelText="Last name"
                                                        />
                                                    </FieldWrapper>
                                                </Col>
                                                </Row>

                                                <Col 
                                                    md={6}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                <FieldWrapper>
                                                    <Field
                                                        component={
                                                            ReduxFormWrapper
                                                        }
                                                        inputComponent={
                                                            TextInput
                                                        }
                                                        id="email"
                                                        name="email"
                                                        type="text"
                                                        labelText="Email"
                                                    />
                                                </FieldWrapper>
                                            </Col>

                                            <Col 
                                                md={6}
                                                sm={6}
                                                xs={12}
                                            >
                                                <FieldWrapper>
                                                    <Field
                                                        component={
                                                            ReduxFormWrapper
                                                        }
                                                        inputComponent={
                                                            TextInput
                                                        }
                                                        id="telephone"
                                                        name="telephone"
                                                        type="text"
                                                        labelText="Telephone"
                                                    />
                                                </FieldWrapper>
                                            </Col>

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

                                                    <Button
                                                        // disabled={!valid}
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            this.onSubmit(
                                                                values
                                                            )
                                                        }}
                                                    >
                                                        Create
                                                    </Button>
                                                </div>
                                            </ModuleFooter>
                                        </Module>
                                        {showErrors && (
                                            <div
                                                style={{
                                                    padding: '5px',
                                                    width: '100%',
                                                    background: '#C5192D',
                                                    color: 'white',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                Please fill in all required
                                                fields
                                            </div>
                                        )}
                                    </form>
                                )}
                            />
                        </Wrapper>
                    </div>
                )}
            </>
        )
    }
}

export default withRouter(RostersScreeningForm)
const FieldWrapper = styled.div`
    margin-bottom: 30px;
`
