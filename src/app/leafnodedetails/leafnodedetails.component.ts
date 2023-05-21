import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-leaf-node-details',
  templateUrl: './leafnodedetails.component.html',
  styleUrls: ['./leafnodedetails.component.css']
})
export class LeafnodedetailsComponent implements OnInit {
  text!: string;
  cluster!: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.cluster = this.route.snapshot.queryParams['cluster'];
    this.text = this.route.snapshot.paramMap.get('text') || '';

    }
  }
