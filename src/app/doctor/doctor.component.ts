import {AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Doctor, DoctorService} from '../services/doctor.service';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css',
  providers: [ConfirmationService, MessageService]
})
export class DoctorComponent implements OnInit {

  public name: string | undefined = "";
  public doctors: Doctor[] = [];
  public currentDoctor: Doctor = {} as Doctor;
  public displayDialog = false;

  constructor(public doctorService: DoctorService, private confirmationService: ConfirmationService, private messageService: MessageService) {
  }

  showDialog() {
    this.displayDialog = true;
  }

  async saveCurrentDoctor() {
    if (this.currentDoctor.id) {
      this.currentDoctor = await this.doctorService.updateDoctor(this.currentDoctor)
    } else {
      this.currentDoctor = await this.doctorService.saveDoctor(this.currentDoctor)
    }
    this.doctors = await this.doctorService.getDoctors()
  }

  async ngOnInit() {
    this.doctors = await this.doctorService.getDoctors()
  }

  createNewDoctor() {
    this.currentDoctor={} as Doctor
  }

  async removeDoctor(doctor: Doctor) {
    await this.doctorService.removeDoctor(doctor.id)
    this.doctors = await this.doctorService.getDoctors()
  }

  confirm(doctor:Doctor) {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: 'Please confirm to proceed moving forward.',
      acceptIcon: 'pi pi-check mr-2',
      rejectIcon: 'pi pi-times mr-2',
      rejectButtonStyleClass: 'p-button-sm',
      acceptButtonStyleClass: 'p-button-outlined p-button-sm',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        this.removeDoctor(doctor)
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }
}
