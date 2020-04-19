import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'parking-manage';

  parking_slots = [];
  selected_slot = [];

  ngOnInit() {
    this.parking_slots = [
      {
        "name" : "Slot 1",
        "Division" : "D1",
        "is_available" : "0"
      },
      {
        "name" : "Slot 2",
        "Division" : "D1",
        "is_available" : "1"
      },
      {
        "name" : "Slot 3",
        "Division" : "D1",
        "is_available" : "1"
      },
      {
        "name" : "Slot 4",
        "Division" : "D1",
        "is_available" : "0"
      }
    ];

    console.log(this.parking_slots[0]);
  }

  select_slot(slot) {
    this.selected_slot = slot;
  }


}
