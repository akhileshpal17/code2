import { Component, OnInit, Input,Injectable, Injector, NgZone, ViewChild, ElementRef } from '@angular/core';
import { DataService } from 'src/app/data.service';
import * as d3 from 'd3';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
  data: any = {};
  levelsToShow: number = 0;

  constructor(dataService: DataService, private router: Router , private route: ActivatedRoute,private injector: Injector) {
    this.data = dataService.getData();

  }

  ngOnInit(): void
  {



  const root: any = d3.hierarchy(this.data);
  const depth = root.height +1;

const width = 800;
const height = 800;
const dy = 100
const dx = 60
const tree = d3.tree().nodeSize([dx, dy])
const diagonal = d3.linkVertical().x((d:any)=> d.x).y((d:any) => d.y)
const margin = ({top: 10, right: 120, bottom: 10, left: 200})
root.x0 = 0;
root.y0 = dx / 2;
console.log(root.descendants())
root.descendants().forEach((d:any, i: any) => {
    d.id = i;
    d._children = d.children;
  if (d.depth==0) d.children = null;
});


console.log(root.descendants())


const svg = d3
     .select('body')
     .append('svg')
    .attr("viewBox", [-margin.left-100, -margin.top-100, height, dx])
    .style("font", "8px sans-serif")
    .style("user-select", "none");

const gLink = svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "#559")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width",1.5);

const gNode = svg.append("g")
    .attr("cursor", "pointer")
    .attr("pointer-events", "all");

  //collapsable node function

    function collapse(node:any) {
      if (node.children) { // Expanded
          node.children = null;
          node._children.forEach(collapse)
      }
  }


  const levelOptions = [0, 1, 2, 3, 4]; // Options for levels to show

  // Handle level selection change
  const onLevelSelectChange = (event: any) => {
    this.levelsToShow = parseInt(event.target.value, 10); // Update levelsToShow value
    update(root); // Update tree visualization with new levels to show
  };

  // Create level select dropdown
  const levelSelect = d3.select('body').append('div').attr('id','levelSelect').style('margin', '10px');
  levelSelect
    .append('label')

    .text('Levels to Show:')
    .append('select')
    .on('change', onLevelSelectChange)
    .selectAll('option')
    .data(levelOptions)
    .enter()
    .append('option')
    .attr('value', (d: number) => d)
    .text((d: number) => (d === 0 ? 'All' : `Level ${d}`));



























  //div decleration

  const div = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("position", "absolute")
  .style("pointer-events", "none")
  .style("background-color", "rgba(0, 0, 0, 0.8)")
  .style("color", "#fff")
  .style("padding", "8px")
  .style("font-size", "12px");

// color option for links and nodes
function onColorSelect() {
  const nodeColorSelect = document.getElementById('node-color-select') as HTMLSelectElement;
  const linkColorSelect = document.getElementById('link-color-select') as HTMLSelectElement;
  const textColorSelect = document.getElementById('text-color-select') as HTMLSelectElement;
  const nodeColor = nodeColorSelect.value;
  const linkColor = linkColorSelect.value;
  const textColor=textColorSelect.value;

  // Update node color
  svg.selectAll('circle')
    .attr('fill', nodeColor);

  // Update link color
  gLink.selectAll('path')
    .attr('stroke', linkColor);

   svg.selectAll('text')
   .attr('fill',textColor);
}
const nodeColorSelect = document.getElementById('node-color-select') as HTMLSelectElement;
const linkColorSelect = document.getElementById('link-color-select') as HTMLSelectElement;
const textColorSelect = document.getElementById('text-color-select') as HTMLSelectElement;

nodeColorSelect.addEventListener('change', onColorSelect);
linkColorSelect.addEventListener('change', onColorSelect);
textColorSelect.addEventListener('change', onColorSelect);







    const update = (source:any) => {
    const duration = 250;
    // const nodes = root.descendants().reverse();
    // const links = root.links();


    // Compute the new tree layout.
    //tree(root);
    const treeLayout = tree(root);
      const nodes = root.descendants().filter((d: any) => d.depth <= this.levelsToShow);
      const links = root.links().filter((d: any) => d.target.depth <= this.levelsToShow);

    let left = root;
    let right = root;
    root.eachBefore((node:any) => {
    if (node.y < left.y) left = node;
    if (node.y > right.y) right = node;
    });

    const height = right.y - left.y + margin.top + margin.bottom;

    const transition = svg.transition()
        .duration(duration)
        .attr("viewBox", [-margin.left, left.x - margin.top, width, height] as any)


    // Update the nodes…
    const node = gNode.selectAll("g")
    .data(nodes, (d:any) => d.id)





    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", (d:any) => `translate(${source.x0},${source.y0})`)
        .on("click", (event: any, d: any) => {
          // Check if the node is a leaf node
          if (!d.children && !d._children) { // Leaf node clicked
            const text = d.data.name;
            const cluster = d.data.name;
            const ngZone = this.injector.get(NgZone);
            ngZone.run(() => {
             this.router.navigate(['leafnodedetails', text], { queryParams: { cluster }})
            });


            //this.router.navigate(['leafnodedetails', text], { queryParams: { cluster }});

          }



          else {
            if (d.children) // Node expanded -> Collapse
              collapse(d);
            else
              { // Node collapsed -> Expand
                d.children = d._children
              }
            update(d);
          }
        })



    nodeEnter.append("circle")
        .attr("r", 4)
        .attr("stroke-width", 4);


    nodeEnter.append("text")
        .attr("dy", "0.35em")
        //.attr('fill', textColorSelect.value)
        .attr("x", (d:any) => d._children ? 20: -20)
        .attr("text-anchor", (d:any) => d._children ? "end" : "start")
        .text((d:any) => d.data.name)
        .text((d:any) => d.data.name.length>7? d.data.name.slice(0,7)+'...': d.data.name)

        .on("mouseover", d => div.transition()
        .duration(100)
        .style("opacity", 1))
.on("mousemove", (event, d:any) =>
div.style("left", event.pageX + "px").style("top", event.pageY + "px")
.html(
"<table style='font-size: 10px; font-family: sans-serif;' >"+
"<tr><td>Name: </td><td>"+d.data.name+"</td></tr>"+
"</table>")
)
.on("mouseout", d => div.transition()
        .duration(100)
        .style("opacity", 0))



    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter as any).transition(transition as any)
        .attr("transform", (d:any) => `translate(${d.x},${d.y})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition as any).remove()
        .attr("transform", d => `translate(${source.x},${source.y})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

    // Update the links…
    const link = gLink.selectAll("path")
    //.attr('stroke', linkColorSelect.value)
    .data(links, (d:any) => d.target.id);





    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append("path")
        .attr("d", d => {
        const o = {x: source.x0, y: source.y0};
        return diagonal({source: o as any, target: o as any});
        })


    // Transition links to their new position.
    link.merge(linkEnter as any).transition(transition as any)
        .attr("d", diagonal as any);



    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition as any).remove()
        .attr("d", d => {
            console.log(d)
        const o = {x: source.x, y: source.y};
        return diagonal({source: o as any, target: o as any}) as any;
        });

        gLink.selectAll('path')
        .attr('stroke', linkColorSelect.value);
	const label = gLink.selectAll("text")
    .data(links, (d:any) => d.target.id);


    // Enter any new links at the parent's previous position.
    const labelEnter = label.enter().append("text")
    //.attr('fill', textColorSelect.value)
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("fill", "Black")
    .style("font", "Bold 8px Arial")
    .attr("transform", function(d:any) {
        return "translate(" +
            ((d.source.x + d.target.x)/2) + "," +
            ((d.source.y + d.target.y)/2) + ")";
    })
    .attr("dx", ".35em")
    .attr("text-anchor", "middle")
    .text(function(d:any) {
        console.log(d)
         return d.target.data.rule;
    });


    // Transition links to their new position.
    label.merge(labelEnter as any).transition(transition as any).attr("transform", function(d:any) {
        return "translate(" +
            ((d.source.x + d.target.x)/2) + "," +
            ((d.source.y + d.target.y)/2) + ")";
    })
    .attr("dx", ".35em")
    .attr("text-anchor", "middle")




    // Transition exiting nodes to the parent's new position.
    label.exit().transition(transition as any).remove()
        .attr("transform", function(d:any) {
        return "translate(" +
            ((d.source.x)) + "," +
            ((d.source.y)) + ")";
    })
    // Stash the old positions for transition.
    root.eachBefore((d:any) => {
    d.x0 = d.x;
    d.y0 = d.y;
    });

   svg.selectAll('text')
    .attr('fill', textColorSelect.value);

   svg.selectAll('circle')
    .attr('fill', nodeColorSelect.value)


   // zoom and pan behaviour added
    const zoomBehaviours = d3.zoom()
    .scaleExtent([0.15, Infinity])
    .on('zoom', (event) => {
        svg.attr('transform', event.transform);

      });

        svg.call(zoomBehaviours as any);





}


update(root);


}

}


