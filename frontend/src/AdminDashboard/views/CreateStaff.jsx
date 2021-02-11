import React from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import _ from 'lodash'
import { Row, Col } from 'react-flexbox-grid'
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
import { gradeLevel, gender } from '../../shared/utils'

import { Form, FormSpy, Field } from 'react-final-form'
import { toast } from 'react-toastify'


class Create extends React.Component {
    state = {
        lastSaved: null,
        formData: null,
        showErrors: false,
        loading: false,
        department: [],
    }
    componentDidMount() {
        window.scrollTo(0, 0)
        this.fetchDept()

        const { location } = this.props;
        const {state}= location;

        if(state && state.edit && state.data){
            const { firstName, lastName, email, gender, telephone, gradeLevel, designation,
                department } = state.data;
            
            this.setState({
                formData:{
                    firstName,
                    lastName,
                    email,
                    gender: {label: gender, value: gender},
                    telephone,
                    gradeLevel: {label: gradeLevel, value: gradeLevel},
                    designation,
                    // staffId,
                    department
                }
            })
        };
    }

    fetchDept=  async () => {
        try {
            axios.get(`/v1/department`)
            .then(data=> this.setState({ department : data.data }))
        } catch (err) {
            console.log('Error while loading department', err)
        }
    }

    fetchSubDept=  async val => {
        console.log('fettingggh')
        this.setState({ loading: true })
        try {
            axios.get(`/v1/department/details/${val._id}`)
            .then(data=> this.setState({ subDepartment : data.data.subDeparment, loading: false }))
        } catch (err) {
            console.log('Error while loading sub department', err)
            this.setState({ loading: false })
        }
    }

    
    onSubmit = async (values) => {
        this.setState({ loading: true });

        const { firstName, lastName, email, gender, telephone, gradeLevel, designation,
        department, subDeparment } = values;
        const {user} = this.props;

        const formData={
            firstName,
            lastName,
            email,

            gender: gender && gender.value,
            telephone,
            gradeLevel: gradeLevel &&  gradeLevel.value,
            designation,

            ministry: user && user.ministry,
            department: department && department._id,
            subDeparment: subDeparment && subDeparment._id,
            isAdmin: false,
            isSuper: false,
            isStaff: true,
        };

        const { location } = this.props;
        const {state}= location;

        try {
            if(state && state.edit){
                await axios.put(`/v1/user/update/${state.id}`, formData)
                .then(()=> this.setState({ loading: false }))
                toast('Successfully updated ', {closeOnClick: true, autoClose: 1000 });
                this.props.history.goBack()
            }
            else{
                await axios.post(`/v1/user/add/staff`, formData)
                .then(()=>toast('Successfully created'), {closeOnClick: true, autoClose: 1000 })
                this.setState({ loading: false });
                this.props.history.goBack()
            }
        } catch (err) {
            console.log('Error in ScreeningForm onSubmit method', err)
            toast.error('Oops! something went wrong. Please try again ', {closeOnClick: true, autoClose: 1000 });
            this.setState({ loading: false });
        }
    }

    
    render() {
        const { showErrors } = this.state
        const { formData, loading, department, subDeparment } = this.state
        const { id } = this.props.match.params;
        const { location } = this.props;
        const {state}= location;
        
        return (
            <>
                <MySecondaryNavigation
                    l1Label="Admin dashboard"
                    l1Link="/department"
                    l2Label={  state && state.edit ? "Update staff" : "Create staff"}
                    l2Link="#"
                    pageTitle={  state && state.edit ? "Update staff" : "Create staff"}
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
                                    const errors = {};
                                    const {
                                        department,
                                        firstName,
                                        lastName,
                                        email,
                                        telephone,
                                        gender, 
                                        designation
                                    } = values;
                                    

                                    if (!firstName || !lastName || !email || !telephone || !gender 
                                        || !department || !designation ) {
                                        errors.firstName = {
                                            value:
                                                'Required',
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
                                                    Create Staff
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
                                                        name="gender"
                                                        labelText="gender"
                                                        placeholder="Select gender"
                                                    >
                                                        {({
                                                            input,
                                                            meta,
                                                        }) => (
                                                            <>
                                                            <div className='wfp--label'>Gender</div>
                                                            <Select
                                                                className="wfp--react-select-container auto-width"
                                                                classNamePrefix="wfp--react-select"
                                                                closeMenuOnSelect={true}
                                                                options={gender}
                                                                getOptionValue={(option) =>
                                                                    option['value'] ? option['value'] : option['id']
                                                                }
                                                                getOptionLabel={(option) =>
                                                                    option['label']
                                                                }
                                                                {...input}
                                                                {...meta}
                                                            />
                                                            </>
                                                        )}
                                                    </Field>
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
                                                        id="designation"
                                                        name="designation"
                                                        type="text"
                                                        labelText="Designation"
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
                                                        name="gradeLevel"
                                                        labelText="Grade level"
                                                        placeholder="Select grade level"
                                                    >
                                                        {({
                                                            input,
                                                            meta,
                                                        }) => (
                                                            <>
                                                            <div className='wfp--label'>Grade level</div>
                                                            <Select
                                                                className="wfp--react-select-container auto-width"
                                                                classNamePrefix="wfp--react-select"
                                                                closeMenuOnSelect={true}
                                                                // onChange={(vars) => {
                                                                //     this.languageChange(vars, originalOnChange)
                                                                // }}
                                                                options={gradeLevel}
                                                                getOptionValue={(option) =>
                                                                    option['value'] ? option['value'] : option['id']
                                                                }
                                                                getOptionLabel={(option) =>
                                                                    option['label']
                                                                }
                                                                {...input}
                                                                {...meta}
                                                            />
                                                            </>
                                                        )}
                                                    </Field>
                                                </FieldWrapper>
                                            </Col>

                                            
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
                                                        name="department"
                                                        labelText="Department"
                                                        placeholder="Select department"
                                                    >
                                                        {({
                                                            input,
                                                            meta,
                                                        }) => (
                                                            <>
                                                            <div className='wfp--label'>Department</div>
                                                            <Select
                                                                className="wfp--react-select-container auto-width"
                                                                classNamePrefix="wfp--react-select"
                                                                closeMenuOnSelect={true}
                                                                onChange={val=>this.fetchSubDept(val)}
                                                                options={department}
                                                                getOptionValue={(option) =>
                                                                    option['_id'] 
                                                                }
                                                                getOptionLabel={(option) =>
                                                                    option['name']
                                                                }
                                                                {...input}
                                                                {...meta}
                                                            />
                                                            </>
                                                        )}
                                                    </Field>
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
                                                        name="subDepartment"
                                                        labelText="Sub Department"
                                                        placeholder="Select sub department"
                                                    >
                                                        {({
                                                            input,
                                                            meta,
                                                        }) => (
                                                            <>
                                                            <div className='wfp--label'>Sub Department</div>
                                                            <Select
                                                                className="wfp--react-select-container auto-width"
                                                                classNamePrefix="wfp--react-select"
                                                                closeMenuOnSelect={true}
                                                                // onChange={(vars) => {
                                                                //     this.languageChange(vars, originalOnChange)
                                                                // }}
                                                                options={subDeparment}
                                                                getOptionValue={(option) =>
                                                                    option['_id'] 
                                                                }
                                                                getOptionLabel={(option) =>
                                                                    option['name']
                                                                }
                                                                {...input}
                                                                {...meta}
                                                            />
                                                            </>
                                                        )}
                                                    </Field>
                                                </FieldWrapper>
                                            </Col>

                                        </Row>
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
                                                        disabled={!valid}
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            this.onSubmit(
                                                                values
                                                            )
                                                        }}
                                                    >
                                                       {state && state.edit ? "Update" : "Create"} 
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

const mapStateToProps = (state) => {
    return {
        userId: state.user._id,
    }
}

export default connect(mapStateToProps, null)(Create)

const FieldWrapper = styled.div`
    margin-bottom: 30px;
`
