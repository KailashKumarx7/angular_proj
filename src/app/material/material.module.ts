import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

import {MatTreeNestedDataSource, MatTreeModule} from '@angular/material/tree';
import {MatMenuModule} from'@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field'




@NgModule({
  exports:[
        CommonModule,
        MatToolbarModule,
        MatButtonModule, 
        MatIconModule,
        MatTreeModule,
        MatMenuModule,
        MatFormFieldModule

  ]
})
export class MaterialModule { }
