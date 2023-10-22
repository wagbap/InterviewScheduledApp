import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppointmentService } from '../../appointment.service';
import { UserModel } from '../../user.model';

@Component({
    selector: 'app-appointment-edit',
    templateUrl: './appointment-edit.component.html',
    styleUrls: ['./appointment-edit.component.css']
})
export class AppointmentEditComponent implements OnInit {
    doctor: UserModel = new UserModel();

    constructor(private appointmentService: AppointmentService, private toastr: ToastrService) { }

    ngOnInit() {
        this.resetForm();
    }

    resetForm(form?: NgForm) {
        if (form != null) {
            form.resetForm();
        }
        this.doctor = new UserModel();
    }

    onSubmit(form: NgForm) {
        if (form.valid) {  // Ensures the form is valid before submission
            if (this.doctor && !this.doctor.userId) { // Assume `userId` determines new doctor or existing
                this.appointmentService.registerDoctor(this.doctor)
                    .subscribe(
                        data => {
                            this.resetForm(form);
                            this.toastr.success('New Record Added Successfully', 'Doctor Register');
                        },
                        error => {
                            this.toastr.error('Error occurred while saving', 'Doctor Register');
                        }
                    );
            }
        } else {
            this.toastr.warning('Please fill in all required fields', 'Doctor Register');
        }
    }
}
