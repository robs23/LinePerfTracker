import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as secrets from '../secrets';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.css']
})
export class MediaPlayerComponent implements OnInit {
  link: string;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getVideo();
  }

  getVideo(): void{
    const name = this.route.snapshot.paramMap.get('name');
    this.link =  secrets.JdeScanApiAddress + "Files/" + name;
  }

}
