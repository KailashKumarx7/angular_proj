import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

import {MatTreeNestedDataSource, MatTreeModule} from '@angular/material/tree';
import {MatMenuModule} from'@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatListModule} from '@angular/material/list'




@NgModule({
  exports:[
        CommonModule,
        MatToolbarModule,
        MatButtonModule, 
        MatIconModule,
        MatTreeModule,
        MatMenuModule,
        MatFormFieldModule,
        MatCardModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        MatListModule

  ]
})
export class MaterialModule { }
