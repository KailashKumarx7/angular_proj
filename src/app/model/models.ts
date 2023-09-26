export interface Login {
    user_id: String,
    password: String
}

export interface SubmenuUrl {
    item_no: Number,
    menu_sub_item_key: Number,
    name: String,
    menu_command_name: String,
    menu_fast_way: String,
    menu_function: String,
    url: String
}


export interface Category {
    id: number,
    nep_text: String,
    eng_text: String
}


export interface NewUser {
    full_name: string,
    user_id: string,
    password: string,
    access_level: string,
    email: string,
    name:string,
    faculty: string,
    phone_number: string,
    school_name: string,
    print_on: number,
    paper_size: number,
    isteacher: boolean,
    employee_key:number
}
export interface Employee {
      inst_key :number,
      emp_key :number,
      emp_name :string
}

export interface MenuList{
    item_no: number,
    menu_item_name_display: string
}



export interface SchoolName {
      inst_key :number,
      inst_name :string
}
export interface UserLevel {
      inst_key :number,
      access_key :number,
      access_name :string
}

export interface Faculty {
      inst_key:number,
      fac_key:number,
      fac_name:string,
}

export interface AccessableMenu{
      name :String,
      user_key :Number,
      regd_by:String|null,
      menu_item_key :Number,
      menu_sub_item_key :Number,
      name_display :String,
      menu_command_name :String,
      menu_fast_way :String
}

  
  
  




// export const schoolnames: SchoolName[] = [
//     { key:221,name: 'Himalayan college' },
//     { key:222,name: 'Nepal mega college' },
//     { key:223,name: 'White house college' },
//     { key:224,name: 'Herald college' },
//     { key:225,name: 'Nist College' }
// ];

// export const userlevels: UserLevel[] = [
//     { name: 'Finance Control' },
//     { name: 'User' },
//     { name: 'Library Control' },
//     { name: 'Supervisor' }
// ];

// export const faculties: Faculty[] = [
//     { name: 'BCA' },
//     { name: 'BSW' },
//     { name: 'BSCcs IT' },
//     { name: 'BBS' },
//     { name: 'BBA' },
//     { name: 'MBS' },
//     { name: 'MBBS' },
//     { name: 'B-Farm' },
//     { name: 'AG' }
// ];

// export const employees:Employee[]=[
//     {id: 123,name:'Bikash Choudhary'},
//     {id: 124,name:'Bikash Pandy'},
//     {id: 125,name:'Purnima Yadav'},
//     {id: 126,name:'Niruta Khadka'},
//     {id: 127,name:'Kishor Bom'},
//     {id: 128,name:'Anupam Rana'},
//     {id: 129,name:'Shankar Pujara'}

// ]


