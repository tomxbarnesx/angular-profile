import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { UserService } from '../../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  modalRef: BsModalRef;
  user : User = new User();
  users : any;
  editUser : any;
  errorMsg : ErrorMsg = new ErrorMsg();
  id = {'id' : ''};

  constructor( private modalService: BsModalService, private userService : UserService ) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userService.get().subscribe(res => {
      this.users = res;
      console.log(this.users);
    }, error => {
      console.log(error);
      });
  }

  onSave() {
    this.errorMsg.name = this.errorMsg.age = '';
    !this.user.name ? this.errorMsg.name = 'Name required' : '';
    !this.user.age ? this.errorMsg.age = 'Age required' : '';
    if(!this.user.name || !this.user.age) {
      return;
    }

    this.userService.post(this.user).subscribe(res => {
      this.getUser();
      this.modalRef.hide();
      console.log(res);
    },error => {
      console.log(error)
    });
  }

  onUpdate() {
    this.userService.update(this.editUser).subscribe(res => {
      this.getUser();
      this.modalRef.hide();
      console.log(res);
    },error => {
      console.log(error);
    })
  }

  deleteUser() {
    this.userService.delete(this.id).subscribe(res => {
      this.getUser();
      this.modalRef.hide();
    },error => {
      console.log(error);
    })
  }

  openModalDelete(template: TemplateRef<any>, id){
    this.id.id = id;
    this.modalRef = this.modalService.show(template);
  }

  openModalAdd(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  openModalEdit(template: TemplateRef<any>, user){
    this.modalRef = this.modalService.show(template);
    this.editUser = user;
  }

}

class User {
  name: string;
  age: string;
}

class ErrorMsg {
  name: string;
  age: string;
}