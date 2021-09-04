
$(document).ready(function(){

    // var res = alasql('SELECT date, AVG(titlesentiment) AS title_avg FROM ? GROUP BY date',[news_data]);
    // console.log(res);

    function load_graph(g_type){
        var g_type_lower = g_type.toLowerCase();
        var res_cat = alasql('SELECT `'+g_type+'` , date, count(`'+g_type+'`) as title_avg FROM ? GROUP BY `'+g_type+'`, date',[news_data]);
        console.log(res_cat);
        var result_by_cats = {};
        var result_by_cats_actual = {};
        var all_labels = [];
        var all_labels_date = [];



        $.each(res_cat, function(k, v){

            if(result_by_cats[v[g_type]] == 'undefined' || result_by_cats[v[g_type]] == undefined){
                result_by_cats[v[g_type]] = {};
            }

            if(result_by_cats_actual[v[g_type]] == 'undefined' || result_by_cats_actual[v[g_type]] == undefined){
                result_by_cats_actual[v[g_type]] = [];
            }

            result_by_cats_actual[v[g_type]].push(v.title_avg);


            if(v['date'] == ""){
                v.date = 0;
            }
            result_by_cats[v[g_type]][v.date] = v.title_avg;

            if(v.date != 0){
                all_labels.push(v.date);
                all_labels_date.push(getJsDateFromExcel(v.date));
            }


        });
        all_labels.push(0);
        all_labels_date.push(getJsDateFromExcel(0));
        all_labels = $.unique(all_labels);
        all_labels_date = $.unique(all_labels_date);



        var chart_data = {};

        $.each(all_labels, function(index, label){


            $.each(result_by_cats, function(cat, cat_data){

                if(chart_data[cat] == 'undefined' || chart_data[cat] == undefined){

                    chart_data[cat] = {name: cat, data: []};

                }
                let current_avg = cat_data[label];
                if(cat_data[label] == undefined || cat_data[label] == 'undefined'){
                    current_avg = 0;
                }

                if(current_avg != 0){
                    current_avg = current_avg.toFixed(3);
                }


                chart_data[cat]['data'].push(current_avg);

            });

        });


        var index_counter = 0;
        var select_option = [];
        var first_selected = '';


        $.each(result_by_cats_actual, function(cat, data){

            var c_obj = {value: cat, text: cat};

            if(index_counter == 2){
                first_selected = cat;
            }

            select_option.push(c_obj);
            index_counter++;

        });

        const cat_select = new SlimSelect({
            select: '#'+g_type_lower+'_selection'
        });

        cat_select.setData(select_option);
        cat_select.set([first_selected]);


        var optionsLine = {
            chart: {
                height: 500,
                type: 'line',
                zoom: {
                    enabled: false
                },
                toolbar:{
                    show: true,

                },
                dropShadow: {
                    enabled: true,
                    top: 3,
                    left: 2,
                    blur: 4,
                    opacity: 1,
                }
            },
            stroke: {
                curve: 'smooth',
                width: 2
            },
            //colors: ["#3F51B5", '#2196F3'],
            series: [],
            title: {
                text: 'Curated News',
                align: 'left',
                offsetY: 10,
                offsetX: 20,
                style:{
                    'font-size': '22px',
                }
            },
            markers: {
                size: 4,
                strokeWidth: 0,
                hover: {
                    size: 9
                }
            },
            grid: {
                show: true,
                padding: {
                    bottom: 0
                }
            },
            labels: all_labels_date,
            xaxis: {
                tooltip: {
                    enabled: false
                },
                title: {
                    text: "Date",
                    rotate: -90,
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        color: "#fff",
                        fontSize: '12px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 600,
                        cssClass: 'apexcharts-yaxis-title',
                    },
                }
            },
            yaxis: {
                title: {
                    text: g_type+" Count",
                    rotate: 90,
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        color: "#fff",
                        fontSize: '12px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 600,
                        cssClass: 'apexcharts-yaxis-title',
                    },
                }
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                offsetY: -20
            }
        }
        var chartLine = new ApexCharts(document.querySelector('#line-'+g_type_lower+'-graph'), optionsLine);
        chartLine.render();

        $('.load_graph_'+g_type_lower).on('click', function(e){
            e.preventDefault();
            let selected_values = $('#'+g_type_lower+'_selection').val();
            let showing_chart_data = {};
            $.each(selected_values, function(c_k, c_v){
                showing_chart_data[c_v] = chart_data[c_v];
            });

            // console.log(Object.values(chart_data));
            var chart_show_data = Object.values(showing_chart_data);
            // chart_show_data = [chart_show_data[0]];

            chartLine.updateSeries(chart_show_data);

        });

        $('.load_graph_'+g_type_lower).click();


    }

    // load_graph('Source');
    // load_graph('Topic');
    // load_graph('President');

});
