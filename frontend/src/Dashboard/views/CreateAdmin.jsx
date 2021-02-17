import React from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import _ from 'lodash'
import { Row, Col } from 'react-flexbox-grid'
import Select from 'react-select'

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
    RadioButton,
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
        ministry: [],
        role: [],
    }
    componentDidMount() {
        window.scrollTo(0, 0)
        this.fetchMinistry();
        this.fetchRole();

        const { location } = this.props;
        const {state}= location;

        if(state && state.edit && state.data){
            const { firstName, lastName, email, gender, telephone, gradeLevel, designation,
                ministry, userRole } = state.data;
            
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
                    ministry,
                    role: userRole
                }
            })
        };
    }

    fetchMinistry=  async () => {
        try {
            axios.get(`/v1/ministry`)
            .then(data=> this.setState({ ministry : data.data }))
        } catch (err) {
            console.log('Error while loading ministry', err)
        }
    }

    fetchRole=  async () => {
        try {
            axios.get(`/v1/role`)
            .then(data=> this.setState({ role : data.data.filter(p => p.name == 'Admin') }))
        } catch (err) {
            console.log('Error while loading roles', err)
        }
    }
    
    onSubmit = async (values) => {
        this.setState({ loading: true });

        const { firstName, lastName, email, gender, telephone, gradeLevel, designation,
        ministry, role } = values;

        const formData={
            firstName,
            lastName,
            email,
            gender: gender.value,
            telephone,
            gradeLevel: gradeLevel.value,
            designation,
            // staffId,
            ministry: ministry._id,
            isAdmin: true,
            isSuper: false,
            isStaff: false,
            userRole: role
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
                await axios.post(`/v1/user/add`, formData)
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
        const { formData, loading, ministry, role } = this.state
        const { id } = this.props.match.params;
        const { location } = this.props;
        const {state}= location;
        
        return (
            <>
                <MySecondaryNavigation
                    l1Label="Admin"
                    l1Link="/ministry/admin"
                    l2Label={  state && state.edit ? "Update Admin data" : "Create ministry administrator"}
                    l2Link="#"
                    pageTitle={  state && state.edit ? "Update Admin data" : "Create ministry administrator"}
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
                                        firstName,
                                        lastName,
                                        email,
                                        telephone,
                                        gender, 
                                        designation, 
                                        role,
                                    } = values;

                                    if (!firstName || !lastName || !email || !telephone || !gender 
                                         || !designation || !role || !ministry) {
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
                                                        id="designation"
                                                        name="designation"
                                                        type="text"
                                                        labelText="Designation"
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
                                                md={6}
                                                sm={6}
                                                xs={12}
                                            >
                                                <FieldWrapper>
                                                    <Field
                                                        component={
                                                            ReduxFormWrapper
                                                        }
                                                        name="ministry"
                                                        labelText="Ministry"
                                                        placeholder="Select ministry"
                                                    >
                                                        {({
                                                            input,
                                                            meta,
                                                        }) => (
                                                            <>
                                                            <div className='wfp--label'>Ministry</div>
                                                            <Select
                                                                className="wfp--react-select-container auto-width"
                                                                classNamePrefix="wfp--react-select"
                                                                closeMenuOnSelect={true}
                                                                // onChange={(vars) => {
                                                                //     this.languageChange(vars, originalOnChange)
                                                                // }}
                                                                options={ministry}
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
                                                md={6}
                                                sm={6}
                                                xs={12}
                                            >
                                                <FieldWrapper>
                                                    <Field
                                                        component={
                                                            ReduxFormWrapper
                                                        }
                                                        name="role"
                                                    >
                                                        {({
                                                            input,
                                                            meta,
                                                        }) =>{
                                                             return (
                                                            <>
                                                                <div className='wfp--label'>Please select user role</div>
                                                                {role.map(
                                                                    (
                                                                        option,
                                                                        i
                                                                    ) => (
                                                                        <>
                                                                        <RadioButton
                                                                            key={i}
                                                                            {...input}
                                                                            {...meta}
                                                                            labelText={
                                                                                option.name
                                                                            }
                                                                            value={
                                                                                option._id
                                                                            }
                                                                            checked={
                                                                                input.value ===
                                                                                    option._id
                                                                            }
                                                                            // disabled={}
                                                                        />
                                                                        <br />
                                                                        </>
                                                                    )
                                                                )}
                                                            </>
                                                        )
                                                        }}
                                                        
                                                    </Field>
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

export default withRouter(Create)
const FieldWrapper = styled.div`
    margin-bottom: 30px;
`
