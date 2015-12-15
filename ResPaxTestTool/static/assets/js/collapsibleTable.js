/**
 * Created by Shaquille on 10/12/2015.
 */
(function ($) {
    $(function () {
        $("tbody > tr:not([data-level='10'])").addClass("expandable sign folded");
        $("tbody > tr:not([data-level='1'])").hide();
        $("tbody > tr")
            .css("padding-left", function (index) {
                return 10 * parseInt($(this).data("level"), 10) + "px";
            });

        function range(lowEnd, highEnd) {
            // assert lowEnd >= 0 and highEnd < 100
            var validation = (lowEnd <= highEnd) && (lowEnd >= 0) && (highEnd < 100);
            if (!(validation)) {
                console.assert(validation,
                    'Function "range" received unlikely values: ' +
                    lowEnd + ' and ' + highEnd + "...");
            } else {
                var arr = [];
                while (lowEnd <= highEnd) {
                    arr.push(lowEnd++);
                }
                return arr;
            }
        }

        function name_range(fun, lowEnd, highEnd) {
            var arr = range(lowEnd, highEnd);
            jQuery.each(arr, function (index, value) {
                arr[index] = fun(value);
            });
            return arr;
        }

        function create_selector(level) {
            return "[data-level='" + level + "']";
        }

        function generateTable(array, array2){
            var table = document.getElementById("test-tool-table");
            var row = table.insertRow(0);
            for (var i = 0; i in array; i++){
                var start = 2;
                row = table.insertRow(start);
                row.insertCell(0).innerHTML = array[i];
                row.insertCell(1).innerHTML = array2[i];
                start--
            }


            console.log("gfdfgd");
        }

        $("tr.expandable").click(function () {
            var this_level = parseInt($(this).data("level"), 10);
            var this_level_selector = create_selector(this_level);
            var next_level_selector = create_selector(this_level + 1);
            var next_or_lower = name_range(create_selector,
                this_level + 1, 10); // TODO: find last level
            var this_or_higher = name_range(create_selector, 0, this_level);
            var node = $(this).nextUntil(this_or_higher.join(","));
            // different behaviour according to state (expanded / folded):
            if ($(this).hasClass("expanded")) {
                $(this).removeClass("expanded").addClass('folded');
                $(node).not("expanded").removeClass("expanded").addClass('folded');
                $(node).filter(next_or_lower.join(",")).hide();
            } else {
                $(this).addClass("expanded").removeClass('folded');
                $(node).filter(next_level_selector).show();
            }
        });
    })
})(jQuery);


