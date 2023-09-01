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