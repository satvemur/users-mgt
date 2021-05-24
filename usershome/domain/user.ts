export interface IUser {
    _id?: string
    email?: string
    firstname?: string
    lastname?: string,
    city?:string,
    state?:string,
    zip?:string

  }
  
export class User implements IUser {
    constructor(
        public _id = '',
        public firstname = '',
        public lastname = '',
        public email = '',
        public city = '',
        public state ='',
        public zip = ''
    ) {}
}
