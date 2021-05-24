import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/components/usershome/service/usersservice';
import { EmailValidation, RequiredTextValidation } from './common/validations';
import { IUser, User } from './domain/user';

@Component({
  templateUrl: './users.home.component.html',
  styleUrls: ['./usershome.component.css'],
  styles: [`
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
            position: -webkit-sticky;
            position: sticky;
            top: 0px;
        }

        @media screen and (max-width: 64em) {
            :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
                top: 99px;
            }
        }
    `]  
})

export class UsersHomeComponent implements OnInit, OnDestroy {

    public subscription: Subscription;
    public userDialog: boolean;
    public users: IUser[];
    public user: IUser;
    public selectedUsers: IUser[];
    public submitted: boolean;
    public errorMsg: string;
    public groupform: FormGroup;
    public ccRegex: RegExp = /[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/;

    constructor(private usersService: UsersService,private messageService: MessageService, private confirmationService: ConfirmationService) {}

    ngOnInit() { // gets all users
        this.initForm();
        this.getUsers();
    }

    public getUsers(){
        this.users = [];
        this.usersService.getUsers().subscribe((results: IUser[]) => {
            this.users = results;
          },
          error => {
            this.handleError(error);
          }
        );
    }

    public initForm(){
        this.groupform = new FormGroup({
          'email': new FormControl('',EmailValidation),
          'firstname':new FormControl('', RequiredTextValidation),
          'lastname':new FormControl('',RequiredTextValidation),
          'address':new FormControl(''),      
          '_id':new FormControl(''),      
        });   
    }

    private handleError(error: Response | any) {
        if (error instanceof Response) {
            if (error.status === 404) {
                this.errorMsg = `Resource ${error.url} was not found`;    
            } else {
                const body = error.json() || '';
                const err = JSON.stringify(body);
                this.errorMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            }
        } else {
            this.errorMsg = error.message ? error.message : error.toString();
        }
    }       

    // new user creation
    public openNew() {
        this.initForm(); // rerender the form
        this.user = {};
        this.submitted = false;
        this.userDialog = true;
    }    

    // delete selected users
    public deleteSelectedUsers() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected users?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.users = this.users.filter(val => this.selectedUsers.includes(val));
                this.usersService.removeSelectedUsers(this.users)
                .subscribe((res) =>{
                    console.log("User deleted " + JSON.stringify(res));
                    this.addSuccess('Users deleted Successfully');
                    this.selectedUsers = null;
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Users Deleted', life: 3000});
                    this.getUsers();
                }, err => {
                    this.showError(err);
                })  
            }
        });
    }    
    
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }
    
    public findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i]._id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    public getData():IUser{
        if(this.user._id){
            return {_id:String(this.user._id), lastname:this.groupform.get('lastname').value, firstname:this.groupform.get('firstname').value, email:this.groupform.get('email').value}
        } else {
            return {lastname:this.groupform.get('lastname').value, firstname:this.groupform.get('firstname').value, email:this.groupform.get('email').value}
        }
    }

    public add(usr:IUser){
        this.usersService.updateUser(usr).subscribe((res) =>{
            this.users.push(usr);
            this.addSuccess('User is added Successfully');
        }, err => {
            this.showError(err);
        }) 
    }

    public update(usr:IUser){
        this.usersService.updateUser(usr).subscribe((res) =>{
            this.users[this.findIndexById(usr._id)] = usr;                
            this.addSuccess('User is updated Successfully');
        }, err => {
            this.showError(err);
        }) 
    }

    // saves user
    public saveUser() {
        let usr:IUser = this.getData();
        this.submitted = true;

        if(usr && usr._id){
            this.update(usr)
        } else {
            this.add(usr);
        }
        this.getUsers();
        this.users = [...this.users];
        this.userDialog = false;
        this.user = {};
    }   
    
    public addSuccess(msg:string) {
        this.messageService.add({key: 'tc', severity:'success', summary: 'Success', detail: msg});
    }
  
    public showError(error:any) {
        this.messageService.add({key: 'tc',severity:'error', summary: 'Error', detail:error});
    }

    public onSubmit() {
        this.saveUser();
    }
    
    public deleteUser(user: IUser) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + user.lastname + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.usersService.removeUser(user)
                .subscribe((res) =>{
                    this.addSuccess('User is deleted Successfully');
                    this.users = this.users.filter(val => val._id !== user._id);
                    this.user = {};
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'User Deleted', life: 3000});
                    this.getUsers();
                }, err => {
                    this.showError(err);
                })  
            }
        });
    }
    
    public editUser(user: IUser) {
        this.user = {...user};
        this.user._id = String(user._id); // id is an ObjectID, so get a string version for 
        this.userDialog = true;
        this.fillData();  //
    }

    // populates the user data into form fields
    public fillData():void{
        this.groupform.patchValue({lastname:this.user.lastname});
        this.groupform.patchValue({firstname:this.user.firstname});
        this.groupform.patchValue({email:this.user.email});
        this.groupform.patchValue({_id:this.user._id});
    }
}
