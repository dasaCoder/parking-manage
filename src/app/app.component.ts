import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'parking-manage';

  parking_slots = [];
  selected_slot;

  ngOnInit() {
    this.parking_slots = [
      {
        "name" : "Slot 1",
        "division" : "D1",
        "is_available" : "0",
        "type":"car"
      },
      {
        "name" : "Slot 2",
        "division" : "D1",
        "is_available" : "1",
        "type":"car"
      },
      {
        "name" : "Slot 3",
        "division" : "D1",
        "is_available" : "1",
        "type":"bike"
      },
      {
        "name" : "Slot 4",
        "division" : "D1",
        "is_available" : "0",
        "type":"bike"
      }
    ];

    console.log(this.parking_slots[0]);
  }

  select_slot(slot) {
    this.selected_slot = slot;
  }

  book_slot(slot) {

  }


}
