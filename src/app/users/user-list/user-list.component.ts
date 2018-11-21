import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

import { UserService } from '../../user.service';

const URL = 'http://localhost:8080/api/SaveUser'

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  public uploader:FileUploader = new FileUploader({url: URL, itemAlias: 'profileImage'});
  modalRef: BsModalRef;
  user : User = new User();
  users : any;
  editUser : any;
  errorMsg : ErrorMsg = new ErrorMsg();
  id = {'id' : ''};

  constructor( private modalService: BsModalService, private userService : UserService ) { }

  ngOnInit() {
    this.getUser();
    //override the onAfterAddingfile property of the uploader so it doesn't authenticate with //credentials.
    this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
    //overide the onCompleteItem property of the uploader so we are 
    //able to deal with the server response.
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
          console.log("ImageUpload:uploaded:", item, status, response);
    };
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
    this.errorMsg.name = this.errorMsg.age = this.errorMsg.profileImage = '';
    !this.user.name ? this.errorMsg.name = 'Name required' : '';
    !this.user.age ? this.errorMsg.age = 'Age required' : '';
    !this.user.profileImage ? this.errorMsg.profileImage = 'Upload a picture' : '';
    if(!this.user.name || !this.user.age || !this.user.profileImage) {
      return;
    }

    this.uploader.onBuildItemForm = (fileItem:any, form:any) => {
      form.append('name', this.user.name);
      form.append('age', this.user.age);
    };
    this.uploader.uploadAll();

    // this.userService.post(this.user).subscribe(res => {
    //   this.getUser();
    //   this.modalRef.hide();
    //   console.log(res);
    // },error => {
    //   console.log(error)
    // });
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
  profileImage: string;
}

class ErrorMsg {
  name: string;
  age: string;
  profileImage: string;
}