import React from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import _ from 'lodash'
import { Row, Col } from 'react-flexbox-grid'
import { toast } from 'react-toastify'
import Select from 'react-select'
import { connect } from 'react-redux'
import 'react-dates/initialize';
import { SingleDatePickerInput } from "@wfp/ui";
import { SingleDatePicker } from 'react-dates';

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
import { deptType, fileType } from '../../shared/utils'
import moment from 'moment'

class Create extends React.Component {
    state = {
        lastSaved: null,
        formData: null,
        showErrors: false,
        loading: false,
        date: moment(),
        focused: null,
        serviceType: [],
        deptList: [],
        staffList: [],
        department: {}
    }
    componentDidMount() {
        window.scrollTo(0, 0)

        const { location } = this.props;
        const {state}= location;

        this.fetchDepartment();

        if(state && state.edit && state.data){
            let oldNumber = state.data && state.data.fileNo
                ? state.data.fileNo.slice(11)
                : null;

            this.setState({
                formData: {
                    name: state.data.name,
                    type: {
                        value: state.data.type,
                        label: state.data.type
                    },
                    fileNo: oldNumber,
                },
                date: state.data.createdDate 
                    ? moment(state.data.createdDate) 
                    : moment(),
                serviceType: {
                    id: state.data.serviceFileType
                }
            })
        };
    }
    
    onSubmit = async (values) => {
        this.setState({ loading: true });
        const { location, userId, id } = this.props;
        const {state}= location;
        let formData={
            receiverId: values.designatedOfficer._id, 
            sentDate: this.state.date,
            sentTime: this.state.date,
        }
       
        try {
            await axios.post(`/v1/file/forward/${id}/${userId}`, formData)
            .then(()=> this.setState({ loading: false }))
            toast('File successfully forwarded', {closeOnClick: true, autoClose: 1000 });
            this.props.history.push('/file/outgoing') 
        } catch (err) {
            console.log('Ooops! error occurred, please try again', err)
            toast.error('Ooops! error occurred, please try again', {closeOnClick: true, autoClose: 1000 });
            this.setState({ loading: false })
        }
    }

    fetchDepartment =  async () => {
        const { user, id } = this.props;
        this.setState({ loading: true})
        try {
            axios.get(`/v1/department`)
            .then(data=> this.setState({ deptList : data.data, loading: false }))
        } catch (err) {
            console.log('Error while loading department', err)
            this.setState({ loading: false})
        }
    }

    
    fetchStaff =  async (p) => {
        const { user, id } = this.props;
        this.setState({ loading: true})
        try {
            axios.get(`/v1/department/staff/${p && p._id}`)
            .then(data=> {
                this.setState({ staffList : data.data.data.staff, loading: false })
            })
        } catch (err) {
            console.log('Error while loading department', err)
            this.setState({ loading: false})
        }
    }

    validate= values =>{
        const error = {}
        const {
            department,
            designatedOfficer,
        } = values;

        if(!department){
            error.department = {
                value: 'Department name is required',
            }
        }

        if(!designatedOfficer){
            error.designatedOfficer={
                value: 'Select receiver',
            }
        }

        if(department && department != this.state.department){
            this.fetchStaff(department);
            this.setState({department })
        }

        return error;
    }

    
    render() {
        const { showErrors, serviceType, deptList } = this.state;
        const { formData, loading, staffList } = this.state;
        const { location, userId, user } = this.props;
        const {state}= location;
        const permission = user && user.permission ? user.permission 
        : {
            createServiceFile: false,
            createManagementFile: false
        };

        const fileList = fileType.filter(p => 
            p.label == 'Service file' 
            && p.createServiceFile == permission.createServiceFile 
            || p.label == 'Management file' 
            && p.createManagementFile == permission.createManagementFile 
        );

        return (
            <>
                <MySecondaryNavigation
                    l1Label="Manage File"
                    l1Link="/file"
                    l2Label={"File Transfer" }
                    l2Link="#"
                    pageTitle={"File Transfer" }
                />
                    <Loading active={loading} withOverlay={true} />
                
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
                                validate={(values) => this.validate(values)}
                                render={({ values, onSave, valid, reset }) => (
                                    <form>
                                        <Module noMargin>
                                            <ModuleHeader>
                                                <span style={{ fontSize: 20 }}>
                                                   Forward file
                                                </span>
                                            </ModuleHeader>
                                            <ModuleBody>
                                                <Col 
                                                    md={8}
                                                    sm={8}
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
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        labelText="File name/title"
                                                        disabled={ true}
                                                    />
                                                </FieldWrapper>
                                            </Col>

                                            <Col 
                                                    md={8}
                                                    sm={8}
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
                                                        id="fileNo"
                                                        name="fileNo"
                                                        type="text"
                                                        labelText="File number"
                                                        disabled={ true}
                                                    />
                                                </FieldWrapper>
                                            </Col>

                                                <Col 
                                                    md={8}
                                                    sm={8}
                                                    xs={12}
                                                >
                                                    <FieldWrapper>
                                                        <Field
                                                            component={
                                                                ReduxFormWrapper
                                                            }
                                                            name="type"
                                                            labelText="File Type"
                                                            placeholder="Select file type"
                                                        >
                                                            {({
                                                                input,
                                                                meta,
                                                            }) => (
                                                                <>
                                                                <div className='wfp--label wfp--label--disabled'>File type</div>
                                                                <Select
                                                                    className="wfp--react-select-container auto-width"
                                                                    classNamePrefix="wfp--react-select"
                                                                    closeMenuOnSelect={true}
                                                                    options={fileList}
                                                                    getOptionValue={(option) =>
                                                                        option['value'] 
                                                                    }
                                                                    getOptionLabel={(option) =>
                                                                        option['label'] 
                                                                    }
                                                                    {...input}
                                                                    {...meta}
                                                                    isDisabled={true}
                                                                />
                                                                </>
                                                            )}
                                                        </Field>
                                                    </FieldWrapper>
                                                </Col>

                                                {values.type == 'Service file'
                                                && (
                                                <Col 
                                                    md={8}
                                                    sm={8}
                                                    xs={12}
                                                >
                                                    <FieldWrapper>
                                                        <Field
                                                            component={
                                                                ReduxFormWrapper
                                                            }
                                                            name="serviceType"
                                                            labelText="Service File Type"
                                                            placeholder="Select service file type"
                                                        >
                                                            {({
                                                                input,
                                                                meta,
                                                            }) => (
                                                                <>
                                                                <div className='wfp--label wfp--label--disabled'>Service File type</div>
                                                                <Select
                                                                    className="wfp--react-select-container auto-width"
                                                                    classNamePrefix="wfp--react-select"
                                                                    closeMenuOnSelect={true}
                                                                    options={serviceType}
                                                                    getOptionValue={(option) =>
                                                                        option['_id'] 
                                                                    }
                                                                    getOptionLabel={(option) =>
                                                                        option['name'] 
                                                                    }
                                                                    {...input}
                                                                    {...meta}
                                                                    isDisabled={ true }
                                                                />
                                                                </>
                                                            )}
                                                        </Field>
                                                    </FieldWrapper>
                                                </Col>
                                                )}
                                                
                                                <Col 
                                                    md={8}
                                                    sm={8}
                                                    xs={12}
                                                >
                                                    <FieldWrapper>
                                                        <Field
                                                            component={
                                                                ReduxFormWrapper
                                                            }
                                                            name="department"
                                                            labelText="Destination"
                                                            placeholder="Select destination department"
                                                        >
                                                            {({
                                                                input,
                                                                meta,
                                                            }) => (
                                                                <>
                                                                <div className='wfp--label '>Destination</div>
                                                                <Select
                                                                    className="wfp--react-select-container auto-width"
                                                                    classNamePrefix="wfp--react-select"
                                                                    closeMenuOnSelect={true}
                                                                    options={deptList}
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
                                                    md={8}
                                                    sm={8}
                                                    xs={12}
                                                >
                                                    <FieldWrapper>
                                                        <Field
                                                            component={
                                                                ReduxFormWrapper
                                                            }
                                                            name="designatedOfficer"
                                                            labelText="Designated officer"
                                                            placeholder="Select designated officer"
                                                        >
                                                            {({
                                                                input,
                                                                meta,
                                                            }) => (
                                                                <>
                                                                <div className='wfp--label'>Designated officer</div>
                                                                <Select
                                                                    className="wfp--react-select-container auto-width"
                                                                    classNamePrefix="wfp--react-select"
                                                                    closeMenuOnSelect={true}
                                                                    options={staffList}
                                                                    getOptionValue={(option) =>
                                                                        option['_id'] 
                                                                    }
                                                                    getOptionLabel={(option) =>
                                                                        option['firstName'] + " " + option['lastName']
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
                                                    md={8}
                                                    sm={8}
                                                    xs={12}
                                                >
                                                    <FieldWrapper>
                                                        <Field
                                                            component={
                                                                ReduxFormWrapper
                                                            }
                                                            name="date"
                                                            id='date'
                                                        >
                                                            {({
                                                                input,
                                                                meta,
                                                            }) => (
                                                                <SingleDatePickerInput
                                                                    date={this.state.date }
                                                                    datePicker={SingleDatePicker}
                                                                    inputIconPosition="after"
                                                                    labelText="Date forwarded"
                                                                    onDateChange={date=> this.setState({ date: moment(date) })}
                                                                    onChange={(date)=>this.setState({ date })}
                                                                    focused={this.state.focused}
                                                                    onFocusChange={({ focused }) =>
                                                                        this.setState({ focused })
                                                                    }
                                                                    placeholder="Select opening date"
                                                                    numberOfMonths={1}
                                                                    showDefaultInputIcon
                                                                    isOutsideRange={() => false}
                                                                    {...input}
                                                                    {...meta}
                                                                />
                                                            )}
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
                                                        CANCEL
                                                    </Button>

                                                    <Button
                                                        // disabled={!valid}
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            this.onSubmit(
                                                                values
                                                            )
                                                        }}
                                                        disabled={
                                                            values.designatedOfficer && values.designatedOfficer._id
                                                            ? false: true
                                                        }
                                                    >
                                                      FORWARD FILE
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
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userId: state.user._id,
        user: state.user
    }
}

export default connect(mapStateToProps, null)(Create)

const FieldWrapper = styled.div`
    margin-bottom: 30px;
    .SingleDatePicker {
        position: relative;
        order: 3;
        width: 100%;
    }
    .DateInput {
        width: 100%;
    }
    .SingleDatePickerInput {
        width: 100%;
    }
`
