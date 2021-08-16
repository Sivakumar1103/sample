import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ContentLibraryService } from 'src/app/services/content-library.service';
import ImageEditor from 'tui-image-editor';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { base64ToBlob, blobToFile } from '../../common/utility';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SaveImageEditComponent } from '../../dialog/save-image-edit/save-image-edit.component';
import { ContentlibraryComponent } from '../../dialog/contentlibrary/contentlibrary.component';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-newtemplate',
  templateUrl: './newtemplate.component.html',
  styleUrls: ['./newtemplate.component.scss']
})
export class NewtemplateComponent implements OnInit {
  isDeactive:boolean=true;
  canDeactivate(): Observable<boolean> | boolean {
   
    return this.isDeactive;
  }

  @ViewChild('tuiImageEditor', { static: true })
  tuiImageEditor!: ElementRef;

  public openText: boolean = false;
  public instance: any;
  public filterApplied: string = '';
  public mediaList: any[] | undefined;
  activatedObjectId = '';
  rImageType = /data:(image\/.+);base64,/;
  textColor = '#000000';
  enableUndo = false;
  enableRedo = false;
  textFontSize = 48;
  showCropApply = false;
  brightnessSliderValue = 100;
  editFileName = '';
  selectedImageClass = '';
  selectedImageName = '';
  src = "../../../../assets/img/natural.jpg"

  constructor(
    private contentlibraryService: ContentLibraryService,
    private spinner: NgxSpinnerService,
    private dataTransferService: DataTransferService,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.instance = new ImageEditor(this.tuiImageEditor.nativeElement, {
      cssMaxWidth: 900,
      cssMaxHeight: 550,
      selectionStyle: {
        cornerSize: 20,
        rotatingPointOffset: 70,
      },
    });

    this.instance.on('mousedown', (event: any, originPointer: any) => {
      this.openText = false;
    });

    this.instance.on('textEditing', () => {
      setTimeout(() => {
        this.openText = true;
      });
    });

    this.instance.on('objectActivated', (props: any) => {
      setTimeout(() => {
        if (props.type == 'i-text') {
          this.openText = true;
          this.activatedObjectId = props.id;
          this.textColor = props.fill;
          this.textFontSize = props.fontSize
        }
      }, 100)
    });

    this.instance.on('undoStackChanged', (length: any) => {
      if (length) {
        this.enableUndo = true;
      } else {
        this.enableUndo = false;
      }
    });

    this.instance.on('redoStackChanged', (length: any) => {
      if (length) {
        this.enableRedo = true;
      } else {
        this.enableRedo = false;
      }
    });
    this.getMediaList();
  }

  undo() {
    this.instance.undo();
  }

  redo() {
    this.instance.redo();
  }

  resetfilter() {
    if (this.filterApplied !== '') {
      this.instance.removeFilter(this.filterApplied).then((obj: any) => {
        this.filterApplied = '';
        this.selectedImageName = 'None';
        this.selectedImageClass = 'circleFilter';
      }).catch((message: any) => {
        console.log('error: ', message);
      });
    }
  }

  cropInsta() {
    this.instance.startDrawingMode('CROPPER');
    this.instance.setCropzoneRect(5 / 4);
    this.showCropApply = true;
  }

  cropFacebook() {
    this.instance.startDrawingMode('CROPPER');
    this.instance.setCropzoneRect(16 / 9);
    this.showCropApply = true;
  }

  applyCrop() {
    this.isDeactive = false;
    this.instance.crop(this.instance.getCropzoneRect()).then((obj: any) => {
      this.showCropApply = false;
      this.instance.stopDrawingMode();
    }).catch((message: any) => {
      console.log('error: ', message);
    });
  }

  applyBrightness() {
    this.isDeactive = false;
    this.instance.applyFilter('brightness', {
      brightness: this.brightnessSliderValue / 255,
    }).then((result: any) => { });
  }

  resetBrightness() {
    this.brightnessSliderValue = 0;
    this.instance.applyFilter('brightness', {
      brightness: 0,
    }).then((result: any) => { });
  }

  cancelCrop() {
    this.showCropApply = false;
    this.instance.stopDrawingMode();
  }

  applyFilter(className: string, filterName: string) {
    this.selectedImageName = filterName;
    this.selectedImageClass = className;
    if (this.filterApplied === '') {
      this.filterApplied = filterName
      this.instance.applyFilter(filterName);
    } else {
      this.instance.removeFilter(this.filterApplied).then((obj: any) => {
        this.filterApplied = filterName
        this.instance.applyFilter(filterName);
      }).catch((message: any) => {
        console.log('error: ', message);
      });
    }
    this.isDeactive = false;
  }


  getMediaList() {
    this.spinner.show();
    this.contentlibraryService.retrieveImages('clib').subscribe(res => {
      this.spinner.hide();
      this.mediaList = res.data;
      if (this.dataTransferService.imageEditorFile !== '') {
        const idx = this.mediaList?.findIndex((element) => element.Key == this.dataTransferService.imageEditorFile) || 0;
        this.loadImageIntoEditor(this.dataTransferService.imageEditorFile, this.dataTransferService.imageEditorFile, idx);
        this.dataTransferService.imageEditorFile = '';
      } else if (this.mediaList && this.mediaList.length > 0) {
        this.loadImageIntoEditor(this.mediaList[0].Key, this.mediaList[0].Key, 0);
      }
    }, (err) => {
      console.log('error retrieving user images ');
      this.spinner.hide();
    });
  }

  loadImageIntoEditor(imgKey: string, fileName: string, idx: number) {
    this.spinner.show();
    const splitFileName = (fileName.split("/").pop() || 'MediaFile').split('.');
    this.editFileName = splitFileName[splitFileName.length - 2];
     const imgUrl = `https://dhuhkrmpnuqm.cloudfront.net/${imgKey}`;
     //const imgUrl = `https://aikyne-mediafiles.s3.ap-south-1.amazonaws.com/${imgKey}`;

    if (this.mediaList) {
      this.mediaList.forEach((media: any) => {
        media.checked = false;
      });
      (this.mediaList[idx]).checked = true;
    }
    this.selectedImageName = 'None';
    this.selectedImageClass = 'circleFilter';

    this.instance.loadImageFromURL(imgUrl, this.editFileName)
      .then((sizeValue: any) => {
        this.spinner.hide();
        this.instance.clearUndoStack();
        this.filterApplied = '';
        this.textColor = '#000000';
        this.textFontSize = 32;
      });
  }


  uploadImage($event: any) {
    this.spinner.show();
    let uploadedFileCount = 0;
    for (const file of $event.target.files) {
      const fileExt = file.name.split('.').pop() || '';
      if (['jpeg', 'jpg', 'png'].indexOf(fileExt.toLocaleLowerCase()) === -1) {
        this.toastr.error('Incorrect file format. Upload only JPEG or PNG images');
      } else {

        let fileName = '';
        if (file.name && file.name.split('.').length > 1) {
          const fileNameSplit = file.name.split('.');
          fileName = fileNameSplit[fileNameSplit.length - 2]
        }

        this.contentlibraryService.uploadImages('clib', fileExt, fileName).subscribe((res: any) => {
          this.contentlibraryService.uploadActualImage(res.data, file).subscribe(uploadres => {
            if (uploadres && uploadres.message && uploadres.message == '100') {
              uploadedFileCount = uploadedFileCount + 1;
              if (uploadedFileCount == $event.target.files.length) {
                setTimeout(() => { this.getMediaList(); }, 500);
                this.spinner.hide();
              }
            }
          });
        });
      }

    }
  }
  addlogo($event: any){
    let file = $event.target.files[0];
    if (file) {
      let img = URL.createObjectURL(file);

      // this.instance.loadImageFromURL(this.instance.toDataURL(), 'FilterImage');

      this.instance.addImageObject(img).then((obj:any)=>{
          console.log("ok");
        
        })
      }
    
  }
  addText() {
    this.instance.addText('Your Text Here', {
      position: {
        x: 50, y: 10
      },
      styles: {
        fill: '#000',
      },
      fontSize:48
    }).then((objectProps: any) => {
      console.log(objectProps);
      this.openText = true;
      this.activatedObjectId = objectProps.id;
      this.textColor = objectProps.fill;
      this.textFontSize = objectProps.fontSize
    });
    this.isDeactive = false;
  }

  closeText() {
    this.openText = false;
  }

  downloadLocal() {
    let imageName = this.editFileName;
    const dataURL = this.instance.toDataURL();
    var blob, type;
    blob = base64ToBlob(dataURL);
    type = blob.type.split('/')[1];
    if (imageName.split('.').pop() !== type) {
      imageName += '.' + type;
    }
    saveAs(blob, imageName); // eslint-disable-line
  }

  saveLibrary() {
    const modalRef = this.modalService.open(SaveImageEditComponent, { backdropClass: 'in', windowClass: 'in' });
    modalRef.componentInstance.messageData = {
      fileName: this.editFileName,
      fileExt: 'jpeg'
    };

    modalRef.result
      .then((updatedData) => {
        if (updatedData) {
          this.spinner.show();
          this.contentlibraryService.uploadImages('clib', updatedData.fileExt, updatedData.fileName).subscribe((res: any) => {
            const dataURL = this.instance.toDataURL();
            const blob = base64ToBlob(dataURL);
            this.contentlibraryService.uploadActualImage(res.data, blobToFile(blob, `${this.editFileName}.jpeg`)).subscribe(uploadres => {
              if (uploadres && uploadres.message && uploadres.message == '100') {
                this.spinner.hide();
                this.getMediaList();
                this.isDeactive = true;
              }
            });
          });
        }
      }).catch(() => { });
  }



  openContentLibraryDialog() {
    const modalRef = this.modalService.open(ContentlibraryComponent, { backdropClass: 'in', windowClass: 'in', size: 'xl', centered: true });
    modalRef.result
      .then((selectedImage: any) => {
        if (selectedImage) {
          this.instance.addImageObject(selectedImage.url).then((objectProps: any) => { });
        }
      })
      .catch(() => { });
  }

  changeTextColor() {
    this.instance.changeTextStyle(this.activatedObjectId, {
      fill: this.textColor,
    });
  }
  changeFontSize() {
    this.instance.changeTextStyle(this.activatedObjectId, {
      fontSize: this.textFontSize,
    });
  }


}
