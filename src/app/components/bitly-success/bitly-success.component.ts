import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BitlyAKService } from 'src/app/services/socialmedia/bitly.ak.service';

@Component({
  selector: 'app-bitly-success',
  templateUrl: './bitly-success.component.html',
  styleUrls: ['./bitly-success.component.scss']
})
export class BitlySuccessComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private bitlyService: BitlyAKService
  ) { }

  ngOnInit(): void {
    const firstParam: string = this.route.snapshot.queryParamMap.get('code') || '';
    if (firstParam) {
      this.bitlyService.generateAcessToken(firstParam).subscribe((response: any) => {
        // window.opener?.postMessage({ origin: 'bitly', response }, location.origin);
         //window.close();
      },(error:any)=>{
        console.log(error)
        window.close();
      })
    }
  }
}