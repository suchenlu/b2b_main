/**
 * Created by liuxinhua on 15/12/25.
 */

$(document).ready(function () {
    selectcity('dst_countries', 'dst_area');
    selectcity('dst_area', 'dst_province');
    selectcity('dst_province', 'dst_city');
    $('select#dst_city').change(function () {
        var area = $(this).val();
        $('#area').val(area);
    })
});

$(document).ready(function () {
    selectcity_1('zhan_countries', 'zhan_area');
    selectcity_1('zhan_area', 'zhan_province');
    selectcity_1('zhan_province', 'zhan_city');
    $('select#zhan_province').change(function () {
        var area_1 = $(this).val();
        $('#area_1').val(area_1);
    })
});

function selectcity(id,name) {
    $('#'+id).change(function () {
        v = $('#'+id).val();
        var url = '';
        if (id == 'dst_countries'){
            url = '/getcity/' + v + '?src=source';
        }else{
            url = '/getcity/' + v ;
        }
        //alert(url);
        $.get(url, function (data, status) {
        $("select[name=" + name + "]").empty();
        var option = $("<option>").val('').text('请选择...');
        $("select[name=" + name + "]").append(option);
        for (var i in data) {

        var option = $("<option>").val(i).text(data[i]);
        $("select[name=" + name + "]").append(option);
        }
});
});
}
function selectcity_1(id,name) {
    $('#'+id).change(function () {
        v = $('#'+id).val();
        var url = '';
        if (id == 'zhan_countries'){
            url = '/getcity/' + v + '?src=source';
        }else{
            url = '/getcity/' + v ;
        }
        //alert(url);
        $.get(url, function (data, status) {
        var option = $("<option>").val('').text('请选择...');
        $("select[name=" + name + "]").empty();
        $("select[name=" + name + "]").append(option);
        for (var i in data) {

        var option = $("<option>").val(i).text(data[i]);
        $("select[name=" + name + "]").append(option);
        }
});
});
}

$(document).ready(function () {

    if ($('input[type="radio"]:checked').val() == 'card') {
        $('div#license_num').hide();
        $('div#license_num').val('');
        $('div#license_num input').removeAttr('required');


    } else {
        $('div#license_num').show();
        $('div#license_num input').prop('required',true);
    }

})

$(document).ready(function () {

    $('input[type="radio"]').change(function (event) {

        if (this.value == 'card' ){
            //alert(1)
            $('div#license_num').slideUp(1000);
            $('div#license_num').val('');
            $('div#license_num input').removeAttr('required');

        } else {
            //alert(2)
        $('div#license_num').slideDown(1000);
        $('div#license_num input').prop('required',true);

        }
})
})

$(document).ready(function(){
    $('input[name="license_pic"]').change(function(){
        $(".lpic").slideUp(1000);
    })


})