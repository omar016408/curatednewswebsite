window.Apex = {
    chart: {
        background: '#2b2d3e',
        foreColor: '#ccc',
        toolbar: {
            show: false
        },
        stroke: {
            width: 3
        },
        dataLabels: {
            enabled: false
        },
        tooltip: {
            theme: 'dark'
        },
        grid: {
            borderColor: "#535A6C",
            xaxis: {
                lines: {
                    show: true
                }
            }
        }
    }
}

function getJsDateFromExcel(excelDate) {

    // JavaScript dates can be constructed by passing milliseconds
    // since the Unix epoch (January 1, 1970) example: new Date(12312512312);

    // 1. Subtract number of days between Jan 1, 1900 and Jan 1, 1970, plus 1  (Google "excel leap year bug")
    // 2. Convert to milliseconds.
    var date = new Date((excelDate - (25567 - 1))*86400*1000);
    var options = {year: 'numeric', month: 'long', day: 'numeric' };
    var date_str = date.toLocaleDateString("en-US", options);
    return date_str;

}


$(document).ready(function(){

    // var res = alasql('SELECT date, AVG(titlesentiment) AS title_avg FROM ? GROUP BY date',[news_data]);
    // console.log(res);

    news_data = JSON.parse(news_data);

    var options = {year: 'numeric', month: 'long', day: 'numeric' };
    $.each(news_data, function(k, v){
        v['titlesentiment'] = parseFloat(v['titlesentiment']);
        v['titlewordcount'] = parseInt(v['titlewordcount']);
        v['date'] = parseFloat(v['date'] ? v['date'] : 0);
        news_data[k] = v;
    });


    function load_all_graph(g_type){

        var g_type_lower = g_type.toLowerCase();

        var res_cat = alasql('SELECT `'+g_type+'`, date, SUM(titlesentiment)  AS title_sum, count(titlesentiment) as title_count, AVG(titlesentiment) as title_avg FROM ? GROUP BY `'+g_type+'`, date',[news_data]);

        var result_by_cats = {};
        var result_by_cats_actual = {};
        var all_labels = [];
        var all_labels_date = [];

        $.each(res_cat, function(k, v){
            var leaning = v[g_type];
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

        var spark_counter = 1;
        var index_counter = 0;
        var select_option = [];
        var first_selected = '';


        $.each(result_by_cats_actual, function(cat, data){

            var c_obj = {value: cat, text: cat};

           if(index_counter == 1){
               first_selected = cat;
           }

            select_option.push(c_obj);

            if(spark_counter < 4){
                spark_counter++;
            }else{
                spark_counter = 1;
            }

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
                size: 0,
                strokeWidth: 0,
                hover: {
                    size: 0
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
                    text: "Headlines Sentiment",
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

    load_all_graph('Leaning');
    load_all_graph('Source');
    load_all_graph('President');
    load_all_graph('Topic');


    function find_news(text){
        text = text.toLowerCase();
        var query = "SELECT * FROM ? WHERE LOWER(title) LIKE '%"+text+"%'";
        var result = alasql(query,[news_data]);
        var per_page = 20;
        var total_record = news_data.length;
        var total_pages = Math.ceil(result.length/per_page);
        return {
          data: result,
          result_found: result.length,
          total_record: news_data.length,
          'per_page': per_page,
          'total_pages': total_pages
        };
    }

    var load_more_btn = $('.load_more button');
    var load_more_parent = $('.load_more');


    $('.search_news_btn').on('click', function(e){
        e.preventDefault();
        var text_to_search = $('input.search_news').val();
        var found_news = find_news(text_to_search);
        var news_data_html = '';
        $('.result_box').html('<div class="alert alert-light text-center">Loading Results...</div>');
        $('.result_row').addClass('d-none');

        if(found_news.result_found > 0){
            var news_page_counter = 1;
            var news_counter = 1;

            $.each(found_news.data, function(single_key, single_news){

                let single_news_classes = '';
                single_news_classes += 'news_page_'+news_page_counter+' ';
                single_news_classes += 'news_'+news_counter+' ';


                if(news_page_counter > 1){
                    single_news_classes += 'd-none';
                }


                var single_news = `<div class="mb-5 single_news `+single_news_classes+`">
                              <div><a href="`+single_news.link+`">`+single_news.title+`</a></div>
                              <div class="">
                                 <span class="badge badge-primary text-white" title="Leaning: `+single_news.Leaning+`">`+single_news.Leaning+`</span>
                                 <span class="badge badge-primary text-white" title="Topic: `+single_news.Topic+`">`+single_news.Topic+`</span>
                                 <span class="badge badge-primary text-white" title="Source: `+single_news.Source+`">`+single_news.Source+`</span>
                              </div>
                           </div>`;

                news_data_html += single_news;

                news_counter++;
                if(news_counter % found_news.per_page == 1){
                    news_page_counter++;
                }




            });

            $('.result_row').removeClass('d-none');
            $('.showing').html(found_news.result_found >= found_news.per_page ? found_news.per_page : found_news.result_found);
            $('.from_results').html(found_news.result_found);

        }else{

            news_data_html += '<div class="alert alert-light text-center">No Result Found</div>';

        }

        if(found_news.total_pages > 1){

            load_more_parent.show();
            load_more_btn.data('total', found_news.total_pages);
            load_more_btn.data('current', 1);
        }else{
            load_more_parent.hide();
        }

        $('.result_box').html(news_data_html);


    });

    load_more_btn.on('click', function(e){
        e.preventDefault();
        let current = $(this).data('current');
        let total = $(this).data('total');

        let next_page = current + 1;
        let next_page_class = '.news_page_'+next_page;

        if(next_page == total){
            load_more_parent.hide();
        }

        $(next_page_class).removeClass('d-none');
        $(this).data('current', next_page);

        $('.showing').html($('.single_news:visible').length);


    });








});
