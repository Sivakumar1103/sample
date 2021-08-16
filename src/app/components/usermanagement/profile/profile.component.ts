import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators,ValidationErrors, FormBuilder, AbstractControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import{MatAccordion} from '@angular/material/expansion';

import { User } from 'src/app/model/user';
import { ManageaccountService } from 'src/app/services/manageaccount.service';

import { AuthService } from 'src/app/services/usermanagement/auth.service';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';
import { CountryCode } from 'postcode-validator';
import { SearchCountryField,  CountryISO } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  public input: boolean = false;

	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
	phoneForm = new FormGroup({
		phone: new FormControl(undefined, [Validators.required])
	});
  public submitted: boolean = false;
  changePreferredCountries() {
		this.preferredCountries = [CountryISO.India, CountryISO.Canada];
	}

  onSubmit(){
    this.submitted=true;

    if(this.phoneForm.valid){
      this.submitted=false;
    }
  }

  reset(){
    this.phoneForm.reset();
    this.submitted = false;
  }



  update: FormGroup;
  userData!: User;
  userId = '';
  formBuilder: any;

  constructor(private auth: AuthService,
    //public settings_form : FormGroup,
    private profileService: ProfileService,
    private spinner: NgxSpinnerService,
    private title : Title,
    private toastr: ToastrService,
    private manageaccountService: ManageaccountService) {
    this.update = new FormGroup
      ({
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        bio: new FormControl('', Validators.required),
        initials: new FormControl(''),
        email: new FormControl('', Validators.required),
        phone: new FormControl('', Validators.required),
        compname: new FormControl('', Validators.required),
        jobTitle: new FormControl('', Validators.required),
        time: new FormControl('', Validators.required),
        address1: new FormControl('', Validators.required),
        address2: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        zip: new FormControl('', Validators.required),
        website: new FormControl('', Validators.required),
        facebook: new FormControl('', Validators.required),
        twitter: new FormControl('', Validators.required),
        instagram: new FormControl('', Validators.required),
        lang: new FormControl('', Validators.required),
        retail: new FormControl('', Validators.required),
        timezone: new FormControl('', Validators.required),
        translang: new FormControl('', Validators.required),
        applang: new FormControl('', Validators.required),
        storeemail: new FormControl('', Validators.required),
        dateformat: new FormControl('', Validators.required),
        numformat: new FormControl('', Validators.required),
        timeformat: new FormControl('', Validators.required),
        distformat: new FormControl('', Validators.required),
        FDOW: new FormControl('', Validators.required)
      });
    this.update.controls['email'].disable();
    this.update.controls['state'].disable();
    this.update.controls['country'].disable();
    this.update.controls['lang'].disable();
    this.update.controls['retail'].disable();
    this.update.controls['timezone'].disable();
    }


  ngOnInit(): void {
    this.spinner.show();
    this.profileService.retrieveUserProfile().subscribe(res => {
      this.profileService.userData = res.data;
      this.userData = res.data;
      this.update.patchValue(res.data)
      this.update.patchValue(res.data.appPreference)
      this.update.patchValue(res.data.account)
      this.spinner.hide();
    });
  }

  selectedCountry: String = "Select your country";
  Countries: Array<any> = [
    { name: 'India', states: [ {name:'Andhra Pradesh'}, {name:'Arunachal Pradesh'},{name:'Assam'},{name:'Andaman and Nicobar Island'},{name:'Arunachal Pradesh'},{name:'Bihar'},{name:'Chhattisgarh'},{name:'Goa'},{name:'Gujarat'},{name:'Haryana'},{name:'Himachal Pradesh'},{name:'Jharkand'},{name:'Karnataka'},{name:'Kerala'},{name:'Madhya Pradesh'},{name:'Maharastra'},{name:'Maharastra'},{name:'Manipur'},{name:'Meghalaya'},{name:'Mizoram'},{name:'Nagaland'},{name:'Odisha'},{name:'Punjab'},{name:'Puducherry'},{name:'Rajasthan'},{name:'Sikkim'},{name:'Tamil Nadu'},{name:'Telangana'},{name:'Tripura'},{name:'Uttar Pradesh'},{name:'Uttarakhand'}
   ]},
   {name: 'Germany', states:[{name:'Berlin'}]},

  ]
  states: Array<any> = [];
  cities: Array<any> = [];
  changeCountry(country: any){
    this.states = this.Countries.find((cntry: any) => cntry.name == country.target.value).states;
  }
  //changeState(state: any){
    //this.cities = this.Countries.find((cntry: any) => cntry.name == this.selectedCountry).states.find((stat: any) => stat.name == state.target.value).cities;

  //zipcodes(controls: FormControl){
    //if(this.zip.indexOf(controls.value)!==-1){
     // return{'nameisnotallowed': true }
   // }
   // return null;

  //}

  editEnable()
  {
    this.input = true;
    this.update.controls['state'].enable();
    this.update.controls['country'].enable();
    this.update.controls['lang'].enable();
    this.update.controls['retail'].enable();
    this.update.controls['timezone'].enable();
  }

  editUser() {
    this.spinner.show();
    this.auth.updateUser(this.update.getRawValue())
      .subscribe(
        res => {
          console.log(res);
          this.profileService.retrieveUserProfile().subscribe(res => {
            this.profileService.userData = res.data;
            this.spinner.hide();
            this.toastr.success('User Profile successfully updated');
            this.submitted=true;
            this.input = false;
            this.update.controls['state'].disable();
            this.update.controls['country'].disable();
            this.update.controls['lang'].disable();
            this.update.controls['retail'].disable();
            this.update.controls['timezone'].disable();

    if(this.phoneForm.valid){
      this.submitted=false;
    }
          });

        },
        err => {
          console.log(err)
          this.spinner.hide();
          this.toastr.error('User Profile cannot be updated')
        }
      )
  }
  onCountrychange(value: any){
    console.log(value)
  }
  onCountryChange(event:any){
    console.log(event.dialCode);
    console.log(event.name)
     }

}
