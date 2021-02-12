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
        admin: [],
        date: moment(),
        focused: null,
    }
    componentDidMount() {
        window.scrollTo(0, 0)

        const { location } = this.props;
        const {state}= location;

        if(state && state.edit && state.data){
            this.setState({
                formData: {
                    name: state.data.name,
                    type: {
                        value: state.data.type,
                        label: state.data.type
                    },
                    fileNo: state.data.fileNo,
                },
                date: state.data.createdDate 
                    ? moment(state.data.createdDate) 
                    : moment()
            })
        };
    }
    
    onSubmit = async (values) => {
        this.setState({ loading: true });
        const { location, userId } = this.props;
        const {state}= location;
        let formData={
            name: values.name,
            type: values.type.value,
            fileNo: values.fileNo,
            createdDate: this.state.date,
        }
       
        try {
            if(state && state.edit){
                await axios.put(`/v1/file/add/${state.id}`, formData)
                .then(()=> this.setState({ loading: false }))
                toast('Successfully updated a department', {closeOnClick: true, autoClose: 1000 });
                this.props.history.goBack()
            }
            else{
                await axios.post(`/v1/file/add/${userId}`, formData)
                .then(()=> this.setState({ loading: false }))
                toast('File successfully created', {closeOnClick: true, autoClose: 1000 });
                this.props.history.goBack()
            }
            
            
        } catch (err) {
            console.log('Ooops! error occurred, please try again', err)
            toast.error('Ooops! error occurred, please try again', {closeOnClick: true, autoClose: 1000 });
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
                    l1Label="Manage File"
                    l1Link="/file"
                    l2Label={  state && state.edit ? 'Update file' : 'Create file' }
                    l2Link="#"
                    pageTitle={  state && state.edit ? 'Update file' : 'Create file' }
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
                                        name, 
                                        type,
                                    } = values

                                    if (!name) {
                                        errors.name = {
                                            value: 'Department name is required',
                                            show: showErrors,
                                        }
                                    } 

                                    if (!type) {
                                        errors.name = {
                                            value: 'Department type is required',
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
                                                    {  state && state.edit ? 'Update File' : 'Create File' }
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
                                                        labelText="File name/type"
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
                                                                <div className='wfp--label'>File type</div>
                                                                <Select
                                                                    className="wfp--react-select-container auto-width"
                                                                    classNamePrefix="wfp--react-select"
                                                                    closeMenuOnSelect={true}
                                                                    options={fileType}
                                                                    getOptionValue={(option) =>
                                                                        option['value'] 
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
                                                                    labelText="Opening date"
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
                                                        disabled={
                                                            values.name && values.type
                                                            ? false: true
                                                        }
                                                    >
                                                       { state && state.edit ? 'Update' : 'Create' } 
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
