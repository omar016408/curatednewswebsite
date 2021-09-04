window.Apex = {
  chart: {
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
var spark1 = {
  chart: {
    id: 'spark1',
    group: 'sparks',
    type: 'line',
    height: 80,
    sparkline: {
      enabled: true
    },
    dropShadow: {
      enabled: true,
      top: 1,
      left: 1,
      blur: 2,
      opacity: 0.2,
    }
  },
  series: [{
    data: [25, 66, 41, 59, 25, 44, 12, 36, 9, 21]
  }],
  stroke: {
    curve: 'smooth'
  },
  markers: {
    size: 0
  },
  grid: {
    padding: {
      top: 20,
      bottom: 10,
      left: 110
    }
  },
  colors: ['#fff'],
  tooltip: {
    x: {
      show: false
    },
    y: {
      title: {
        formatter: function formatter(val) {
          return '';
        }
      }
    }
  }
}

var spark2 = {
  chart: {
    id: 'spark2',
    group: 'sparks',
    type: 'line',
    height: 80,
    sparkline: {
      enabled: true
    },
    dropShadow: {
      enabled: true,
      top: 1,
      left: 1,
      blur: 2,
      opacity: 0.2,
    }
  },
  series: [{
    data: [12, 14, 2, 47, 32, 44, 14, 55, 41, 69]
  }],
  stroke: {
    curve: 'smooth'
  },
  grid: {
    padding: {
      top: 20,
      bottom: 10,
      left: 110
    }
  },
  markers: {
    size: 0
  },
  colors: ['#fff'],
  tooltip: {
    x: {
      show: false
    },
    y: {
      title: {
        formatter: function formatter(val) {
          return '';
        }
      }
    }
  }
}

var spark3 = {
  chart: {
    id: 'spark3',
    group: 'sparks',
    type: 'line',
    height: 80,
    sparkline: {
      enabled: true
    },
    dropShadow: {
      enabled: true,
      top: 1,
      left: 1,
      blur: 2,
      opacity: 0.2,
    }
  },
  series: [{
    data: [47, 45, 74, 32, 56, 31, 44, 33, 45, 19]
  }],
  stroke: {
    curve: 'smooth'
  },
  markers: {
    size: 0
  },
  grid: {
    padding: {
      top: 20,
      bottom: 10,
      left: 110
    }
  },
  colors: ['#fff'],
  xaxis: {
    crosshairs: {
      width: 1
    },
  },
  tooltip: {
    x: {
      show: false
    },
    y: {
      title: {
        formatter: function formatter(val) {
          return '';
        }
      }
    }
  }
}

var spark4 = {
  chart: {
    id: 'spark4',
    group: 'sparks',
    type: 'line',
    height: 80,
    sparkline: {
      enabled: true
    },
    dropShadow: {
      enabled: true,
      top: 1,
      left: 1,
      blur: 2,
      opacity: 0.2,
    }
  },
  series: [{
    data: [15, 75, 47, 65, 14, 32, 19, 54, 44, 61]
  }],
  stroke: {
    curve: 'smooth'
  },
  markers: {
    size: 0
  },
  grid: {
    padding: {
      top: 20,
      bottom: 10,
      left: 110
    }
  },
  colors: ['#fff'],
  xaxis: {
    crosshairs: {
      width: 1
    },
  },
  tooltip: {
    x: {
      show: false
    },
    y: {
      title: {
        formatter: function formatter(val) {
          return '';
        }
      }
    }
  }
}

new ApexCharts(document.querySelector("#spark1"), spark1).render();
new ApexCharts(document.querySelector("#spark2"), spark2).render();
new ApexCharts(document.querySelector("#spark3"), spark3).render();
new ApexCharts(document.querySelector("#spark4"), spark4).render();


var res_cat = alasql('SELECT Leaning, date, SUM(titlesentiment)  AS title_sum, count(titlesentiment) as title_count, AVG(titlesentiment) as title_avg FROM ? GROUP BY Leaning, date',[news_data]);

var result_by_cats = {};
var all_result = {};

$.each(res_cat, function(k, v){
  var leaning = v.Leaning;
  if(result_by_cats[v.Leaning] == 'undefined' || result_by_cats[v.Leaning] == undefined){
    result_by_cats[v.Leaning] = {date:[], avg:[]};
  }

  result_by_cats[v.Leaning]['date'].push(v.date);
  result_by_cats[v.Leaning]['avg'].push(v.title_avg);

});


var res_by_date = alasql('SELECT date, AVG(titlesentiment) as t_avg FROM ? GROUP BY date',[news_data]);


var all_results = {};

$.each(res_by_date, function(k, v){

  all_results[v.date] = v.t_avg;

});

var labels = Object.keys(all_results);
var data = Object.values(all_results);

jQuery(document).ready(function($){

  var submit_btn = $('.frm_button_submit');
  var primary_email = $('#field_h8smbe421c399e6');
  var confirm_email = $('#field_rujl5');
  var primary_email_val = primary_email.val();
  var confirm_email_val = confirm_email.val();

  if(primary_email_val.length == 0 || confirm_email_val.length == 0){

    submit_btn.prop('disabled', true);

  }


  function verify_emails(){

    primary_email_val = primary_email.val();
    confirm_email_val = confirm_email.val();
    let next_primary = primary_email.next('.frm_description');
    let next_confirm = confirm_email.next('.frm_description');
    let error_html = $('.email_not_matched_error');
    error_html.remove();

    let error = `<div class="frm_error email_not_matched_error">Emails not matched.</div>`;

    if(primary_email_val == confirm_email_val){

      submit_btn.prop('disabled', false);


    }else{


      submit_btn.prop('disabled', true);
      next_primary.after(error);
      next_confirm.after(error);

    }
  }

  primary_email.on('change, keyup', verify_emails);
  confirm_email.on('change, keyup', verify_emails);


});
