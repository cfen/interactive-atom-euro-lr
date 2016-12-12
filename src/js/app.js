import Mustache from 'mustache'


import * as d3select from 'd3-selection'
import * as d3geo from 'd3-geo'
import * as d3geoprojection from 'd3-geo-projection';

import * as topojson from 'topojson'

import dataBase from './data/countries.json'

//import listHTML from './text/list.html'

import listHTML from './text/yearList.html'
import euroMap from './data/subunits.json'


var electionsArr;
				
var tgtEl = document.querySelector('.gv-wrapper');

initData();


function initData(){

	electionsArr = [];

    for(var k =0; k<dataBase.length -1; k++){
    	var election = {}
        election.Country = (dataBase[k].Country)
        dataBase[k].YYYY = (dataBase[k].Year.split("/")[dataBase[k].Year.split("/").length-1])
        election.Party = (dataBase[k].Party)
        election.YYYY = dataBase[k].YYYY
        electionsArr.push(election)
    }


    // var data = {
    //     elections: electionsArr 
    // }; 
    var yearsArr = groupBy(electionsArr,'YYYY');
	
	yearsArr = yearsArr.sort(function(a, b){
	    return Number(a.key)-Number(b.key)
	})

	yearsArr.reverse();

    var yearsData = {
        years: yearsArr 
    };
    
    buildFramework(yearsData)

} 

function buildFramework(data){

    var template = listHTML;
    var tplOp = Mustache.to_html(template, data);

    tgtEl.innerHTML = tplOp;

    addMaps();

}

function addMaps(){
	var mapHolders = document.getElementsByClassName('mapholder');

	for(var i = 0; i < mapHolders.length-1; i++){
		makeMap(mapHolders[i])
	}

}

function makeMap(el){
	var margin = {top: 90, right: 20, bottom: 36, left: 20}

	var padding = {top:0, right:0, bottom:0, left:0 } // left:220

	var width = 480, //940
        height = 480; //640

    //var center = d3geo.centroid(json);   



    var projection = d3geo.geoMercator(),
    	path = d3geo.geoPath(projection);

    // var projection = d3geoprojection.geoMercator
    //     .center([20, 53]) //20, 50
    //     .rotate([4.4, 0]) //4.4, 0
    //     .scale(480 * 1) //650 * 0.7

    //     .translate([width / 2, height / 2]);

    // var path = d3geo.path()
    //     .projection(aitoff);    

    var svg = d3select.select(el).append("svg")
        .attr("width", width - padding.left)
        .attr("height", height + margin.top);


}


function groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
        let v = key instanceof Function ? key(x) : x[key];
        let el = rv.find((r) => r && r.key === v);
        if (el) {
            el.values.push(x);
        }
        else {
            rv.push({
                key: v,
                values: [x]
            });
        }
        return rv;
    }, []);
}




