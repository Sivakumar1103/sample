import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {

  constructor() { }

  // Placeholder for transmitting the image file name from library to image editor component
  public imageEditorFile = '';

  public userEmail = '';

  // used to transfer selected images from library to post creation
  public mediaList: any[] = [];

  public postData: string = '';

  // used to transfer date from calendar for new post creation
  public scheduleDate: string = '';

  // used for transfer of socialMedia from calendar to published post
  public socialMedia: string = '';


}
