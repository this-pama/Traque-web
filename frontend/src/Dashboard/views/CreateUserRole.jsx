import React from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import _ from 'lodash'
import { Row, Col } from 'react-flexbox-grid'
import { toast } from 'react-toastify'
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
    Checkbox,
    InputGroup,
} from '@wfp/ui'
import { iconCloseOutline } from '@wfp/icons'

import { Form, FormSpy, Field } from 'react-final-form'


class Create extends React.Component {
    state = {
        lastSaved: null,
        formData: null,
        showErrors: false,
        loading: false,
        allRoles: [],
        permission: []
    }
    componentDidMount() {
        window.scrollTo(0, 0)
        this.fetAllPermission()

        const { location } = this.props;
        const {state}= location;

        if(state && state.edit && state.data){
            this.setState({
                formData: {
                    ministry: state.data.name,
                    admin: state.data.userId
                }
            })
        };
    }

    fetAllPermission=  async () => {
        this.setState({ loading: true})
        try {
            axios.get(`/v1/role/all-roles`)
            .then(data=> this.setState({ allRoles : data.data, loading: false }))
        } catch (err) {
            console.log('Error while loading data', err)
            this.setState({ loading: false})
        }
    }

    setPermission= (e, p)=>{
        const { permission } = this.state;
        if(e){
            this.setState({ permission: [...permission, p]})
        }
        else this.setState({ permission : permission.filter(perm => perm != p)})
    }
    
    onSubmit = async (values) => {
        this.setState({ loading: true });
        const { location } = this.props;
        const {state}= location;
        let formData;

        console.log(this.state.permission)
       
        // try {
        //     if(state && state.edit){
        //         formData={
        //             name: values.ministry,
        //             userId: values.admin._id
        //         }
    
        //         await axios.put(`/v1/ministry/update/${state.id}`, formData)
        //         .then(()=> this.setState({ loading: false }))
        //         toast('Successfully updated a ministry', {closeOnClick: true, autoClose: 1000 });
        //         this.props.history.goBack()
        //     }
        //     else{
        //         await axios.post(`/v1/ministry/add`, { name: values.ministry })
        //         .then(()=> this.setState({ loading: false }))
        //         toast('Successfully created a ministry', {closeOnClick: true, autoClose: 1000 });
        //         this.props.history.goBack()
        //     }
            
            
        // } catch (err) {
        //     console.log('Ooops! error occurred, please try again', err)
        //     toast.error('Ooops! error occurred, please try again', {closeOnClick: true, autoClose: 1000 });
        //     this.setState({ loading: false })
        // }
    }

    
    render() {
        const { showErrors } = this.state;
        const { formData, loading, allRoles } = this.state;
        const { location } = this.props;
        const {state}= location;
        return (
            <>
                <MySecondaryNavigation
                    l1Label="Dashboard"
                    l1Link="/ministry"
                    l2Label={  state && state.edit ? 'Update user role' : 'Create user role' }
                    l2Link="#"
                    pageTitle={  state && state.edit ? 'Update user role' : 'Create user role' }
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
                                validate={(values) => {
                                    const errors = {}
                                    const {
                                        ministry,
                                    } = values

                                    if (!ministry) {
                                        errors.ministry = {
                                            value: 'Ministry name is required',
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
                                                    {  state && state.edit ? 'Update User role' : 'Create user role' }
                                                </span>
                                            </ModuleHeader>
                                            <ModuleBody>
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
                                                            id="name"
                                                            name="name"
                                                            type="text"
                                                            labelText="Name"
                                                        />
                                                    </FieldWrapper>
                                                </Col>

                                                <Col 
                                                    md={6}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                <FieldWrapper>
                                                            
                                                    <InputGroup
                                                        helperText="select any that apply"
                                                        labelText="Permissions"
                                                        vertical
                                                    >
                                                        {allRoles.map(p=>(
                                                            <Checkbox
                                                                // checked={false}
                                                                // defaultChecked
                                                                id={p}
                                                                labelText={p}
                                                                onChange={(e,p)=> this.setPermission(e, p)}
                                                            />
                                                        ))}
                                                    </InputGroup>
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
                
            </>
        )
    }
}

export default withRouter(Create)
const FieldWrapper = styled.div`
    margin-bottom: 30px;
`
