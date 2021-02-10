import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'parking-manage';

  is_logged_in = true;
  username = "";
  password = "";

  parking_slots = {};
  selected_slot;
  is_for_rent = false;
  is_for_book = false;
  vehicle_no:string;
  date:string;
  check_in:string;
  reports_captions:string = "Reports";
  displayedColumns = ["date"];
  bookingDataSet: bookingData[] = [];
  rentingDataSet: any[] = [];

  constructor(private http: HttpClient, public dialog: MatDialog) {

  }

  ngOnInit() {
    // setInterval(this.set_parking_slots, 1000);
    this.set_parking_slots();
    this.load_bookings();
    this.load_rentingss();
  }

  set_parking_slots() {
    let date = new Date();
    let month = (date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)) ;
    let dateF = ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()));
    let formatted_date = date.getFullYear() + '-' + month + '-' + dateF;
    this.http.get("http://localhost:5000/blocks?date="+ formatted_date).subscribe(result => {
      this.parking_slots = result;
    });
  }

  login() {
    let requestBody = {
      "username":this.username,
      "password": this.password
    }
    this.http.post("http://localhost:5000/login", requestBody)
      .subscribe(data=> {
        if(data['success']) {
          this.is_logged_in = true;
          alert("Logged In");
        } else {
          alert("Error occured");
        }
      });
  }

  logout() {
    this.is_logged_in = false;
  }

  openDialog(cost, time): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {cost: cost, duration: time}
    });

  }

  select_slot_for_rent(slot) {
    this.is_for_book = false;
    this.is_for_rent = true;
    this.select_slot(slot);
  }

  select_slot_for_book(slot) {
    this.is_for_book = true;
    this.is_for_rent = false;
    this.select_slot(slot);
  }

  select_slot(slot) {
    this.selected_slot = slot;
  }

  book_slot() {
    let date = new Date(this.date);
    let month = (date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)) ;
    let dateF = ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()));
    let formatted_date = date.getFullYear() + '/' + month + '/' + dateF;
    let requestBody = {
      "slot_id":this.selected_slot[0],
      "vehicle_no": this.vehicle_no,
      "date": formatted_date
    }
    console.log(requestBody);
    this.http.post("http://localhost:5000/slot/book", requestBody).subscribe(data=>{
      if(data['success']) {
        this.selected_slot = undefined;
        this.set_parking_slots();
        alert("Booked");
      } else {
        alert("Error occured");
      }
    })

  }

  rent_slot() {
    let date = new Date();
    let month = (date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)) ;
    let dateF = ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()));
    let formatted_date = date.getFullYear() + '/' + month + '/' + dateF;

    let requestBody = {
      "slot_id":this.selected_slot[0],
      "vehicle_no": this.vehicle_no,
      "date": formatted_date,
      "check_in": this.check_in
    }

    this.http.post("http://localhost:5000/slot/rent", requestBody).subscribe(data=>{
      if(data['success']) {
        this.selected_slot = undefined;
        this.set_parking_slots();
        alert("Rented");
      } else {
        alert("Error occured");
      }
    })
  }

  end_rent_slot() {
    let requestBody = {
      "slot_id":this.selected_slot[0],
      "check_out": this.check_in
    }

    this.http.post("http://localhost:5000/slot/rent/end", requestBody).subscribe(data=>{
      if(data['success']) {
        this.selected_slot = undefined;
        this.set_parking_slots();
        this.openDialog(data['payment'], data['total_time'])
      } else {
        alert("Error occured");
      }
    })
  }

  toggle_reports() {
    if(this.reports_captions == "Reports") {
      this.reports_captions = "Home";
    } else {
      this.reports_captions = "Reports";
    }
  }

  load_bookings() {
    return this.http.get("http://localhost:5000/bookings")
    .toPromise()
    .then(res=> <any[]> res)
    .then(data=>{
      this.bookingDataSet = data;
    })
  }

  load_rentingss() {
    return this.http.get("http://localhost:5000/rentings")
    .toPromise()
    .then(res=> <any[]> res)
    .then(data=>{
      this.rentingDataSet = data;
    })
  }

}

export interface bookingData {
  slot_id:string,
  vehicle_no:string,
  date:string
}

export interface DialogData {
  cost: string;
  duration: string;
}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

