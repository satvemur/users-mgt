import React, { Component} from 'react';
import { InputText } from 'primereact/inputtext';
import { Fieldset } from 'primereact/fieldset';
import { Panel } from 'primereact/panel/';
import { InputTextarea} from 'primereact/inputtextarea';
import { Dropdown} from 'primereact/dropdown';
import { InputNumber} from 'primereact/inputnumber';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast'
import { Form, Field } from 'react-final-form';
import { classNames } from 'primereact/utils';
import { UserService } from './service/UserService';
import { Toolbar } from 'primereact/toolbar';

export class UserMgt extends Component{



    defaultUser = {
        _id: null,
        lastname: '',
        firstname: '',
        email: '',
    };
    
    static defaultProps = {
    }
    
    static propTypes = {

    }

    constructor(props) {
        super(props);

        this.state = {
            users: null,
            userDialog: false,
            deleteUserDialog: false,
            deleteUsersDialog: false,
            user: this.defaultUser,
            selectedUsers: null,
            submitted: false,
            globalFilter: null
        };
        this.userService = new UserService();
        this.leftToolbarTemplate = this.leftToolbarTemplate.bind(this);
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this);

        this.openNew = this.openNew.bind(this);
        this.hideDialog = this.hideDialog.bind(this);
        this.saveUser = this.saveUser.bind(this);
        this.editUser = this.editUser.bind(this);
        this.confirmDeleteUser = this.confirmDeleteUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.confirmDeleteSelected = this.confirmDeleteSelected.bind(this);
        this.deleteSelectedUsers = this.deleteSelectedUsers.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.hideDeleteUserDialog = this.hideDeleteUserDialog.bind(this);
        this.hideDeleteUsersDialog = this.hideDeleteUsersDialog.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.validate = this.validate.bind(this);
        this.isFormFieldValid = this.isFormFieldValid.bind(this);
        this.getFormErrorMessage  = this.getFormErrorMessage.bind(this);
        this.getUsers  = this.getUsers.bind(this);

    }
    // component mounted, like useEffect()
    componentDidMount() {
        this.getUsers();
    }
    // to create/update user launch dialog
    
    getUsers(){
        this.setState({user:[]});
        this.userService.getUsers().then(data => {
            this.setState({ users: data });
        });
    }
    openNew() {
        this.setState({
            user: this.defaultUser,
            submitted: false,
            userDialog: true
        });
    }    
    // dispose dialog
    hideDialog() {
        this.setState({
            submitted: false,
            userDialog: false
        });
    }

    hideDeleteUserDialog() {
        this.setState({ deleteUserDialog: false });
    }

    hideDeleteUsersDialog() {
        this.setState({ deleteUsersDialog: false });
    }

    update(){
        this.userService.saveUser(this.state.user).then(data => {          // _id will be present    
        })
    }
    add(){
        this.userService.saveUser(this.state.user).then(data => {     // _id will not be there         
        });
    }
    //save/update
    saveUser() {
        let state = { submitted: true };
        let users = [...this.state.users];
        let user = {...this.state.user};   
        console.log(this.state.user);
        if (this.state.user._id){
            this.update();
            const index = this.findIndexById(this.state.user._id);
            users[index] = user;
            this.toast.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });   
        } else {
            this.add();
            users.push(user); 
            this.toast.show({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 }); 
        }
        this.getUsers();

        state = {
            ...state,
            users,
            userDialog: false,
            user: this.defaultUser
        };        
        this.setState(state);
    }

    editUser(user) {
        let usr = {lastname:user.lastname, firstname:user.firstname, email:user.email, _id:String(user._id)}
        this.setState({
            user: usr, // careful about the ObjectId returned by Mongo, its a JS object needs to convert to string for comparision
            userDialog: true
        });
//        alert(JSON.stringify(user))
    }

    confirmDeleteUser(user) {
        this.setState({user, deleteUserDialog: true });
    }

    deleteUser() {
        this.userService.deleteUser(this.state.user._id).then(data => {
            this.getUsers();
//            let users = this.state.users.filter(val => val._id !== this.state.user._id);
            let users = this.state.users;
            this.setState({users:users,deleteUserDialog: false,user: this.defaultUser});
            this.toast.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
        });
    }

    findIndexById(id) {
        let index = -1;
        for (let i = 0; i < this.state.users.length; i++) {
            if (this.state.users[i]._id === id) {
                index = i;
                break;
            }
        }
        return index;
    }    

    confirmDeleteSelected() {
        this.setState({ deleteUsersDialog: true });
    }

    deleteSelectedUsers() {
        this.userService.deleteAllUsers().then(data => {
            this.getUsers();
//            let users = this.state.users.filter(val => !this.state.selectedUsers.includes(val));
            let users = this.state.users;
            this.setState({users, deleteUsersDialog: false, selectedUsers: null });
            this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });            
        });
    }

    onInputChange(e, name) {
        const val = (e.target && e.target.value) || '';
        let user = {...this.state.user};
        user[`${name}`] = val;
        this.setState({ user });
    }    

    leftToolbarTemplate() {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={this.openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={this.confirmDeleteSelected} disabled={!this.state.selectedUsers || !this.state.selectedUsers.length} />
            </React.Fragment>
        )
    }    

    actionBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => this.editUser(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => this.confirmDeleteUser(rowData)} />
            </React.Fragment>
        );
    }

    render(){
        const {lastname, firstname,email} = this.state.user;
        let regex = /^[a-zA-Z]+$/;
        const header = (
            <div className="table-header">
                <h5 className="p-m-0">Manage Users</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Search..." />
                </span>
            </div>
        );

        const UserDialogFooter = (
            <React.Fragment>
                <Button type="submit" label="Save" style={{ width: '10rem' }} className="p-mr-2 p-mb-2" />
                <Button type="button" label="Cancel" style={{ width: '10rem' }} className="p-mb-2" onClick={this.hideDialog} />                  
            </React.Fragment>
        );

        const deleteUserDialogFooter = (
            <React.Fragment>
                <Button label="No" icon="pi pi-times"  onClick={this.hideDeleteUserDialog} />
                <Button label="Yes" icon="pi pi-check"  onClick={this.deleteUser} />
            </React.Fragment>
        );
        
        const deleteUsersDialogFooter = (
            <React.Fragment>
                <Button label="No" icon="pi pi-times"  onClick={this.hideDeleteUsersDialog} />
                <Button label="Yes" icon="pi pi-check"  onClick={this.deleteSelectedUsers} />
            </React.Fragment>
        );        

        return (
            <div>
                <Toast ref={(el) => this.toast = el} />
                <div className="datatable-crud-demo card">
                    <Toolbar className="p-mb-4" left={this.leftToolbarTemplate} right={this.rightToolbarTemplate}></Toolbar>

                    <DataTable ref={(el) => this.dt = el} value={this.state.users} selection={this.state.selectedUsers} onSelectionChange={(e) => this.setState({ selectedUsers: e.value })}
                        dataKey="_id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
                        globalFilter={this.state.globalFilter}
                        header={header}>
                            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                            <Column field="_id" header="Id" sortable></Column>
                            <Column field="lastname" header="Last Name" sortable></Column>
                            <Column field="firstname" header="First Name" sortable></Column>
                            <Column field="email" header="Email" sortable></Column>
                            <Column body={this.actionBodyTemplate}></Column>
                    </DataTable>                    
                </div>  
                <Dialog header="User Details" visible={this.state.userDialog}  modal style={{ width: '40vw' }}  onHide={this.hideDialog} draggable={false} resizable={false}>
                    <div className="form-demo">
                        <div className="p-d-flex p-jc-center">
                            <div className="card">
                                <Form onSubmit={this.onSubmit} initialValues={{ lastname: this.state.user.lastname, firstname: this.state.user.firstname, email:this.state.user.email, _id:this.state.user._id}} validate={this.validate} render={({ handleSubmit }) => (
                                    <form onSubmit={handleSubmit} className="p-fluid">
                                        <Field name="lastname" render={({ input, meta }) => (
                                            <div className="p-field">
                                                <span className="p-float-label p-input-icon-right">
                                                    <i className="pi pi-user" />
                                                    <InputText id="lastname" {...input} autoFocus className={classNames({ 'p-invalid': this.isFormFieldValid(meta) })} />
                                                    <label htmlFor="lastname" className={classNames({ 'p-error': this.isFormFieldValid(meta) })}>Last Name*</label>
                                                </span>
                                                {this.getFormErrorMessage(meta)}
                                            </div>
                                        )} />
                                        <Field name="firstname" render={({ input, meta }) => (
                                            <div className="p-field">
                                                <span className="p-float-label p-input-icon-right">
                                                    <i className="pi pi-user" />
                                                    <InputText id="firstname" {...input} keyfilter={regex} validateOnly={true}  className={classNames({ 'p-invalid': this.isFormFieldValid(meta) })} />
                                                    <label htmlFor="firstname" className={classNames({ 'p-error': this.isFormFieldValid(meta) })}>First Name*</label>
                                                </span>
                                                {this.getFormErrorMessage(meta)}
                                            </div>
                                        )} />
                                        <Field name="email" render={({ input, meta }) => (
                                            <div className="p-field">
                                                <span className="p-float-label p-input-icon-right">
                                                    <i className="pi pi-envelope" />
                                                    <InputText id="email" {...input} className={classNames({ 'p-invalid': this.isFormFieldValid(meta) })} />
                                                    <label htmlFor="email" className={classNames({ 'p-error': this.isFormFieldValid(meta) })}>Email*</label>
                                                </span>
                                                {this.getFormErrorMessage(meta)}
                                            </div>
                                        )} />     
                                        {UserDialogFooter}                                 
                                    </form>
                                )} />
                            </div>
                        </div>
                    </div>
                 </Dialog>

                 <Dialog visible={this.state.deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={this.hideDeleteUserDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                        {this.state.user && <span>Are you sure you want to delete <b>{this.state.user.lastname}</b>?</span>}
                    </div>
                </Dialog>


                <Dialog visible={this.state.deleteUsersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUsersDialogFooter} onHide={this.hideDeleteUsersDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                        {this.state.user && <span>Are you sure you want to delete the selected users?</span>}
                    </div>
                </Dialog>                
            </div>            
        )
    }

    // validations

    validate(data) {
        let errors = {};

        if (!data.lastname) {
            errors.lastname = 'Last Name is required.';
        } else if(data.lastname.length > 100){
            errors.lastname = 'Last Name should be less than 100 chars length.';
        } else if(!/^[a-zA-Z]+$/.test(data.lastname)){
            errors.lastname = 'Last Name should be Alpha.';
        }

        if (!data.firstname) {
            errors.firstname = 'First Name is required.';
        } else if(data.firstname.length > 100){
            errors.firstname = 'First Name should be less than 100 chars length.';
        } else if(!/^[a-zA-Z]+$/.test(data.firstname)){
            errors.firstname = 'First Name should be Alpha.';
        }

        if (!data.email) {
            errors.email = 'Email is required.';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
            errors.email = 'Invalid email address. E.g. example@email.com';
        }

        return errors;
    };    

    onSubmit(data, form)  {
        console.log("data "+JSON.stringify(data))
        this.setFormData(data);
        this.setShowMessage(false);
        this.saveUser();
        form.restart();
    };    
    setFormData(data){
        this.state.user = {...data};
        this.setState({user:data});
//        alert(JSON.stringify(this.state.user))
    }

    setShowMessage(flag){
        this.state.userDialog = false;
    }

    isFormFieldValid (meta) {
        return !!(meta.touched && meta.error);
    }

    getFormErrorMessage (meta) {
        return this.isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };
}