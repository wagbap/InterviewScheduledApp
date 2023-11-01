import { Component, OnInit } from '@angular/core';
import { AppointmentService } from 'src/app/services/api-crud.service';
import { BehaviorSubject } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  selectedDUserId: string =''; 
  loggedUserId:  string =''; 

  constructor(private appointmentService: AppointmentService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    const loggedUserId = this.appointmentService.getLoggedUserType();

    if (loggedUserId !== '') {
      this.selectedDUserId = loggedUserId;
      console.log('logged UserType ID.'+this.selectedDUserId);
      
    } else {
      console.error('Unable to retrieve logged user ID.');
    }
  }

  }

