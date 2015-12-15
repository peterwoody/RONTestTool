(function ($) {
    $(function () {
        $('.table-expandable').each(function () {
            var table = $(this);
            //table.children('thead').children('tr').append('<th></th>');
            //var collapse = table.getElementById('collapsible');
            //table.getElementById("collapsible").hide();
            var tableRows = table.children('tbody').children('tr');
            for (var i = 0; i in tableRows; i++){
                var rowId = table.children('tbody').children('tr')[i].id;
                if (rowId !== '1'){
                    table.children('tbody').children('tr#'+rowId).hide();
                }

            }


            //table.children('tbody').children('tr').hide();
            tableRows.click(function () {
                var element = $(this);

                var data_level = parseInt(element[0].id);
                var next_data_level = parseInt(data_level)+1;
                var previous_data_level;
                if (data_level === 1){
                    previous_data_level = parseInt(data_level);
                }else{
                    previous_data_level = parseInt(data_level)-1;
                }
                console.log(tableRows[next_data_level].style.display);
                console.log(element.next('tr'));
                if (element.next('tr')[0].style.display === 'none' ){
                    element.nextUntil('.'+data_level).filter('.'+next_data_level).toggle(1);
                } else {
                     console.log(data_level);
                        //element.next('tr')[0].id;
                        next_data_level = parseInt(element.next('tr')[0].id);
                        console.log(next_data_level);
                        if (next_data_level > data_level) {
                            element.closest('.'+previous_data_level, '.'+data_level).nextUntil().filter(':visible').toggle(1);
                        }
                    /*for (var i = 0; i in tableRows; i++){
                         console.log(data_level);
                        //element.next('tr')[0].id;
                        next_data_level = parseInt(element.next('tr')[0].id);
                        console.log(next_data_level);
                        if (next_data_level > data_level){
                            element.nextUntil('.'+previous_data_level).filter(':visible').toggle(1);
                            //element.nextAll('.'+next_data_level).filter(':visible').toggle(1);
                        }

                    }*/


                }


                //if (tableRows[next_data_level-1].style.display === 'none' ){
                 //   element.nextUntil('tr#1').filter('tr#'+next_data_level).toggle(1);
                    //element.find(".table-expandable-arrow").toggleClass("up");
                //} else {
                    //element.nextAll('tr').filter('tr#'+next_data_level, previous_data_level).toggle(1);


                    /*for (var i = 0; i in tableRows; i++){
                        if (data_level < tableRows[i].id){
                        //console.log(element.nextSibling);
                         element.next('tr#'+tableRows[i].id).filter(':visible').toggle(1);
                    }else {
                        console.log('else');
                       // element.next('tr#'+data_level).filter(':visible').toggle(1);
                    }
                    }*/


                    //nextUntil(data_level || previous_data_level);

                    //element.find(".table-expandable-arrow").toggleClass("up");
                //}

            });
            /*table.children('tbody').children('tr').filter(':even').each(function () {
                var element = $(this);
                element.append('<td><div class="table-expandable-arrow"></div></td>');
            });*/
        });
    });
})(jQuery); 