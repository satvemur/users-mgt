import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { UserService } from './UserService';
import { CountryService } from './CountryService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import './App.css';

// Typescript version 

export const UsersTsxApp = () => {

    // an empty user
    let defaultUser = {
        lastname: null,
        firstname: '',
        email: null,
    };

    //app state
    const [users, setUsers] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(defaultUser);
    const [submitted, setSubmitted] = useState(false);
    const [countries, setCountries] = useState(false);
    // get the service
    const userService = new UserService();
    const countryService = new CountryService();

    // component mounted
    useEffect(() => {
        userService.getUsers().then(data =>{
            userService.getUsers().then(data => setUsers(data));
        })
        countryService.getCountries().then(data => setCountries(data))
    },[]); // one time loading

    const validate = (data:any) => {
        let errors = {};

        if (!data.lastname) {
            errors.lastname = 'Last Name is required.';
        } else if(data.lastname.length > 100){
            errors.lastname = 'Last Name should be less than 100 chars length.';
        } else if(!/^[a-zA-Z]+$/.test(data.lastname)){
            errors.lastname = 'Last Name should be Alpha.';
        }

        if (!data.email) {
            errors.email = 'Email is required.';
        }
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
            errors.email = 'Invalid email address. E.g. example@email.com';
        }

        if (!data.firstname) {
            errors.firstname = 'First Name is required.';
        } else if(data.firstname.length > 100){
            errors.firstname = 'First Name should be less than 100 chars length.';
        } else if(!/^[a-zA-Z]+$/.test(data.firstname)){
            errors.firstname = 'First Name should be Alpha.';
        }

        return errors;
    };

    const onSubmit = (data, form) => {
        setFormData(data);
        saveUser(data);
        form.restart();
    };

    const saveUser = (data) => {
        setSubmitted(true);
        let _users = [...users];
        let _user = {...user};
        _users.push(data);
        userService.saveUser(data).then(data => {     // _id will not be there         
            setShowMessage(true);
            setUsers(_users);
            setUser(defaultUser);
        });        
    }
    // validators

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);

    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    const dialogFooter = <div className="p-d-flex p-jc-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false) } /></div>;

    return (
        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="p-d-flex p-ai-center p-dir-col p-pt-6 p-px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>User Added Successfully!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        User is registered under name <b>{formData.lastname}</b> <b>{formData.email}</b> for activation.
                    </p>
                </div>
            </Dialog>
            <Panel header="Add User">
                <div className="p-d-flex p-jc-center">
                    <div className="card">
                        <Form onSubmit={onSubmit} initialValues={{ lastname: '', email: '', firstname: ''}} validate={validate} render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit} className="p-fluid">
                                <Field name="lastname" render={({ input, meta }) => (
                                    <div className="p-field">
                                        <span className="p-float-label">
                                            <InputText id="lastname" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="lastname" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Name*</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Field name="firstname" render={({ input, meta }) => (
                                    <div className="p-field">
                                        <span className="p-float-label">
                                            <InputText id="firstname" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="firstname" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Name*</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />                            
                                <Field name="email" render={({ input, meta }) => (
                                    <div className="p-field">
                                        <span className="p-float-label p-input-icon-right">
                                            <i className="pi pi-envelope" />
                                            <InputText id="email" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Email*</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Button type="submit" label="Save User" className="p-mt-2" />
                            </form>
                        )} />                
                    </div>
                </div>                
            </Panel>

            <Divider type="dashed" />
            <div className="card">
                <DataTable value={users} scrollable scrollHeight="200px" className="p-datatable-gridlines" loading={loading}>
                    <Column field="lastname" header="Last Name"></Column>
                    <Column field="firstname" header="First Name"></Column>
                    <Column field="email" header="Email"></Column>
                </DataTable>
            </div>                
        </div>
    );
}     
const rootElement = document.getElementById("root");
ReactDOM.render(<UsersTsxApp />, rootElement);