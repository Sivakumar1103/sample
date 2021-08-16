import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ContentLibraryService } from 'src/app/services/content-library.service';
import { DataTransferService } from 'src/app/services/data-transfer.service';

@Component({
  selector: 'app-contentlibrary',
  templateUrl: './contentlibrary.component.html',
  styleUrls: ['./contentlibrary.component.scss']
})
export class ContentlibraryComponent implements OnInit {

  public mediaList: any[] | undefined;
  public publish: boolean = false;
  public selectedMedia: any[] | undefined;

  constructor(
    private contentlibraryService: ContentLibraryService,
    public modal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.getMediaList();
  }

  selectMediaItem() {
    this.selectedMedia = this.mediaList?.filter((file: any) => !!file.checked);
    if(this.selectedMedia)
    {
      if(this.selectedMedia.length > 4)
      {
        this.toastr.info("Please select a maximum of 4 images")
      }
    }
    this.mediaList?.forEach(media => {
      if (this.selectedMedia) {
        if (this.selectedMedia.length <= 4) {
          this.publish = true;
        }
        if (this.selectedMedia.length > 4) {
          this.publish = false;
          
        }
      }
    })
  }


  getMediaList() {
    this.spinner.show();
    this.contentlibraryService.retrieveImages('clib').subscribe(res => {
      console.log(res);
      this.spinner.hide();
      this.mediaList = res.data;
    }, (err) => {
      this.spinner.hide();
      this.modal.close();
    });

  }
}
