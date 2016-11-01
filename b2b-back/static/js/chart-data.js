$(function () {		   
        $('#pie').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: true,
                type: 'pie'
            },
            credits:{
			     enabled:false
			},
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: [{
                    name: 'IE',
                    y: 49,
                    color: '#FD6120'
                }, {
                    name: 'Chrome',
                    y: 50,
                    color:'#2F97BC'
                }, {
                    name: 'FF',
                    y: 40,
                    color:'#F3AC1E',
                    sliced: true,
                    selected: true  
                }, {
                    name: 'Safari',
                    y: 30,
                    color:'#B62317'
                }]
            }]
        });
});