import { Component, AfterViewInit, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ContentLibraryService } from 'src/app/services/content-library.service';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';
import { Lightbox, LightboxConfig } from 'ngx-lightbox';
import { base64ToBlob, blobToFile } from '../common/utility';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

export interface MediaFileData {
  checked: string;
  Key: string;
  LastModified: string;
  calcSize: string;
  Size: number;
  src: string;
  name: string;
  thumb: string;
}
@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  public instance: any;
  public mediaList!: any[];
  public mediaListOriginal!: any[];

  mediaDatasource!: MatTableDataSource<MediaFileData>;

  displayedColumns: string[] = ['checked', 'src', 'name', 'LastModified', 'Size', 'Options'];
  selection = new SelectionModel<MediaFileData>(true, []);


  @ViewChild(MatSort)
  sort!: MatSort;

  public displayType = 'list';
  public clickmedia: boolean = false;

  public singleDelete: boolean = true;

  public delete: boolean = false;
  public newpost: boolean = false;


  public searchModel = '';
  public searchQuery!: string | null;
  public mediaTypeFilter = '';
  public allCheck: boolean = true;


  buttonName = 'Select'
  selectAllModel = false;


  constructor(
    private toastr: ToastrService,
    public profileService: ProfileService,
    private spinner: NgxSpinnerService,
    private contentlibraryService: ContentLibraryService,
    private lightbox: Lightbox,
    private _lightboxConfig: LightboxConfig,
    private dataTransferService: DataTransferService,
    private router: Router,
    private changeDetectorRefs: ChangeDetectorRef) {
    _lightboxConfig.showImageNumberLabel = true;
  }

  ngOnInit(): void {
    this.initCanva();
    this.getMediaList();
    if(this.searchModel == '')
    {
      this.getMediaList();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.mediaDatasource.data.length;
    return numSelected === numRows;

  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.mediaDatasource.data.forEach(row => this.selection.select(row));


  }
  toggleRowCustom(media: any) {
    media.checked = !media.checked;
    this.selection.toggle(media);
    this.enable();
  }


  enable() {
    const mediaCount = this.mediaList?.filter((file: any) => !!file.checked);
    this.mediaList?.forEach(media => {
      if (mediaCount) {
        if (mediaCount.length >= 1) {
          this.delete = true;
          this.newpost = true;

        }
        if (mediaCount.length >= 5) {
          this.newpost = false;
        }
        if (mediaCount.length == 0) {
          this.delete = false;
          this.newpost = false;

        }

        if (mediaCount.length === this.mediaList?.length) {
          this.buttonName = 'Deselect';
          this.selectAllModel = true;

        } else {
          this.buttonName = 'Select';
          this.selectAllModel = false;
        }
      }
    })
  }

  selectAll() {
    this.mediaList?.forEach(media => {

      if (this.buttonName == 'Select') {
        media.checked = true;
        this.singleDelete = false;
        this.delete = true;
        if (!!this.mediaList && this.mediaList?.length <= 4) {
          this.newpost = true;
        } else {
          this.newpost = false;
        }
      } else {
        media.checked = false;
        this.delete = false;
        this.newpost = false;
        this.singleDelete = true;
      }
    });

    if (this.buttonName == 'Select') {

      this.selectAllModel = true;
      this.buttonName = 'Deselect';
    } else {

      this.selectAllModel = false;
      this.buttonName = 'Select';
    }

  }

  resetSearch() {
    if (!this.searchQuery || this.searchQuery == "") {
      this.searchModel = "";
      this.searchQuery = "";
    } else if (!!this.searchQuery && this.searchQuery != "") {
      this.getMediaList();
    }
  }

  editInLibrary(key: string) {
    this.dataTransferService.imageEditorFile = key;
    this.router.navigate([`socialmedia/creative/imageeditor`]);
  }

  open(index: number): void {
    // open lightbox
    if (this.mediaList) {
      this.lightbox.open(this.mediaList, index);
    }
  }

  close(): void {
    // close lightbox programmatically
    this.lightbox.close();
  }

  options() {
    this.clickmedia = true;
  }

  removeMedia(fileKey: string[]) {
    this.spinner.show()
    this.contentlibraryService.removeMedia(fileKey).subscribe(res => {
      console.log(res);
     // this.mediaList = this.mediaList?.filter((file: any) => file.fileKey != fileKey);
      this.getMediaList();
      this.toastr.info("Image deleted successfully")
      this.spinner.hide();
    })
  }

  deleteSelected() {
    const deleteKey = new Array<string>();
    this.mediaList?.forEach((mediaFile: any) => {
      if (mediaFile.checked) {
        deleteKey.push(mediaFile.Key);
      }
    });
    this.removeMedia(deleteKey);

  }

  filterImageExt(event: any) {
    console.log(event)
  }


  initCanva() {
    if (!(window as any).canvaApp) {
      (window as any).Canva.DesignButton.initialize({
        apiKey: 'BBVfWs7meS4eJB-BVGcRoGAZ',
      }).then((api: any) => {
        console.log(api);
        (window as any).canvaApp = api;
        // Use "api" object or save for later
      });
    }
  }

  createCanva(type: string, width: Number, height: Number) {
    console.log('create canvas')
    if (!!(window as any).canvaApp) {
      (window as any).canvaApp.createDesign({
        design: {
          type
        },
        onDesignOpen: (designId: any) => {
          console.log(designId);
          // Triggered when editor finishes loading and opens a new design.
          // You can save designId for future use.
        },
        onDesignPublish: (exportUrl: any, designId: any) => {
          const fileName = exportUrl.designTitle.replaceAll(' ', '');
          this.spinner.show();
          this.contentlibraryService.uploadImages('clib', 'jpeg', fileName).subscribe((res: any) => {
            var request = new XMLHttpRequest();
            request.open('GET', exportUrl.exportUrl, true);
            request.responseType = 'blob';
            request.onload = () => {
              var reader = new FileReader();
              reader.readAsDataURL(request.response);
              reader.onload = (e: any) => {
                const blob = base64ToBlob(e.target.result);
                this.contentlibraryService.uploadActualImage(res.data, blobToFile(blob, 'testFile.jpeg')).subscribe(uploadres => {
                  if (uploadres && uploadres.message && uploadres.message == '100') {
                    this.getMediaList();
                    this.spinner.hide();
                    this.toastr.success('Template imported successfully');
                  }

                });
              };
            };
            request.send();
          });
        },
        onDesignClose: () => {
          console.log('canva designer is closed');
          // Triggered when editor is closed.
        },
      });
    }
  }

  /* searchLibrary() {
    this.searchQuery = this.searchModel === '' ? null : this.searchModel;
    this.getMediaList(this.searchQuery,
      (this.mediaTypeFilter === '' ? null : this.mediaTypeFilter));
  } */

  searchLibrary() {
    this.searchQuery = this.searchModel === '' ? null : this.searchModel;
    if (!!this.searchQuery) {
      this.mediaList = this.mediaListOriginal.filter((mediaItems: any) => mediaItems.Key.split("/")[2].toLowerCase().indexOf(this.searchModel.toLowerCase()) !== -1)
      this.mediaDatasource = new MatTableDataSource(this.mediaList);
      this.applyFileFilter();
      setTimeout(() => {
        this.mediaDatasource.sort = this.sort;
      });
    } else {
      this.mediaList = this.mediaListOriginal;
      this.mediaDatasource = new MatTableDataSource(this.mediaList);
      this.applyFileFilter();
      setTimeout(() => {
        this.mediaDatasource.sort = this.sort;
      });
      this.searchQuery = '';
    }

  }

  getMediaList(searchQuery: any = null, filterQuery: any = null) {
    this.spinner.show();
    this.contentlibraryService.retrieveImages('clib', searchQuery, filterQuery).subscribe(res => {
      this.mediaList = res.data;
      this.mediaListOriginal = res.data;
      this.mediaList?.forEach((mediaFile: MediaFileData) => {
        //mediaFile.src = `https://dhuhkrmpnuqm.cloudfront.net/${mediaFile.Key}`;
        //mediaFile.thumb = `https://dhuhkrmpnuqm.cloudfront.net/${mediaFile.Key}`;
        mediaFile.src = `https://aikyne-mediafiles.s3.ap-south-1.amazonaws.com/${mediaFile.Key}`;
        mediaFile.thumb = `https://aikyne-mediafiles.s3.ap-south-1.amazonaws.com/${mediaFile.Key}`;
        const calcSize = (Math.round((mediaFile.Size / (1e+6)) * 100) / 100);
        if (calcSize < 1) {
          mediaFile.calcSize = (Math.round((mediaFile.Size / (1e+3)) * 100) / 100) + 'kB';
        } else {
          mediaFile.calcSize = calcSize + 'MB';
        }
        mediaFile.name = mediaFile.Key.split('/')[2];
        this.selectAllModel = false;
      });

      if (!searchQuery) {
        this.searchModel = "";
        this.searchQuery = "";
      }
      this.mediaDatasource = new MatTableDataSource(this.mediaList);
      setTimeout(() => {
        this.mediaDatasource.sort = this.sort;
      });

      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      console.log('error retrieving user images ');
    });
  }

  uploadImage($event: any) {
    this.spinner.show()
    let uploadedFileCount = 0;
    for (const droppedFile of $event.target.files) {
    if (this.isFileSizeAllowed(droppedFile.size)) {
      let fileName = '';
      if (droppedFile.name && droppedFile.name.split('.').length > 1) {
        const fileNameSplit = droppedFile.name.split('.');
        fileName = fileNameSplit[fileNameSplit.length - 2]
      }
      const fileExt = droppedFile.name.split('.').pop() || '';
      if (['jpeg', 'jpg', 'png'].indexOf(fileExt.toLocaleLowerCase()) === -1) {
        this.toastr.error('Incorrect file format. Upload only JPEG or PNG images');
        this.spinner.hide();
        return;
      }
      this.contentlibraryService.uploadImages('clib', fileExt, fileName).subscribe((res: any) => {
        this.contentlibraryService.uploadActualImage(res.data, droppedFile).subscribe(uploadres => {
          if (uploadres && uploadres.message && uploadres.message == '100') {
            uploadedFileCount = uploadedFileCount + 1;
            if(uploadedFileCount == $event.target.files.length) {
              setTimeout(() => { this.getMediaList(); }, 500);
              this.spinner.hide();
            }
          }
        });
      });
    }
    else {
      this.toastr.error("Select image less than 5MB")
    }
    }
  }

  isFileSizeAllowed(size: number) {
    let isFileSizeAllowed = false;
    if (size < 5000000) {
      isFileSizeAllowed = true;
    }
    return isFileSizeAllowed;
  }

  applyFileFilter() {
    this.mediaDatasource.filter = this.mediaTypeFilter;
  }

  createPost() {
    const mediaCount = this.mediaList?.filter((file: any) => !!file.checked);
    const mediaData: any[] = [];
    mediaCount.forEach((media: any) => {
      mediaData.push(
        {
          'fileDisplayName': media.name,
          'progressStatus': 'Done',
          'fileKey': media.name,
          'fileUrl': media.src,
        });
    });

    this.dataTransferService.mediaList = mediaData;
    this.router.navigate([`socialmedia/publishing/newpost`]);
  }

}
