import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup , AbstractControl, Validators, FormControl} from '@angular/forms';
import { SocialDropDown, SocialProfile } from 'src/app/model/socialProfile';
import { ManageaccountService } from 'src/app/services/manageaccount.service';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addmember',
  templateUrl: './addmember.component.html',
  styleUrls: ['./addmember.component.scss']
})
export class AddmemberComponent implements OnInit {

  login: FormGroup;
  public delete: boolean = false;
  
  userSocialProfile: SocialProfile | undefined;
  
  public dropdownList: SocialDropDown[] = [];
  emailRegex ='';

  constructor(
    public profileService: ProfileService,
    private manageaccountService: ManageaccountService,
    private fb: FormBuilder,
    private toastr: ToastrService) {
      this.login = new FormGroup({
        firstname: new FormControl (''),
        lastname: new FormControl (''),
        email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      });
    }
    
    
  

    dynamicArray = [] as any;  
    newDynamic: any = {};  
    ngOnInit(): void {  
        this.newDynamic = 
        { firstname: "",lastname: "",email: "" };  
        this.dynamicArray.push(this.newDynamic);  
 
    }  

    
    OnSubmit() {
      if (this.login.valid) {
        return this.login.value;

      }
    }

    addRow() {    
      if(this.login.invalid)
      {
        this.toastr.error('All rows must be added','Empty rows')
        
        
      }
      else if(!this.login.invalid)
      {
        this.newDynamic = {firstname: "", lastname: "",email:""};  
        this.dynamicArray.push(this.newDynamic);  
        this.toastr.success('New row added successfully', 'New Row');  
        console.log(this.dynamicArray);  
        
      }  
    }  
      
    deleteRow(index: any) {  
      if(this.dynamicArray.length == 1) {  
        this.toastr.error("Can't delete the row when there is only one row", 'Warning');  
          return false;  
      } else {  
          this.dynamicArray.splice(index, 1);  
          this.toastr.warning('Row deleted successfully', 'Delete row');  
          return true;  
      }  
        
    }  

  retrieveSocialMediProfile() {
    if (this.manageaccountService.userSocialProfile.email) {
      this.userSocialProfile = this.manageaccountService.userSocialProfile;
      this.processSocialDropdown();
    } else {
      this.manageaccountService.retrieveSocialMediaProfile().subscribe(res => {
        this.userSocialProfile = res.data as SocialProfile;
        this.manageaccountService.userSocialProfile = res.data as SocialProfile;
        this.processSocialDropdown();
      });
    }
  }



  processSocialDropdown() {
    this.dropdownList = [];
    this.userSocialProfile?.socialMedia?.forEach(scMedia => {
      if (scMedia.name == 'facebook') {
        scMedia.fbpages?.forEach(fbpage => {
          this.dropdownList.push({ socialId: `facebook-${scMedia.userId}-${fbpage.id}`, socialName: fbpage.name });
        });
      } else if (scMedia.name == 'twitter') {
        this.dropdownList.push({ socialId: `twitter-${scMedia.userId}`, socialName: scMedia.screenName });
      }
    })
  }

  

}
