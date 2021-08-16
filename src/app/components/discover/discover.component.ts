import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FeedService } from 'src/app/services/feed.service';
import { DatePipe } from '@angular/common'
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {

  allFeeds: any[] = [];
  feedData: any[] = [];
  display = 'grid'
  expanded = false;
  searchFeed = '';
  public searchFilterCategory = '';
  categoryData: any[] = [];
  showRightsidebar = false

  selectedCategory: any[] = [];
  allCategory: string[] = [];

  userFeed:any="";

  constructor(
    private feedService: FeedService,
    public datepipe: DatePipe,
    private spinner: NgxSpinnerService,
    private dataTransferService: DataTransferService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.retrieveFeeds();
  }

  istToNormal(date: any) {
    let c_date = new Date();
    console.log(c_date);
    return this.datepipe.transform(date, 'yyyy-MM-dd');
  }

  openurl(url: any) {
    console.log(url);
    // window.location.href = url;
    window.open(url, "_blank");
  }

  retrieveFeeds() {
    this.spinner.show();
    this.feedService.getFeedData(this.searchFeed).subscribe((res: any) => {
      this.allFeeds = res.allFeeds;
      this.allCategory = res.feedCategory;
      this.categoryData = res.categoryFeeds;
      this.categoryChange();
      this.spinner.hide();
    });
  }

  categoryChange() {
    if (this.selectedCategory.length == 0) {
      this.feedData = this.allFeeds;
    } else {
      let categoryFeeds: any[] = [];
      this.selectedCategory.forEach((category: string) => {
        const categoryAllFeed = this.categoryData.filter((categoryFeed: any) => categoryFeed.feedCategory == category);
        categoryFeeds = categoryFeeds.concat(categoryAllFeed[0].feedItems);
      })
      const catSorted = categoryFeeds.sort((a: any, b: any) => ((new Date(b.pubDate).getTime()) - (new Date(a.pubDate).getTime())));
      this.feedData = catSorted.slice(0, (catSorted.length > 20 ? 20 : catSorted.length))
    }
  }

  getImageUrl(feedContent: string) {
    if (feedContent.startsWith("<a ")) {
      const cleanUrl = feedContent.substring(feedContent.indexOf("src=") + 5, feedContent.indexOf("/>") - 2);
      return cleanUrl;
    } else {
      return "https://picsum.photos/400/220";
    }
  }

  sharePost(feedData: any) {
    this.dataTransferService.postData = feedData.title + ' ' + feedData.link
    this.router.navigate([`socialmedia/publishing/newpost`]);
  }

  clearSelectCategory() {
    this.selectedCategory = [];
    var checkboxes = document.getElementsByName("select_check");
    for (var i = 0; i < checkboxes.length; i++) {
      let checking = checkboxes[i] as HTMLInputElement;
      checking.checked = false;
      if (i == checkboxes.length - 1) {
        this.categoryChange();
      }
    }
  }

  changeSelection() {
    this.selectedCategory = []
    var checkboxes = document.getElementsByName("select_check");
    for (var i = 0; i < checkboxes.length; i++) {
      let checking = checkboxes[i] as HTMLInputElement;
      if (checking.checked) {
        this.selectedCategory.push(checking.value)
      }
      if (i == checkboxes.length - 1) {
        this.categoryChange();
      }
    }
  }


  preventDropclosing(event: any) {
    event.stopPropagation();
  }

}
