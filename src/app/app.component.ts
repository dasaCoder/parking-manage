import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { map } from 'rxjs/operators';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'parking-manage';

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

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    // setInterval(this.set_parking_slots, 1000);
    this.set_parking_slots();
    this.load_bookings();
    this.load_rentingss();
  }

  set_parking_slots() {
    this.http.get("http://localhost:5000/blocks").subscribe(result => {
      this.parking_slots = result;
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
        alert("Slot Released");
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

