import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GetDataService } from 'src/app/services/get-data.service';



@Component({
  selector: 'app-data-migration',
  templateUrl: './data-migration.component.html',
  styleUrls: ['./data-migration.component.css']
})
export class DataMigrationComponent {
  selectedTableValue!: string;

  headrows!:[];
  datarows!:[];

  selectedFile!:File;

  tables:[] = [];// Define the form property

  constructor(private getdataService: GetDataService, private https:HttpClient, private dataService:DataServiceService,private fb: FormBuilder,) {
    this.tables = [];
  }


  datamigrate = this.fb.group({
    selectedTableValue:[''],
    filecontrol:[''],
  }
   )

  ngOnInit(): void {
    this.getdataService.getDatabaseTables().subscribe(
      (tables) => {

        this.tables = tables;
        console.log(tables);
      }
    )
  }

  handleFileInput($event:any){
    this.selectedFile = <File>$event.target.files[0];
    console.log($event);
  }

  onSubmit() {
   const filedata = new FormData();
    const tablename = this.datamigrate.get('selectedTableValue')?.value;
   filedata.append('file',this.selectedFile,this.selectedFile.name)
   
   this.dataService.migrateData(tablename,filedata).subscribe(
    (response)=>{
      this.headrows = response.tableHeading;
      this.datarows = response.tableData;
    }
   )
  }
  








}
